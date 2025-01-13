import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SessionProvider } from "./hooks/Session";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
} from "@mui/material/styles";

const theme = responsiveFontSizes(
    createTheme({
        typography: {
            fontFamily: [
                '"Noto Sans KR"',
                "-apple-system",
                "BlinkMacSystemFont",
                '"Segoe UI"',
                "Roboto",
                '"Helvetica Neue"',
                "Arial",
                "sans-serif",
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(","),
        },
    }),
);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <ThemeProvider theme={theme}>
            <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </SessionProvider>
        </ThemeProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
