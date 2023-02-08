import CustomButton from "components/common/CustomButton";

const AddRemoveLiquidityButton = ({action, selectedAction, onClick, ...props}) => {
    const title = (action == 'add') ? "Add" : "Remove";
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
        <button onClick={e => onClick(e, action)} className={`${action == 'add' ?`bg-green-600 rounded-l-full` :`bg-orange-600 rounded-r-full`} px-6 w-1/2 text-center py-2 text-white font-semibold cursor-pointer`}>{title}</button>
    );
}

export default AddRemoveLiquidityButton;