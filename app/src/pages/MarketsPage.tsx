import { useStores } from "context/StoreComponent";
import { observer } from "mobx-react-lite";
import { Market } from "context/Market";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from "react";
import MarketCard from "components/common/MarketCard";
import { Link } from "react-router-dom";
import Footer from "components/common/Footer";
import Background from "assets/images/bg.png";
import CoinGirl from "assets/images/element_06.png";

interface Props {
    filter: string;
}

const marketCategories = [
    { name: "All", value: "all" },
    { name: "📈 Crypto", value: "crypto" },
    { name: "🗳️ Politics", value: "politics" },
    { name: "🎾 Sports", value: "sports" },
    { name: "💰 Economics", value: "economics" },
    { name: "📡 Science & Technology", value: "science & tech" },
];

var maerkets, filter;

const MarketsViewComponent = observer((props: any) => {
    const { marketStore } = useStores();
    console.log("props : ", props);

    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarkets().then(() => {
            maerkets = marketStore.markets;
            console.log("csa", maerkets);
        });
        console.log("get markets here");
    }, [true]);

    return (
        <>
            {marketStore.markets.map((m: Market, index) => {
                return props.filter === m.category ? (
                    <Link key={index} to={"/markets/" + m.address}>
                        <MarketCard market={m} />
                    </Link>
                ) : (
                    <>
                        {props.filter === "all" ? (
                            <Link key={index} to={"/markets/" + m.address}>
                                <MarketCard market={m} />
                            </Link>
                        ) : null}
                    </>
                );
            })}
        </>
    );
});

const MarketsPage = () => {
    const [filterProp, setFilterProp] = useState({ filter: "all" });
    const FilterHandler = (value: any) => {
        var prop = { filter: value };
        setFilterProp(prop);
        console.log("Filtering :", value);
    };

    // ReadCSV();

    return (
        <div className="w-full min-h-screen bg-no-repeat bg-cover bg-white text-black pb-0 space-y-5">
            <div
                style={{ backgroundImage: `url(${Background})` }}
                className="flex justify-center border-b-[#E4E4E4] border"
            >
                <div className="container px-3 relative z-10">
                    <div className="text-4xl text-center mb-6 font-medium leading-tight text-black pt-32">
                        Popular Markets
                    </div>
                    <div className="mb-7 flex justify-center">
                        <input
                            type="text"
                            className="block sm:w-4/5 w-full py-4 text-lg rounded-md shadow-sm border-gray-200 focus:border-gray-400 focus:outline-none z-100"
                            placeholder="Search for markets..."
                        />
                    </div>
                    <div className="filterwrap flex flex-wrap justify-center mb-7">
                        {marketCategories.map(({ name, value }, k) =>
                            value === "all" ? (
                                <button
                                    onClick={() => {
                                        FilterHandler(value);
                                    }}
                                    key={k}
                                    className="text-black m-1 px-1 sm:px-3 py-1 font-normal text-base rounded-md bg-white hover:bg-gray-100 border border-[#E3E3E3]"
                                >
                                    {name}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        FilterHandler(value);
                                    }}
                                    key={k}
                                    className="text-black m-1 px-1 sm:px-3 py-1 font-normal text-base rounded-md bg-white hover:bg-gray-100 border border-[#E3E3E3]"
                                >
                                    {name}
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div className="absolute left-12 top-[208px] z-0">
                    <img src={CoinGirl} />
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="container px-3">
                    <div className="my-10">
                        <div className="justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center flex-wrap">
                            <MarketsViewComponent {...filterProp} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default MarketsPage;
