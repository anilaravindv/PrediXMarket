import { useStores } from "context/StoreComponent";
import { observer } from "mobx-react-lite";
import { Market } from "context/Market";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from "react";
import MarketCard from "components/common/MarketCard";
import { Link } from "react-router-dom";
import Footer from "components/common/Footer";
import Background from "assets/Hero.png";

interface Props {
    filter: string;
  }

const marketCategories = [
    { name: "All", value : "all"},
    { name: "📈 Crypto", value: "crypto" },
    { name: "🗳️ Politics", value: "politics" },
    { name: "🎾 Sports", value: "sports" },
    { name: "💰 Economics", value: "economics" },
    { name: "📡 Science & Technology", value: "science & tech" }
];

var maerkets,filter;

const MarketsViewComponent = observer((props : any) => {
    const { marketStore } = useStores();
    console.log("props : ", props);
    
    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarkets().then(() => {maerkets = marketStore.markets; console.log("csa", maerkets);});
        console.log("get markets here")
    }, [true]);

    return (
        <>
            {marketStore.markets.map((m: Market, index) => {
            return (
                props.filter === m.category ?
                    <Link key={index} to={"/markets/" + m.address}>
                        <MarketCard market={m} />
                    </Link> : 
                    <>
                    {props.filter === "all" ? <Link key={index} to={"/markets/" + m.address}>
                        <MarketCard market={m} />
                    </Link> : null}
                    </>
                );
            })}
        </>
    );
});




const MarketsPage = () => {

    const [filterProp, setFilterProp] = useState({filter : "all"});
    const FilterHandler = (value : any) => {
        var prop = { filter : value};
        setFilterProp(prop);
        console.log("Filtering :" , value);
    }

    // ReadCSV();

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
                        value === "all" ?
                            <button
                                onClick={() => { FilterHandler(value) }}
                                key={k}
                                className="text-white m-1 px-6 py-3 font-medium text-sm rounded-md bg-amber-700 hover:bg-amber-500"
                            >
                                {name}
                            </button> :
                            <button
                                onClick={() => { FilterHandler(value) }}
                                key={k}
                                className="text-white m-1 px-6 py-3 font-medium text-sm rounded-md bg-amber-600 hover:bg-amber-500"
                            >
                                {name}
                            </button>
                    ))}
                </div>
                <div className="my-10">
                    <div className="justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center flex-wrap">
                        <MarketsViewComponent {...filterProp}/>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};
export default MarketsPage;
