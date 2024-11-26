import { useState, ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";

export interface Address {
    street: string;
    city: string;
    prefecture: string;
    postalcode: string;
    country: string;
}

export interface RequestProps {
    id: string;
    title: string;
    memberNum: string;
    payNum: string;
    currency: string;
    subtitle: string;
    content: string;
    wishlist: string;
    date: Dayjs;
    address: Address;
    foodExpense: boolean;
    transportExpense: boolean;
    prepMaterial: string;
}

export const useRequestForm = () => {
    const [title, setTitle] = useState("");
    const [memberNum, setMemberNum] = useState("1");
    const [payNum, setPayNum] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [wishlist, setWishlist] = useState("");
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [address, setAddress] = useState<Address>({
        street: "",
        city: "",
        prefecture: "",
        postalcode: "",
        country: "",
    });
    const [foodExpense, setFoodExpense] = useState(false);
    const [transportExpense, setTransportExpense] = useState(false);
    const [prepMaterial, setPrepMaterial] = useState("");

    // 이벤트 핸들러들
    const handleInputChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setter(e.target.value);
        };

    const handleSelectChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: ChangeEvent<{ value: string }>) => {
            setter(e.target.value);
        };

    const handleCheckboxChange =
        (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            setter(e.target.checked);
        };

    const handleDateChange = (newDate: Dayjs | null) => {
        setDate(newDate);
    };

    return {
        title,
        handleTitleChange: handleInputChange(setTitle),
        memberNum,
        handleMemberNumChange: handleSelectChange(setMemberNum),
        payNum,
        handlePayNumChange: handleInputChange(setPayNum),
        currency,
        handleCurrencyChange: handleSelectChange(setCurrency),
        subtitle,
        handleSubtitleChange: handleInputChange(setSubtitle),
        content,
        handleContentChange: handleInputChange(setContent),
        wishlist,
        handleWishlistChange: handleInputChange(setWishlist),
        date,
        handleDateChange,
        address,
        setAddress,
        foodExpense,
        handleFoodExpenseChange: handleCheckboxChange(setFoodExpense),
        transportExpense,
        handleTransportExpenseChange: handleCheckboxChange(setTransportExpense),
        prepMaterial,
        handlePrepMaterialChange: handleInputChange(setPrepMaterial),
    };
};
