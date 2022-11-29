import React from "react";
import {useField} from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerInput = (props) => {
    const [field, , {setValue}] = useField(props);
    return (
        <DatePicker
            {...field}
            {...props}
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setValue(val);
            }}
        />
    );
};

export default DatePickerInput