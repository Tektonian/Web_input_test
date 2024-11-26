/* eslint-disable */
import * as React from "react";

interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export interface Session {
    user?: User;
    expires: number;
}

interface AuthClientConig {
    baseUrl: string;
    basePath: string;
    baseUrlServer: string;
    basePathServer: string;
    _session?: Session | null | undefined;
    _lastSync: number;
    _getSession: (...args: any[]) => any;
}

interface ClientSafeProvider {
    id: string;
    name: string;
    type: "oauth" | "email" | "credentials";
    signInUrl: string;
    callbackUrl: string;
    redirectTo: string;
}

interface GetSessionParams {
    event?: "storage" | "timer" | "hidden" | string;
    triggerEvent?: boolean;
    broadcast?: boolean;
}

const _AUTHCONFIG: AuthClientConig = {
    baseUrl: "http://localhost:3000",
    basePath: "/api/auth",
    baseUrlServer: "http://localhost:8080",
    basePathServer: "/api/auth",
    _lastSync: 0,
    _session: undefined,
    _getSession: () => {},
};

let broadcastChannel: BroadcastChannel | null = null;

const fetchData = async (
    path: string,
    authConfig: AuthClientConig,
    req: any = {},
) => {
    const url = `http://localhost:8080/api/auth/${path}`;
    try {
        const options: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...(req?.headers?.cookie ? { cookie: req.headers.cookie } : {}),
            },
            credentials: "include",
        };

        if (req?.body) {
            options.body = JSON.stringify(req.body);
            options.method = "POST";
        }

        const res = await fetch(url, options);
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

function getNewBroadcastChannel() {
    return new BroadcastChannel("auth");
}

function broadcast() {
    if (typeof BroadcastChannel === "undefined") {
        return {
            postMessage: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
        };
    }

    if (broadcastChannel === null) {
        broadcastChannel = getNewBroadcastChannel();
    }

    return broadcastChannel;
}

const getCsrfToken = async () => {
    const res = await fetchData("csrf", _AUTHCONFIG);
    return res?.csrfToken ?? "";
};

export const getSession = async (params?: GetSessionParams) => {
    const session = await fetchData("session", _AUTHCONFIG, params);
    if (params?.broadcast ?? true) {
        const broadcastChannel = getNewBroadcastChannel();
        broadcastChannel.postMessage({
            event: "session",
            data: { trigger: "getSession" },
        });
    }
    return session;
};

const getProviders = async () => {
    return fetchData("providers", _AUTHCONFIG);
};

export type UpdateSession = (data?: any) => Promise<Session | null>;

export type SessionContextValue<R extends boolean = false> = R extends true
    ?
          | { update: UpdateSession; data: Session; status: "authenticated" }
          | { update: UpdateSession; data: null; status: "loading" }
    :
          | { update: UpdateSession; data: Session; status: "authenticated" }
          | {
                update: UpdateSession;
                data: null;
                status: "unauthenticated" | "loading";
            };

export const SessionContext = React.createContext?.<
    SessionContextValue | undefined
>(undefined);

interface UseSessionOption<R extends boolean> {
    required: R;
    onUnauthenticated?: () => void;
}

export const useSession = <R extends boolean>(
    options?: UseSessionOption<R>,
): SessionContextValue<R> => {
    // @ts-expect-error Satisfy TS if branch on line below
    const value: SessionContextValue<R> = React.useContext(SessionContext);
    if (value === undefined) {
        throw new Error("useSession must be wrapped in a <SessionProvider />");
    }

    const { required, onUnauthenticated } = options ?? {};

    const requiredAndNotLoading =
        required ?? value.status === "unauthenticated";

    React.useEffect(() => {
        if (requiredAndNotLoading) {
            const url = `http://localhost:8080/api/auth/signin?${new URLSearchParams(
                {
                    error: "SessionRequired",
                    callbackUrl: window.location.href,
                },
            )}`;
            if (onUnauthenticated) onUnauthenticated();
            else window.location.href = url;
        }
    }, [requiredAndNotLoading, onUnauthenticated]);

    if (requiredAndNotLoading) {
        return {
            data: null,
            update: value.update,
            status: "loading",
        };
    }

    return value;
};

interface SignInOptions extends Record<string, unknown> {
    redirectTo?: string;
    redirect?: boolean;
}

type SignInAuthorizationParams =
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams;

interface SignInResponse {
    error: string | undefined;
    code: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}

