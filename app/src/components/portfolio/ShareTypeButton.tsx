import CustomButton from "components/common/CustomButton";

const ShareTypeButton = ({title, type, selectedType, onClick, ...props}) => {
    let styleProps = {
        bgColor: "#101010",
        bgHover: "#101010",
        border: '1px solid #828282',
        borderRadius: '4px',
        textColor: "#FEFEFE",
    }

    if (type == selectedType) {
        styleProps.bgColor = "#F9A13D";
        styleProps.bgHover = "#F9A13D";
        styleProps.border = "1px solid #828282";
        styleProps.borderRadius = "4px";
        styleProps.textColor = "#FEFEFE";
    }

    return (
        <CustomButton title={title} {...props} {...styleProps} width="140px" fontSize="10px"
                      onClick={e => onClick(e, type)}/>
    );
}

export default ShareTypeButton;