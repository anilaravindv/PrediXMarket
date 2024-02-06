import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { formatToSol } from "utils";
import React from "react";
import Button from "@mui/material/Button";

const AboutCard = observer((props: any) => {
    const { marketStore, profileStore } = useStores();

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    const market = marketStore.selectedMarket;

    let creatorAddress = market.creator.toBase58();
    creatorAddress = creatorAddress.slice(0, 4) + ".." + creatorAddress.slice(-4);

    return (
        <>
            <div className="graph border rounded-2xl overflow-hidden">
                <img className="w-[100%]" src="assets/graph.jpg" alt="" />
            </div>
            <div className="marketWrap mt-2">
                {/* <div className="marketHeading text-lg font-semibold border-b border-gray-400 py-4 px-8">
                    Market Positions
                </div>
                <div className="flex justify-around py-2 mt-6 border-y border-gray-300 text-lg font-semibold">
                    <div>Outcome</div>
                    <div>Price: Avg | Cur.</div>
                    <div>P/L-$ | %</div>
                    <div>Value: Init. | Cur.</div>
                    <div>Max. Payout</div>
                </div>
                <div className="py-6">No Market Positions</div> */}
                <div className="text-2xl font-medium">About this market</div>
                <div className="pt-2">{market.about}</div>
                <div>
                    <div className="py-1 mt-4">
                        Resolution Source:&nbsp;
                        {market.resolver === "pyth" ? (
                            <a
                                href={`https://solscan.io/account/${market.resolutionSource}?cluster=testnet`}
                                target="_blank"
                                className="text-blue-700"
                            >
                                {market.resolutionSource}
                            </a>
                        ) : (
                            <a href={market.resolutionSource} target="_blank" className="text-blue-700">
                                {market.resolutionSource}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <div className="py-1 mt-4">
                        Resolution Type:&nbsp;
                        {market.resolver === "pyth" ? (
                            <a href={"https://pyth.network/"} target="_blank" className="text-blue-700">
                                {market.resolver}
                            </a>
                        ) : (
                            <a
                                href={`https://solscan.io/account/${market.creator.toBase58()}?cluster=testnet`}
                                target="_blank"
                                className="text-blue-700"
                            >
                                {market.resolver}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <div className="py-1 mt-4">
                        Deployed by:
                        <a href="" className="text-blue-700">
                            {" "}
                            {market.creator.toBase58()}
                        </a>
                    </div>

                    {/* <div className="inline-block bg-gray-200 rounded-xl px-4 py-1 mt-4">
                        Resolver:
                        <a href="" className="text-blue-700">
                            {" "}
                            View Contact
                        </a>
                    </div> */}
                </div>
            </div>
        </>
    );
});

export default AboutCard;
