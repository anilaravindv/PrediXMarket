import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { formatToSol } from "utils";
import React from "react";
import Button from "@mui/material/Button";
import moment from "moment";

const InfoCard = observer((props: any) => {
    const { marketStore, profileStore } = useStores();

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    const market = marketStore.selectedMarket;

    let creatorAddress = market.creator.toBase58();
    creatorAddress = creatorAddress.slice(0, 4) + ".." + creatorAddress.slice(-4);

    function handleCloseWithAnswer() {
        let isYes = confirm("Confirm for 'yes', Reject for 'no'");

        marketStore
            .closeMarketWithAnswer(market.address, isYes ? "Y" : "N")
            .then(() => {
                alert("Market closed successfully");
            })
            .catch((e) => {
                alert("An error occurred while closing the market");
                console.error(e);
            });
    }

    function handleCloseWithPyth() {
        marketStore
            .closeMarketWithPyth(marketStore.selectedMarket)
            .then(() => {
                alert("Market closed successfully");
            })
            .catch((e) => {
                alert("An error occurred while closing the market");
                console.error(e);
            });
    }

    function handleClaimLiquidity() {
        marketStore
            .claimLiquidity(marketStore.selectedMarket.address)
            .then(() => {
                alert("Liquidity claimed successfully");
            })
            .catch((e) => {
                alert("An error occurred while claiming liquidity");
                console.error(e);
            });
    }

    function handleClaimLiquidityFees() {
        marketStore
            .claimLiquidityFees(marketStore.selectedMarket.address)
            .then(() => {
                alert("Liquidity fees claimed successfully");
            })
            .catch((e) => {
                alert("An error occurred while claiming liquidity fees");
                console.error(e);
            });
    }

    function handleClaimWinnings() {
        marketStore
            .claimWinnings(marketStore.selectedMarket.address)
            .then(() => {
                alert("Winnings claimed successfully");
            })
            .catch((e) => {
                alert(e.error.errorMessage || "An error occurred while claiming winnings");
            });
    }

    function getMarketState() {
        return Object.keys(market.state)[0].toUpperCase() || "";
    }

    function getMarketStateText() {
        let t = getMarketState();
        if (isMarketResolved()) {
            t = t + "(" + Object.keys(market.state.resolved.outcome)[0].toUpperCase() + ")";
        }

        return t;
    }

    function getResolutionOperatorSymbol() {
        if (market.resolutionOperator == "eq") {
            return "=";
        } else if (market.resolutionOperator == "gt") {
            return ">";
        } else if (market.resolutionOperator == "lt") {
            return "<";
        } else if (market.resolutionOperator == "lt") {
            return "<";
        }
        return "";
    }

    function isMarketOpen() {
        return Object.keys(marketStore.selectedMarket.state)[0].toUpperCase() == "OPEN";
    }

    function isMarketResolved() {
        return getMarketState() === "RESOLVED";
    }

    return (
        // <div className='border-amber-200 border-2 p-4 flex justify-center items-center rounded-xl space-x-6'>
        //     <div className="flex space-y-10">
        //         <div className="space-y-3">
        //             <div className="flex justify-end">
        //                 <div className='bg-orange-400 px-2 py-1 text-black text-sm text-center font-medium rounded-2xl'>
        //                     {getMarketStateText()}
        //                 </div>
        //             </div>
        //             <div className="flex justify-start items-center space-x-3">
        //                 <img src={market.imageUrl} className="rounded-lg w-16 sm:w-20 sm:h-20 h-16" alt="image" />
        //                 <div className="text-xl font-semibold text-white max-w-2xl px-1">{market.name}</div>
        //             </div>
        //             <div className="sm:pl-20 sm:pr-10 flex flex-wrap justify-between items-center space-x-2">
        //                 <div className='bg-orange-400 px-2 py-1 text-black text-sm text-center font-medium rounded-2xl'>
        //                     {market.category}
        //                 </div>
        //                 <div className="text-xs sm:text-sm py-2">
        //                     Created By: {creatorAddress}
        //                 </div>
        //             </div>
        //             <div className="sm:pl-20 sm:pr-10 pt-4 flex justify-center items-center">
        //                 <div className='text-sm sm:text-base text-center sm:text-left font-medium rounded-2xl'>
        //                     {market.about}
        //                 </div>
        //             </div>
        //             <hr/>

        //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Expiration</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{market.expiresAt.toRelative()}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Liquidity</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.liquidity)}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Volume</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.volume)}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Balance</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.balance)}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Available Shares</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.availableShares)}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">Resolution Source</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500 truncate">{market.resolutionSource}</div>
        //                     </div>
        //                 </div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1 col-span-2">
        //                         <div className="text-sm font-normal text-zinc-500">Yes</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.availableYesShares)} (A) /&nbsp;
        //                             {formatToSol(market.totalYesShares)} (T)</div>
        //                     </div>
        //                 </div>
        //                 <div></div>
        //                 <div>
        //                     <div className="flex justify-center items-center space-x-1">
        //                         <div className="text-sm font-normal text-zinc-500">No</div>
        //                         <div> &#183; </div>
        //                         <div className="text-sm font-semibold text-zinc-500">{formatToSol(market.availableNoShares)} (A) /&nbsp;
        //                             {formatToSol(market.totalNoShares)} (T)</div>
        //                     </div>
        //                 </div>
        //             </div>

        //             <div className="flex justify-center items-center flex-col sm:flex-row space-y-2 sm:space-y-0 pt-5">
        //                 {
        //                     (profileStore.isAdminUser && isMarketOpen()) ? (
        //                         <div className='flex flex-col space-y-2 bg-red'>
        //                             {market.resolver === 'pyth' ? (
        //                                 <Button
        //                                     onClick={handleCloseWithPyth}
        //                                     variant="contained" size="small"
        //                                     sx={{
        //                                         textTransform: "capitalize",
        //                                         border: '1px solid #828282',
        //                                         width: props.width,
        //                                         backgroundColor: "#FED789",
        //                                         margin: "0px 4px",
        //                                         color: "#000000",
        //                                         boxShadow: "none",
        //                                         fontWeight: 700,
        //                                         ":hover": {
        //                                             backgroundColor: "#FED789",
        //                                             boxShadow: "none",
        //                                         }
        //                                     }}>Close with pyth</Button>
        //                             ) : null}
        //                             <Button
        //                                 onClick={handleCloseWithAnswer}
        //                                 variant="contained" size="small"
        //                                 sx={{
        //                                     textTransform: "capitalize",
        //                                     border: '1px solid #828282',
        //                                     width: props.width,
        //                                     backgroundColor: "#FED789",
        //                                     margin: "0px 4px",
        //                                     color: "#000000",
        //                                     boxShadow: "none",
        //                                     fontWeight: 700,
        //                                     ":hover": {
        //                                         backgroundColor: "#FED789",
        //                                         boxShadow: "none",
        //                                     }
        //                                 }}>Close with answer</Button>
        //                         </div>
        //                     ) : null
        //                 }
        //                 <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 bg-red'>
        //                     <Button
        //                         onClick={handleClaimLiquidityFees}
        //                         variant="contained" size="small"
        //                         sx={{
        //                             textTransform: "capitalize",
        //                             border: '1px solid #828282',
        //                             width: props.width,
        //                             backgroundColor: "#FED789",
        //                             margin: "0px 4px",
        //                             color: "#000000",
        //                             boxShadow: "none",
        //                             fontWeight: 700,
        //                             ":hover": {
        //                                 backgroundColor: "#FED789",
        //                                 boxShadow: "none",
        //                             }
        //                         }}>Claim Liquidity Fees</Button>
        //                     {
        //                         isMarketResolved() ? (
        //                             <Button
        //                                 onClick={handleClaimLiquidity}
        //                                 variant="contained" size="small"
        //                                 sx={{
        //                                     textTransform: "capitalize",
        //                                     border: '1px solid #828282',
        //                                     width: props.width,
        //                                     backgroundColor: "#FED789",
        //                                     margin: "0px 4px",
        //                                     color: "#000000",
        //                                     boxShadow: "none",
        //                                     fontWeight: 700,
        //                                     ":hover": {
        //                                         backgroundColor: "#FED789",
        //                                         boxShadow: "none",
        //                                     }
        //                                 }}>Claim Liquidity Earnings</Button>
        //                         ) : null
        //                     }
        //                 </div>

        //                 {
        //                     isMarketResolved() ? (
        //                         <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 bg-red'>
        //                             <Button
        //                                 onClick={handleClaimWinnings}
        //                                 variant="contained" size="small"
        //                                 sx={{
        //                                     textTransform: "capitalize",
        //                                     border: '1px solid #828282',
        //                                     width: props.width,
        //                                     backgroundColor: "#FED789",
        //                                     margin: "0px 4px",
        //                                     color: "#000000",
        //                                     boxShadow: "none",
        //                                     fontWeight: 700,
        //                                     ":hover": {
        //                                         backgroundColor: "#FED789",
        //                                         boxShadow: "none",
        //                                     }
        //                                 }}>Claim Winnings</Button>
        //                         </div>
        //                     ) : null
        //                 }
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="pt-32 px-6">
            <div className="flex iconTxt">
                <div className="w-[50px] h-[50px]">
                    <img className="rounded-full h-[50px]" src={market.imageUrl} alt="" />
                </div>
                <div className="ml-4 bg-gray-300 self-center px-3 py-1 rounded">{market.category}</div>
            </div>
            <div className="pl-[70px]">
                <div className="text-3xl font-semibold">{market.name}</div>
                <div className="flex pt-2">
                    <div className="pr-4">Expiration - {moment(market.expiresAt).format("DD-MMM-YYYY")}</div>
                    <div className="px-4 border-x border-gray-400">{formatToSol(market.volume)}</div>
                    <div className="pl-4">Liquidity - {formatToSol(market.liquidity)}</div>
                </div>
            </div>
        </div>
    );
});

export default InfoCard;
