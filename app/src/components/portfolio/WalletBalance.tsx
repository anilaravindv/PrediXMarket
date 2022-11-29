import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {useEffect, useState} from "react";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {getWorkspace} from "context/workspace";

const WalletBalance = () => {
    const wallet = useAnchorWallet();
    const [balance, setBalance] = useState(0);
    const workspace = getWorkspace();

    const updateUserBalance = async () => {
        if (!wallet) {
            return 0;
        }
        const balance = await workspace.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL)
    }

    useEffect(() => {
        if (wallet?.publicKey) {
            updateUserBalance();
        }
    }, [wallet?.publicKey, workspace.connection, updateUserBalance]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (wallet?.publicKey) {
                updateUserBalance();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>{balance.toFixed(4)} SOL</div>
    )
}

export default WalletBalance