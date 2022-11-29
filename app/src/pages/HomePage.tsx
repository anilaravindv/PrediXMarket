import {Navigate} from "react-router-dom";

const HomePage = () => {
    return (
        <Navigate to={"/markets"} replace={true}/>
    );
}
export default HomePage