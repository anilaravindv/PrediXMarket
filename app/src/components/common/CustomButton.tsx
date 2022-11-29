import React from 'react'
import Button from '@mui/material/Button';

const CustomButton = ({
                          borderRadius,
                          border,
                          padding,
                          width,
                          bgColor,
                          textColor,
                          bgHover,
                          title,
                          fontSize,
                          ...props
                      }: any) => {
    return (
        <div>
            <Button
                variant="contained"
                {...props}
                sx={{
                    textTransform: "capitalize",
                    // minWidth: '100%',
                    borderRadius: borderRadius,
                    border: border,
                    padding: padding,
                    fontSize: fontSize || "14px",
                    width: width,
                    backgroundColor: bgColor,
                    color: textColor,
                    boxShadow: "none",
                    fontWeight: 700,
                    ":hover": {
                        backgroundColor: bgHover,
                        boxShadow: "none",
                    },
                    ":disabled": {
                        backgroundColor: "#656464",
                        boxShadow: "none",
                    }
                }}>{title}</Button>
        </div>
    )
}

export default CustomButton