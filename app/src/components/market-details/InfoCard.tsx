import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { formatToSol } from "utils";
import React from "react";
import Button from "@mui/material/Button";
import moment from "moment";
import CustomButton from "components/common/CustomButton";
import { isAdmin } from "auth";
import { DateTime } from "luxon";

const InfoCard = observer((props: any) => {
    const { marketStore, profileStore } = useStores();
    var isAdminWallet = false;
    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    profileStore.isAdmin().then(console.log);
    isAdminWallet = profileStore.isAdminUser;

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
        console.log("market state ", market);
        return Object.keys(market.state)[0].toUpperCase() || "";
    }

    function getMarketStateText() {
        let t = getMarketState();

        if (isMarketResolved()) {
            //t = t + "(" + Object.keys(market.state.resolved.outcome)[0].toUpperCase() + ")";
            t = Object.keys(market.state.resolved.outcome)[0].toUpperCase();
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

    function isClosedForTrading() {
        let isClosed = Object.keys(marketStore.selectedMarket.state)[0].toUpperCase() != "OPEN";
        let isExpired = marketStore.selectedMarket.expiresAt <= DateTime.now();
        return isClosed || isExpired;
    }

    function deleteMarketHandler() {
        marketStore
            .deleteMarket(marketStore.selectedMarket.address)
            .then(() => {
                alert("market deleted successfully");
            })
            .catch((e) => {
                console.log("An error occurred while deleting market");
            });
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
        <div className="pt-36 flex sm:flex-row flex-col">
            <div className="flex iconTxt mr-4 justify-center sm:justify-start">
                <img className="rounded-full w-24 h-24" src={market.imageUrl} alt="" />
            </div>
            <div className="sm:col-span-7 text-center sm:text-left mt-4 sm:mt-0">
                <div className="text-[15px] font-light">{market.category}</div>
                <div className="text-xl text-[#272727] font-normal my-2">{market.name}</div>
                <div className="flex text-[15px] sm:flex-row flex-col">
                    <div className="pr-4 text-red-500 font-light">
                        Expiration - {moment(market.expiresAt).format("DD-MMM-YYYY")}
                    </div>
                    <div className="px-4">${formatToSol(market.volume)} Vol.</div>
                    <div className="px-4">${formatToSol(market.liquidity)} Liq.</div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start pt-2">
                    {isAdminWallet && (
                        <button
                            type="submit"
                            onClick={deleteMarketHandler}
                            className="!mt-4 !mx-2 w-25 !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                        >
                            Delete Market
                        </button>
                    )}
                    <CustomButton
                        onClick={handleClaimLiquidityFees}
                        title={"Claim Liquidity Fees"}
                        className="!mt-4 w-25 !bg-navy px-3 py-2 !rounded text-white !text-lg !font-medium hover:opacity-90"
                    />
                </div>
                <div className="flex justify-left pt-2">
                    {profileStore.isAdminUser && isMarketOpen() && (
                        <div>
                            <button
                                type="submit"
                                onClick={handleCloseWithAnswer}
                                className="!my-2 !mx-2 w-25 !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                            >
                                Close with Answer
                            </button>
                            {market.resolver === "pyth" && (
                                <CustomButton
                                    onClick={handleCloseWithPyth}
                                    title={"Close with Pyth"}
                                    className="!my-2 !mx-2 w-25 !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="flex justify-left pt-2">
                    {isMarketResolved() && (
                        <div>
                            <button
                                type="submit"
                                onClick={handleClaimLiquidity}
                                className="!my-2 !mx-2 w-25 !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                            >
                                Claim Liquidity Earnings
                            </button>
                            {
                                <CustomButton
                                    onClick={handleClaimWinnings}
                                    title={"Claim Winnings"}
                                    className="!my-2 !mx-2 w-25 !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                                />
                            }
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    {isClosedForTrading() && getMarketState() != "OPEN" && market.resolver === "pyth" && (
                        <div className="!my-2 !mx-2 !p-3 text-lg text-red-500 font-semibold rounded border-solid border-2 border-navy">
                            Market is closed with {market.resolver}, Outcome : {getMarketStateText()}
                        </div>
                    )}
                    {isClosedForTrading() && getMarketState() != "OPEN" && market.resolver === "admin" && (
                        <div className="!my-2 !mx-2 !p-3 text-lg text-red-500 font-semibold rounded border-solid border-2 border-navy">
                            Market is closed with an Answer by Admin , Outcome : {getMarketStateText()}
                        </div>
                    )}
                    {isClosedForTrading() && getMarketState() == "OPEN" && (
                        <div className="!my-2 !mx-2 !p-3 text-lg text-red-500 font-semibold rounded border-solid border-2 border-navy">
                            Market is expired and closed for trading
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default InfoCard;
