import CustomButton from "components/common/CustomButton";

const OutcomeButton = ({outcome, selectedOutcome, price, onClick, ...props}) => {
    let p = price.toFixed(4);
    const title = (outcome == 'Y') ? `Yes ${p} SOL` : `No ${p} SOL`;
    let styleProps = {
        bgColor: "#101010",
        bgHover: "#101010",
        borderRadius: "6px",
        textColor: "#ffffff",
        border: "2px solid #FEE4BA",
    }

    if (outcome == selectedOutcome) {
        styleProps.bgColor = "#FEE5B9";
        styleProps.bgHover = "#FEE5B9";
        styleProps.borderRadius = "6px";
        styleProps.textColor = "#000000";
        styleProps.border = "2px solid #000";
    }

    return (
        <CustomButton title={title} {...props} {...styleProps} padding={"12px 32px"} onClick={e => onClick(e, outcome)}/>
    );
}

export default OutcomeButton;