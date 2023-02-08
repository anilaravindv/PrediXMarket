import BuySellCard from "components/market-details/BuySellCard";
import { useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useParams } from "react-router-dom";
import { useStores } from "context/StoreComponent";
import LiquidityCard from "components/market-details/LiquidityCard";
import SharesCard from "components/markets/SharesCard";
import { observer } from "mobx-react-lite";
import InfoCard from "components/market-details/InfoCard";
import Background from "assets/Hero.png";
import AboutCard from "components/market-details/AboutCard";
import { formatToSol } from "utils";
import MarketStatsCard from "components/market-details/MarketStatsCard";

const SharesView = observer(() => {
    const { marketStore } = useStores();
    return <SharesCard shares={marketStore.selectedShares} />;
});

const LiquidityView = observer(() => {
    return <LiquidityCard />;
});

const ShowMarketPage = () => {
    const { marketStore } = useStores();
    const market = marketStore.selectedMarket;
    console.log("show market page : ", market);

    const { id } = useParams();
    // let creatorAddress = market.creator.toBase58();
    // creatorAddress = creatorAddress.slice(0, 4) + '..' + creatorAddress.slice(-4);

    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarket(id).then(console.log);
        marketStore.getShares(id).then(console.log);
    }, [true]);

    return (
        <div
            className="w-full min-h-screen bg-no-repeat bg-cover bg-white text-black pb-0 space-y-5"
            style={{ backgroundImage: `url(${Background}` }}
        >
            <div className="xl:px-16 xl:mx-16 px-5">
                <InfoCard />
                {/*<ChartCard/>*/}
                <div className="m-2 p-5 pb-0 flex flex-wrap justify-between -mx-2">
                    <div className="lg:w-[68%] md:w-[65%] p-3">
                        <MarketStatsCard/>
                        <AboutCard />
                    </div>
                    <div className="lg:w-[29%] md:w-[35%] p-3">
                        <BuySellCard />
                        <LiquidityView />
                    </div>
                    {/* <SharesView /> */}
                </div>
            </div>
        </div>
    );
};

export default ShowMarketPage;