export const signIn = async (
    provider?: "oauth" | "email" | "credentials",
    options?: SignInOptions,
    authorizationParams?: SignInAuthorizationParams,
) => {
    const { redirect = true } = options ?? {};
    const redirectTo = options?.redirectTo ?? window.location.href;

    const baseUrl = "http://localhost:8080/api/auth";
    const providers = await getProviders();

    if (!providers) {
        window.location.href = `${baseUrl}/error`;
        return;
    }

    if (!provider || !(provider in providers)) {
        window.location.href = `${baseUrl}/signin?${new URLSearchParams({
            callbackUrl: redirectTo,
        })}`;
        return;
    }

    const isCredentials = providers[provider].type === "credentials";
    const isEmail = providers[provider].type === "email";
    const isSupportingReturn = isCredentials || isEmail;

    const signInUrl = `${baseUrl}/${
        isCredentials ? "callback" : "signin"
    }/${provider}`;

    const csrfToken = await getCsrfToken();
    const res = await fetch(
        `${signInUrl}?${new URLSearchParams(authorizationParams)}`,
        {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Auth-Return-Redirect": "1",
            },
            // @ts-expect-error
            body: new URLSearchParams({
                ...options,
                csrfToken,
                callbackUrl: redirectTo,
            }),
        },
    );

    const data = await res.json();

    if (redirect || !isSupportingReturn) {
        const url = data.url ?? redirectTo;
        window.location.href = url;
        // If url contains a hash, the browser does not reload the page. We reload manually
        if (url.includes("#")) window.location.reload();
        return;
    }

    const error = new URL(data.url).searchParams.get("error");
    const code = new URL(data.url).searchParams.get("code");

    if (res.ok) {
        await _AUTHCONFIG._getSession({ event: "storage" });
    }

    return {
        error,
        code,
        status: res.status,
        ok: res.ok,
        url: error ? null : data.url,
    } as any;
};

interface SingOutResponse {
    url: string;
}

interface SignOutParams {
    redirectTo?: string;
    redirect?: boolean;
}

