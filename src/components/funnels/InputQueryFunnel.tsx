import { useState } from "react";
import { Input, Stack, Button } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";

interface inputQueryProps {
    onNext: (selected: string) => void;
    placeholder: string;
    onQuery: (userInput: string) => UseMutationResult;
    onDisplay: () => React.ReactElement[];
}

export const InputQueryFunnel = ({
    onNext,
    placeholder,
    onQuery,
    onDisplay,
}: inputQueryProps) => {
    const [userInput, setUserInput] = useState("");
    const [mutateResult, setMutateResult] = useState<
        undefined | UseMutationResult
    >(undefined);

    return (
        <form>
            <Stack spacing={1}>
                <Input
                    placeholder={placeholder}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                {mutateResult === undefined ||
                mutateResult.isError ||
                mutateResult.isPending ? (
                    <Button
                        type="submit"
                        onSubmit={() => setMutateResult(onQuery(userInput))}
                    >
                        Submit
                    </Button>
                ) : (
                    <></>
                )}
            </Stack>
            <Stack spacing={2}>
                {mutateResult !== undefined &&
                !mutateResult.isError &&
                !mutateResult.isPending &&
                mutateResult.isSuccess ? (
                    <>
                        onDisplay();
                        <Button
                            type="submit"
                            onSubmit={() => onNext(userInput)}
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <></>
                )}
            </Stack>
        </form>
    );
};
