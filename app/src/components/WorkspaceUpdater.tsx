import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {setWallet} from "../context/workspace";
import {useEffect} from "react";

const WorkspaceUpdater = () => {
    const wallet = useAnchorWallet();
    useEffect(() => {
        setWallet(wallet || null);
    }, [wallet]);

    return null;
};

export default WorkspaceUpdater;