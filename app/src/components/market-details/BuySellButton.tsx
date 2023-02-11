import CustomButton from "components/common/CustomButton";

const BuySellButton = ({ action, selectedAction, onClick, ...props }) => {
    const title = action == "buy" ? "Buy" : "Sell";
    let styleProps = {
        bgColor: "#101010",
        bgHover: "#101010",
        border: "",
        borderRadius: "",
        textColor: "#ffffff",
    };

    if (action == selectedAction) {
        styleProps.bgColor = "#F9A13D";
        styleProps.bgHover = "#F9A13D";
        styleProps.border = "2px solid #000";
        styleProps.borderRadius = "6px";
        styleProps.textColor = "#000000";
    }

    return (
        <button
            className={`border-b-4 border-b-white ${
                selectedAction == action ? `text-sky-blue !border-b-sky-blue` : ``
            } mx-5 px-1 text-lg py-4 text-black font-semibold`}
            onClick={(e) => onClick(e, action)}
        >
            {title}
        </button>
    );
};

export default BuySellButton;
