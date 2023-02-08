import {observer} from "mobx-react-lite";
import {useStores} from "context/StoreComponent";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect} from "react";
import SharesCard from "components/portfolio/SharesCard";
import ChartCard from "components/portfolio/ChartCard";

const SharesView = observer(() => {
    const {sharesStore} = useStores()

    const wallet = useAnchorWallet();
    useEffect(() => {
        sharesStore.getMyShares(wallet?.publicKey).then(console.log)
    }, [wallet]);

    return (
        <SharesCard shares={sharesStore.myShares}/>
    );
});

const PortfolioPage = () => {
    const wallet = useAnchorWallet();
    if (wallet == null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-black text-white/95 px-5 sm:px-10 lg:px-20 py-24 w-full">
            <div className="w-full space-y-12 mt-4">
                <div className="flex flex-row gap-4">
                    <div className="w-1/4 rounded-xl h-20 p-4 bg-gradient-to-r from-[#bd7052] to-[#e5cc73]">
                        <div className="uppercase text-white text-xs font-semibold">Total earnings</div>
                        <div className="text-white text-sm font-semibold">0 SOL</div>
                    </div>
                    <div className="w-1/4 rounded-xl h-20 p-4 bg-gradient-to-r from-cyan-500 to-blue-500">
                        <div className="uppercase text-white text-xs font-semibold">Open positions</div>
                        <div className="text-white text-sm font-semibold">0</div>
                    </div>
                    <div className="w-1/4 rounded-xl h-20 p-4 bg-gradient-to-r from-purple-500 to-pink-300">
                        <div className="uppercase text-white text-xs font-semibold">Liquidity provided</div>
                        <div className="text-white text-sm font-semibold">0 SOL</div>
                    </div>
                    <div className="w-1/4 rounded-xl h-20 p-4 bg-gradient-to-r from-amber-700 to-yellow-500">
                        <div className="uppercase text-white text-xs font-semibold">Liquidity earnings</div>
                        <div className="text-white text-sm font-semibold">0 SOL</div>
                    </div>
                </div>
                <ChartCard/>
                <div
                    className='flex flex-col lg:flex-row lg:justify-between justify-center items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-6 h-full w-full'>
                    <SharesView/>
                </div>
            </div>
        </div>
    )
}

export default PortfolioPage