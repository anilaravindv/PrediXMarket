import CustomButton from "components/common/CustomButton";
import { useStores } from "context/StoreComponent";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import OutcomeButton from "./OutcomeButton";
import RefreshButton from "./RefreshButton";
import BuySellButton from "./BuySellButton";
import BigNumber from "bignumber.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { formatToSol, usdToSol } from "utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const BuySellCard = observer(() => {
    const { marketStore } = useStores();
    const [amount, setAmount] = useState(0);
    const [usdAmount, setUsdAmount] = useState(0);
    const [outcome, setOutcome] = useState("Y");
    const [action, setAction] = useState("buy");
    const [possibleShares, setPossibleShares] = useState("");
    const [possibleSharesError, setPossibleSharesError] = useState("");
    const [userShares, setUserShares] = useState({ yes: "0", no: "0" });
    const wallet = useAnchorWallet();

    useEffect(() => {
        if (marketStore.selectedMarket === null) {
            setPossibleShares("");
            return;
        }
        let s = "";
        if (action == "buy") {
            s = calcBuyAmount(outcome, amount);
        } else {
            s = calcSellAmount(outcome, amount);
        }
        setPossibleShares(s);
        marketStore.selectedShares.forEach((i, k) => {
            if (wallet?.publicKey == i.account.authority) {
                let yesShares = formatToSol(i.account.yesShares);
                let noShares = formatToSol(i.account.noShares);
                setUserShares({ yes: yesShares, no: noShares });
            }
        });
    });

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    function isClosedForTrading() {
        let isClosed = Object.keys(marketStore.selectedMarket.state)[0].toUpperCase() != "OPEN";
        let isExpired = marketStore.selectedMarket.expiresAt <= DateTime.now();
        return isClosed || isExpired;
    }

    function handleOutcomeChange(e, outcome) {
        setOutcome(outcome);
    }

    function refreshPrices() {
        marketStore.getMarket(marketStore.selectedMarket.address).then(console.log);
    }

    function handleActionChange(e, action) {
        setAction(action);
    }

    async function handleBuySell() {
        if (action === "buy") {
            marketStore
                .buyShares({
                    market: marketStore.selectedMarket.address,
                    outcome: outcome,
                    amount: amount,
                })
                .then(() => alert("Shares bought successfully."))
                .catch((e) => {
                    console.error(e);
                    alert("Buy operation failed");
                });
        } else {
            marketStore
                .sellShares({
                    market: marketStore.selectedMarket.address,
                    outcome: outcome,
                    amount: amount,
                    // shares: sellShares,
                })
                .then(() => alert("Shares sold successfully."))
                .catch((e) => {
                    console.error(e);
                    alert("Sell operation failed");
                });
        }
    }

    async function handleAmountChange(e) {
        setUsdAmount(e.target.value);
        let solAmt = await usdToSol(e.target.value);
        setAmount(solAmt);
    }

    const market = marketStore.selectedMarket;
    const yesOutcomeSharePrice =
        (market.availableShares.toNumber() - market.availableYesShares.toNumber()) / market.availableShares.toNumber();
    const noOutcomeSharePrice =
        (market.availableShares.toNumber() - market.availableNoShares.toNumber()) / market.availableShares.toNumber();

    function calcBuyAmount(outcome, amountInSol) {
        let amount = new BigNumber(amountInSol).multipliedBy(LAMPORTS_PER_SOL);
        let amountMinusFees = amount.minus(
            amount.multipliedBy(marketStore.selectedMarket.feePercentage).dividedBy(100)
        );

        let buyTokenPoolBalance;
        let other;
        if (outcome == "Y") {
            buyTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
        } else {
            buyTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
        }

        let endingOutcomeBalance = buyTokenPoolBalance;

        endingOutcomeBalance = endingOutcomeBalance.multipliedBy(other).dividedBy(other.plus(amountMinusFees));

        if (endingOutcomeBalance.isLessThanOrEqualTo(0)) {
            setPossibleSharesError("Ending outcome must have non-zero balances");
        } else {
            setPossibleSharesError("");
        }

        const shares = buyTokenPoolBalance.plus(amountMinusFees).minus(endingOutcomeBalance);

        return shares.dividedBy(LAMPORTS_PER_SOL).toFixed(4);
    }

    function calcSellAmount(outcome, amountInSol) {
        let amount = new BigNumber(amountInSol).multipliedBy(LAMPORTS_PER_SOL);
        let amountPlusFees = amount.plus(amount.multipliedBy(marketStore.selectedMarket.feePercentage).dividedBy(100));

        let sellTokenPoolBalance;
        let other;
        if (outcome == "Y") {
            sellTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
        } else {
            sellTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
        }

        let endingOutcomeBalance = sellTokenPoolBalance;

        endingOutcomeBalance = endingOutcomeBalance.multipliedBy(other).dividedBy(other.minus(amountPlusFees));

        if (endingOutcomeBalance.isLessThanOrEqualTo(0)) {
            setPossibleSharesError("Ending outcome must have non-zero balances");
        } else {
            setPossibleSharesError("");
        }

        const shares = amountPlusFees.plus(endingOutcomeBalance).minus(sellTokenPoolBalance);

        return shares.dividedBy(LAMPORTS_PER_SOL).toFixed(4);
    }

    const BuySellSharesAmountText = ({ possibleShares, possibleSharesError }) => {
        if (possibleSharesError !== "") {
            return <p className="italic text-red-500">{possibleSharesError}</p>;
        }

        if (possibleShares == "") {
            return <p></p>;
        }

        return <p>{possibleShares} shares (approx.)</p>;
    };

    return (
        <>
            <div className="box1 bg-violet-100 rounded border border-violet-300 p-3">
                <div className="buySell pt-5">
                    <div className="toggleBtn flex flex-wrap justify-center mx-1">
                        <BuySellButton
                            action={"buy"}
                            selectedAction={action}
                            onClick={handleActionChange}
                            disabled={isClosedForTrading()}
                        />
                        <BuySellButton
                            action={"sell"}
                            selectedAction={action}
                            onClick={handleActionChange}
                            disabled={isClosedForTrading()}
                        />
                    </div>
                </div>

                <div className="outCome flex flex-wrap pt-4 justify-center items-center text-md font-semibold">
                    <div className="w-1/2 text-center  text-sm">Pick Outcome</div>
                    <button
                        className="py-1  text-center px-2 cursor-pointer border border-gray-400 rounded text-white bg-gray-500 text-sm"
                        onClick={refreshPrices}
                    >
                        Refresh Prices
                    </button>
                </div>

                <div className="flex flex-wrap justify-center pt-4">
                    <OutcomeButton
                        outcome={"Y"}
                        selectedOutcome={outcome}
                        price={yesOutcomeSharePrice}
                        disabled={isClosedForTrading()}
                        onClick={handleOutcomeChange}
                    />
                    <OutcomeButton
                        outcome={"N"}
                        selectedOutcome={outcome}
                        price={noOutcomeSharePrice}
                        disabled={isClosedForTrading()}
                        onClick={handleOutcomeChange}
                    />
                </div>
                <div className="solWrap mt-4 px-4">
                    <div className="text-lg font-semibold pb-2">SOL Amount (in USD)</div>
                    <div className="">
                        <input
                            type="text"
                            name="amount"
                            value={usdAmount}
                            onChange={handleAmountChange}
                            disabled={isClosedForTrading()}
                            placeholder="Amount in USD"
                            className="mt-1 block w-full rounded-lg"
                        />
                    </div>
                    <div className="font-semibold">
                        <BuySellSharesAmountText
                            possibleShares={possibleShares}
                            possibleSharesError={possibleSharesError}
                        />
                    </div>
                    <div className="font-semibold">Amount in Sol: {amount.toFixed(4)}</div>
                    <div className="flex flex-wrap pt-4 justify-between text-lg text-gray-500">
                        <div>LP Fee</div>
                        <div>2%</div>
                    </div>
                    <div className="flex flex-wrap justify-between text-lg">
                        <div>Your Avg. Price</div>
                        <div>$0.00</div>
                    </div>
                    <div className="flex flex-wrap justify-between text-lg">
                        <div>Estimated Shares Bought</div>
                        <div>{outcome == "Y" ? userShares.yes : userShares.no}</div>
                    </div>
                    <div className="flex flex-wrap justify-between text-lg">
                        <div>Maximum Winnings</div>
                        <div>
                            {outcome == "Y"
                                ? parseFloat(possibleShares) * (1 - yesOutcomeSharePrice)
                                : parseFloat(possibleShares) * (1 - noOutcomeSharePrice)}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between text-lg">
                        <div>Max Return on Investment</div>
                        <div>0.00%</div>
                    </div>
                    <button
                        className="my-4 w-full bg-purple-900 p-3 rounded text-white text-lg font-semibold hover:bg-purple-600"
                        onClick={handleBuySell}
                        disabled={isClosedForTrading()}
                    >
                        {(action == "buy" ? "Buy " : "Sell ") + (outcome == "Y" ? "Yes " : "No ") + " shares"}
                    </button>
                    {  isClosedForTrading() && <div className="flex flex-wrap justify-between text-lg text-red-500">
                        <div>Market is Closed for Trading</div>
                    </div>}
                </div>
            </div>
        </>
        // <div
        //     className='border border-amber-100 rounded-2xl bg-neutral-900 px-3 py-6 space-y-4 w-full h-auto flex flex-col'>
        //     <div className='space-y-6'>
        //         <div className='flex justify-center items-center'>
        //             <BuySellButton action={'buy'} selectedAction={action} onClick={handleActionChange}
        //                            disabled={isClosedForTrading()} />
        //             <BuySellButton action={'sell'} selectedAction={action} onClick={handleActionChange}
        //                            disabled={isClosedForTrading()} />
        //         </div>
        //         <div className='text-sm sm:text-base font-semibold flex justify-center items-center'>
        //             Pick outcome &nbsp; <RefreshButton onClick={refreshPrices}/>
        //         </div>
        //         <div className='flex justify-center items-center px-10'>
        //             <OutcomeButton outcome={"Y"}
        //                            selectedOutcome={outcome}
        //                            price={yesOutcomeSharePrice}
        //                            disabled={isClosedForTrading()}
        //                            onClick={handleOutcomeChange}/>
        //             <OutcomeButton outcome={"N"}
        //                            selectedOutcome={outcome}
        //                            price={noOutcomeSharePrice}
        //                            disabled={isClosedForTrading()}
        //                            onClick={handleOutcomeChange}/>
        //         </div>
        //     </div>
        //     <div className='space-y-8 flex flex-col justify-center items-center w-full'>
        //         <label className="block">
        //             <span className='text-base font-medium'>SOL Amount</span>
        //             <input type="number"
        //                    name="amount"
        //                    value={amount}
        //                    onChange={handleAmountChange}
        //                    disabled={isClosedForTrading()}
        //                    placeholder='Amount'
        //                    className="mt-1 block w-full rounded-lg bg-neutral-900 px-4 py-1"/>

        //             <BuySellSharesAmountText
        //                 possibleShares={possibleShares} possibleSharesError={possibleSharesError} />
        //         </label>

        //         <CustomButton
        //             onClick={handleBuySell}
        //             disabled={isClosedForTrading()}
        //             title={action + (outcome == 'Y' ? " yes " : " no ") + " shares"}
        //             bgColor={"#FED789"}
        //             bgHover={"#FED789"}
        //             textColor={"#000000"}
        //             padding={"8px 50px"}
        //             border={'1px solid #828282'}/>
        //     </div>
        // </div>
    );
});

export default BuySellCard;
