import { useEffect } from "react";
import { useGovernment } from "../hooks/useGovernment";
export const Government = () => {
    const { governInfo, governMutation } = useGovernment();
    useEffect(() => {
        governMutation.mutate({ instId: "1741000", instName: "행정" });
    }, []);

    return (
        <div>
            {governInfo.full_name +
                " / " +
                governInfo.codeNum +
                " / " +
                governInfo.instType}
        </div>
    );
};