export const signOut = async (options?: SignOutParams) => {
    const redirectTo = options?.redirectTo ?? window.location.href;

    const baseUrl = "http://localhost:8080/api/auth";
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${baseUrl}/signout`, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({ csrfToken, callbackUrl: redirectTo }),
    });
    const data = await res.json();

    broadcast().postMessage({ event: "session", data: { trigger: "signout" } });

    if (options?.redirect ?? true) {
        const url = data.url ?? redirectTo;
        window.location.href = url;
        // If url contains a hash, the browser does not reload the page. We reload manually
        if (url.includes("#")) window.location.reload();
        // @ts-ignore
        return;
    }

    _AUTHCONFIG._getSession({ event: "storage" });

    return data;
};

interface SessionProviderProps {
    children: React.ReactNode;
    session?: Session | null;
    baseUrl?: string;
    basePath?: string;
    /**
     * A time interval (in seconds) after which the session will be re-fetched.
     * If set to `0` (default), the session is not polled.
     */
    refetchInterval?: number;
    /**
     * `SessionProvider` automatically refetches the session when the user switches between windows.
     * This option activates this behaviour if set to `true` (default).
     */
    refetchOnWindowFocus?: boolean;
    /**
     * Set to `false` to stop polling when the device has no internet access offline (determined by `navigator.onLine`)
     *
     * [`navigator.onLine` documentation](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
     */
    refetchWhenOffline?: false;
}

export function SessionProvider(props: SessionProviderProps) {
    if (!SessionContext) {
        throw new Error("React Context is unavailable in Server Components");
    }

    const { children, basePath, refetchInterval, refetchWhenOffline } = props;

    if (basePath) _AUTHCONFIG.basePath = basePath;

    /**
     * If session was `null`, there was an attempt to fetch it,
     * but it failed, but we still treat it as a valid initial value.
     */
    const hasInitialSession = props.session !== undefined;

    /** If session was passed, initialize as already synced */
    _AUTHCONFIG._lastSync = hasInitialSession ? now() : 0;

    const [session, setSession] = React.useState(() => {
        if (hasInitialSession) _AUTHCONFIG._session = props.session;
        return props.session;
    });

    /** If session was passed, initialize as not loading */
    const [loading, setLoading] = React.useState(!hasInitialSession);

    React.useEffect(() => {
        _AUTHCONFIG._getSession = async ({ event } = {}) => {
            try {
                const storageEvent = event === "storage";
                // We should always update if we don't have a client session yet
                // or if there are events from other tabs/windows
                if (storageEvent || _AUTHCONFIG._session === undefined) {
                    _AUTHCONFIG._lastSync = now();
                    _AUTHCONFIG._session = await getSession({
                        broadcast: !storageEvent,
                    });
                    setSession(_AUTHCONFIG._session);
                    return;
                }

                if (
                    // If there is no time defined for when a session should be considered
                    // stale, then it's okay to use the value we have until an event is
                    // triggered which updates it
                    !event ||
                    // If the client doesn't have a session then we don't need to call
                    // the server to check if it does (if they have signed in via another
                    // tab or window that will come through as a "stroage" event
                    // event anyway)
                    _AUTHCONFIG._session === null ||
                    // Bail out early if the client session is not stale yet
                    now() < _AUTHCONFIG._lastSync
                ) {
                    return;
                }

                // An event or session staleness occurred, update the client session.
                _AUTHCONFIG._lastSync = now();
                _AUTHCONFIG._session = await getSession();
                setSession(_AUTHCONFIG._session);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        _AUTHCONFIG._getSession();

        return () => {
            _AUTHCONFIG._lastSync = 0;
            _AUTHCONFIG._session = undefined;
            _AUTHCONFIG._getSession = () => {};
        };
    }, []);

    React.useEffect(() => {
        const handle = () => _AUTHCONFIG._getSession({ event: "storage" });
        // Listen for storage events and update session if event fired from
        // another window (but suppress firing another event to avoid a loop)
        // Fetch new session data but tell it to not to fire another event to
        // avoid an infinite loop.
        // Note: We could pass session data through and do something like
        // `setData(message.data)` but that can cause problems depending
        // on how the session object is being used in the client; it is
        // more robust to have each window/tab fetch it's own copy of the
        // session object rather than share it across instances.
        broadcast().addEventListener("message", handle);
        return () => broadcast().removeEventListener("message", handle);
    }, []);

    React.useEffect(() => {
        const { refetchOnWindowFocus = true } = props;
        // Listen for when the page is visible, if the user switches tabs
        // and makes our tab visible again, re-fetch the session, but only if
        // this feature is not disabled.
        const visibilityHandler = () => {
            if (refetchOnWindowFocus && document.visibilityState === "visible")
                _AUTHCONFIG._getSession({ event: "visibilitychange" });
        };
        document.addEventListener("visibilitychange", visibilityHandler, false);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                visibilityHandler,
                false,
            );
    }, [props.refetchOnWindowFocus]);

    const isOnline = useOnline();
    // TODO: Flip this behavior in next major version
    const shouldRefetch = refetchWhenOffline !== false || isOnline;

    React.useEffect(() => {
        if (refetchInterval && shouldRefetch) {
            const refetchIntervalTimer = setInterval(() => {
                if (_AUTHCONFIG._session) {
                    _AUTHCONFIG._getSession({ event: "poll" });
                }
            }, refetchInterval * 1000);
            return () => clearInterval(refetchIntervalTimer);
        }
    }, [refetchInterval, shouldRefetch]);

    const value: any = React.useMemo(
        () => ({
            data: session,
            status: loading
                ? "loading"
                : session
                ? "authenticated"
                : "unauthenticated",
            async update(data: any) {
                if (loading) return;
                setLoading(true);
                const newSession = await fetchData(
                    "session",
                    _AUTHCONFIG,
                    typeof data === "undefined"
                        ? undefined
                        : { body: { csrfToken: await getCsrfToken(), data } },
                );
                setLoading(false);
                if (newSession) {
                    setSession(newSession);
                    broadcast().postMessage({
                        event: "session",
                        data: { trigger: "getSession" },
                    });
                }
                return newSession;
            },
        }),
        [session, loading],
    );

    return (
        // @ts-ignore
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

/** @internal  */
export function useOnline() {
    const [isOnline, setIsOnline] = React.useState(
        typeof navigator !== "undefined" ? navigator.onLine : false,
    );

    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    React.useEffect(() => {
        window.addEventListener("online", setOnline);
        window.addEventListener("offline", setOffline);

        return () => {
            window.removeEventListener("online", setOnline);
            window.removeEventListener("offline", setOffline);
        };
    }, []);

    return isOnline;
}

export function now() {
    return Math.floor(Date.now() / 1000);
}
