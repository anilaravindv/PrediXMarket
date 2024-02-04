import CustomButton from "components/common/CustomButton";

const TableTypeButton = ({title, type, selectedType, onClick, ...props}) => {
    let styleProps = {
        bgColor: "#ffffff",
        bgHover: "#ffffff",
        border: '2px solid #000000',
        borderRadius: '4px',
        textColor: "#000000",
    }

    if (type == selectedType) {
        styleProps.bgColor = "#581c87";
        styleProps.bgHover = "#581c87";
        styleProps.border = "1px solid #581c87";
        styleProps.borderRadius = "4px";
        styleProps.textColor = "#FEFEFE";
    }

    return (
        <CustomButton title={title} {...props} {...styleProps} width="140px" fontSize="13px"
                      onClick={e => onClick(e, type)}/>
    );
}

export default TableTypeButton;