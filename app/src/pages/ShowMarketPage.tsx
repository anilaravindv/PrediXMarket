import BuySellCard from "components/market-details/BuySellCard";
import {useEffect} from "react";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useParams} from "react-router-dom";
import {useStores} from "context/StoreComponent";
import LiquidityCard from "components/market-details/LiquidityCard";
import SharesCard from "components/markets/SharesCard";
import {observer} from "mobx-react-lite";
import InfoCard from "components/market-details/InfoCard";

const SharesView = observer(() => {
    const {marketStore} = useStores();

    return (
        <SharesCard shares={marketStore.selectedShares}/>
    );
});

const LiquidityView = observer(() => {
    return (
        <LiquidityCard/>
    );
});


const ShowMarketPage = () => {
    const {marketStore} = useStores();
    const {id} = useParams();

    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarket(id).then(console.log)
        marketStore.getShares(id).then(console.log)
    }, [wallet]);

    return (
        <div className="bg-black text-white/95 px-8 lg:px-36 py-32 w-full space-y-12 h-screen">
            <InfoCard/>
            {/*<ChartCard/>*/}
            <div className='flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 sm:space-x-5'>
                <BuySellCard/>
                <LiquidityView/>
                {/*<LPCard />*/}
            </div>
            <div className='flex justify-between items-center space-x-6'>
                <SharesView/>
            </div>
        </div>
    )
}

export default ShowMarketPage