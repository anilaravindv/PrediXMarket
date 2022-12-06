import { useStores } from "context/StoreComponent";
import { observer } from "mobx-react-lite";
import { Market } from "context/Market";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import MarketCard from "components/common/MarketCard";
import { Link } from "react-router-dom";
import Footer from "components/common/Footer";
import Background from "assets/Hero.png";

const marketCategories = [
    { name: "📈 Crypto", value: "" },
    { name: "🗳️ Politics", value: "" },
    { name: "🎾 Sports", value: "" },
    { name: "💰 Economics", value: "" },
    { name: "📡 Science & Technology", value: "" },
];

const MarketsViewComponent = observer(() => {
    const { marketStore } = useStores();
    var maerkets;
    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarkets().then(() => {maerkets = marketStore.markets; console.log("csa", maerkets);});
        console.log("get markets here")
    }, [true]);

    return (
        <>
            {marketStore.markets.map((m: Market, index) => {
                return (
                    <Link key={index} to={"/markets/" + m.address}>
                        <MarketCard market={m} />
                    </Link>
                );
            })}
        </>
    );
});

const MarketsPage = () => {
    return (
        <div
            className="w-full min-h-screen bg-no-repeat bg-cover bg-white text-black pb-0 space-y-5"
            style={{ backgroundImage: `url(${Background}` }}
        >
            <div className="xl:px-16 xl:mx-16 px-5">
                <div className="text-3xl font-bold leading-tight text-black pt-32">Popular Markets</div>
                <div className="mt-3 mb-5">
                    <input
                        type="text"
                        className="block w-full py-3 rounded-md shadow-sm focus:border-purple-600 border-gray-400"
                        placeholder="Search for markets..."
                    />
                </div>
                <div className="filterwrap flex flex-wrap">
                    {marketCategories.map(({ name, value }, k) => (
                        <button
                            onClick={() => console.log(value)}
                            key={k}
                            className="text-white m-1 px-6 py-3 font-medium text-sm rounded-md bg-amber-600 hover:bg-amber-500"
                        >
                            {name}
                        </button>
                    ))}
                </div>
                <div className="my-10">
                    <div className="justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center flex-wrap">
                        <MarketsViewComponent />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};
export default MarketsPage;
