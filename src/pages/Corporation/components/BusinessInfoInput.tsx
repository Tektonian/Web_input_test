import React from "react";
import { ShortTextInput } from "web_component";

interface CorpProfileProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const CorpProfileInput: React.FC<CorpProfileProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <div>
            <h3>Corporate Profile</h3>
            <ShortTextInput
                control={control}
                name="name"
                label="Company Name"
            />
            <ShortTextInput
                control={control}
                name="nationality"
                label="Nationality"
            />
            <ShortTextInput
                control={control}
                name="corp_address"
                label="Corporate Address"
            />
            <ShortTextInput
                control={control}
                name="corp_num"
                label="Corporate Number"
            />
            <ShortTextInput
                control={control}
                name="review_count"
                label="Review Count"
            />
            <ShortTextInput
                control={control}
                name="biz_type"
                label="Business Type"
            />
            <ShortTextInput
                control={control}
                name="logo_image"
                label="Logo Image URL"
            />
            <ShortTextInput
                control={control}
                name="homepage_url"
                label="Homepage URL"
            />
            <button type="button" onClick={onNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default CorpProfileInput;
