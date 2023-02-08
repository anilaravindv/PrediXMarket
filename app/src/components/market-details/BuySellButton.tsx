import CustomButton from "components/common/CustomButton";

const BuySellButton = ({action, selectedAction, onClick, ...props}) => {
    const title = (action == 'buy') ? "Buy" : "Sell";
    let styleProps = {
        bgColor: "#101010",
        bgHover: "#101010",
        border: '',
        borderRadius: '',
        textColor: "#ffffff",
    }

    if (action == selectedAction) {
        styleProps.bgColor = "#F9A13D";
        styleProps.bgHover = "#F9A13D";
        styleProps.border = "2px solid #000";
        styleProps.borderRadius = "6px";
        styleProps.textColor = "#000000";
    }

    return (
        <button className={`${action == 'buy' ? `bg-green-600 rounded-l-full` :`bg-orange-600 rounded-r-full`} px-8 w-1/2 text-center py-2 bg-green-600 text-white font-semibold`} 
                onClick={e => onClick(e, action)}
        >
            {title}
        </button>
    );
}   

export default BuySellButton;