import BuySellCard from "components/market-details/BuySellCard";
import { useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useParams } from "react-router-dom";
import { useStores } from "context/StoreComponent";
import LiquidityCard from "components/market-details/LiquidityCard";
import SharesCard from "components/markets/SharesCard";
import { observer } from "mobx-react-lite";
import InfoCard from "components/market-details/InfoCard";
import AboutCard from "components/market-details/AboutCard";
import { formatToSol } from "utils";
import Background from "assets/images/bg.png";

// import MarketStatsCard from "../components/market-details/MarketStatsCard";

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
            className="w-full min-h-screen bg-no-repeat bg-cover bg-white text-black pb-0 space-y-5 flex flex-col"
            style={{ backgroundImage: `url(${Background}` }}
        >
            <div className="container px-3 mx-auto">
                <InfoCard />
                {/*<ChartCard/>*/}
            </div>
            <div className="bg-white border-t-[#e4e4e4] border-t">
                <div className="m-2 pb-0 pt-5 grid grid-cols-12 flex-col-reverse flex-wrap justify-between container px-3 mx-auto">
                    <div className="lg:col-span-8 col-span-12 lg:pr-4">
                        {/* <MarketStatsCard /> */}
                        <AboutCard />
                    </div>
                    <div className="lg:col-span-4 col-span-12 lg:pl-4 -order-1 lg:order-1">
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
