import {useWallet} from "@solana/wallet-adapter-react";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

function RequireAuth({children}: { children: JSX.Element }) {
    const {connected} = useWallet();
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!connected) {
                navigate("/", {replace: true, state: {from: location}})
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [connected]);

    return children;
}

export default RequireAuth;
