import {ErrorMessage} from "formik";

const InputErrorMessage = (props) => {
    return (
        <ErrorMessage {...props}>
            {msg => <div className="italic text-red-500">{msg}</div>}
        </ErrorMessage>
    );
}

export default InputErrorMessage;