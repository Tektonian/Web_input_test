import { useState } from "react";
import { Input, Stack, Button } from "@mui/joy";

interface inputFunnelProps {
    onNext: (userInput: string) => void;
    placeholder: string;
}

export const InputFunnel = ({ onNext, placeholder }: inputFunnelProps) => {
    const [userInput, setUserInput] = useState("");

    return (
        <form>
            <Stack spacing={1}>
                <Input
                    placeholder={placeholder}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <Button type="submit" onSubmit={() => onNext(userInput)}>
                    Submit
                </Button>
            </Stack>
        </form>
    );
};
