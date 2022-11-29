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
        <CustomButton title={title} {...props} {...styleProps} padding={"7px 38px"} onClick={e => onClick(e, action)}/>
    );
}

export default AddRemoveLiquidityButton;