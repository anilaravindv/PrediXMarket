import CustomButton from 'components/common/CustomButton'
import {useStores} from "context/StoreComponent";
import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {DateTime} from "luxon";
import OutcomeButton from "./OutcomeButton";
import RefreshButton from "./RefreshButton";
import BuySellButton from "./BuySellButton";
import BigNumber from "bignumber.js";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";

const BuySellCard = observer(() => {
    const {marketStore} = useStores();
    const [amount, setAmount] = useState(0);
    const [outcome, setOutcome] = useState('Y');
    const [action, setAction] = useState('buy');
    const [possibleShares, setPossibleShares] = useState('');
    const [possibleSharesError, setPossibleSharesError] = useState('');

    useEffect(() => {
        if (marketStore.selectedMarket === null) {
            setPossibleShares('');
            return;
        }
        let s = '';
        if (action == 'buy') {
            s = calcBuyAmount(outcome, amount);
        } else {
            s = calcSellAmount(outcome, amount);
        }
        setPossibleShares(s);
    });

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    function isClosedForTrading() {
        let isClosed = Object.keys(marketStore.selectedMarket.state)[0].toUpperCase() != 'OPEN';
        let isExpired = marketStore.selectedMarket.expiresAt <= DateTime.now();
        return (isClosed || isExpired);
    }

    function handleOutcomeChange(e, outcome) {
        setOutcome(outcome);
    }

    function refreshPrices() {
        marketStore.getMarket(marketStore.selectedMarket.address).then(console.log)
    }

    function handleActionChange(e, action) {
        setAction(action);
    }

    function handleBuySell() {
        if (action === 'buy') {
            marketStore
                .buyShares({
                    market: marketStore.selectedMarket.address,
                    outcome: outcome,
                    amount: amount,
                })
                .then(() => alert('Shares bought successfully.'))
                .catch(e => {
                    console.error(e);
                    alert('Buy operation failed');
                });
        } else {
            marketStore
                .sellShares({
                    market: marketStore.selectedMarket.address,
                    outcome: outcome,
                    amount: amount,
                    // shares: sellShares,
                })
                .then(() => alert('Shares sold successfully.'))
                .catch(e => {
                    console.error(e);
                    alert('Sell operation failed');
                });
        }
    }

    function handleAmountChange(e) {
        setAmount(e.target.value)
    }

    const market = marketStore.selectedMarket;
    const yesOutcomeSharePrice = (market.availableShares.toNumber() - market.availableYesShares.toNumber()) / market.availableShares.toNumber();
    const noOutcomeSharePrice = (market.availableShares.toNumber() - market.availableNoShares.toNumber()) / market.availableShares.toNumber();

    function calcBuyAmount(outcome, amountInSol) {
        let amount = new BigNumber(amountInSol).multipliedBy(LAMPORTS_PER_SOL);
        let amountMinusFees = amount.minus(amount.multipliedBy(marketStore.selectedMarket.feePercentage).dividedBy(100));

        let buyTokenPoolBalance;
        let other;
        if (outcome == 'Y') {
            buyTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
        } else {
            buyTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
        }

        let endingOutcomeBalance = buyTokenPoolBalance;

        endingOutcomeBalance = (endingOutcomeBalance.multipliedBy(other)).dividedBy((other.plus(amountMinusFees)));

        if (endingOutcomeBalance.isLessThanOrEqualTo(0)) {
            setPossibleSharesError("Ending outcome must have non-zero balances");
        } else {
            setPossibleSharesError("");
        }

        const shares = buyTokenPoolBalance.plus(amountMinusFees).minus(endingOutcomeBalance);

        return shares.dividedBy(LAMPORTS_PER_SOL).toFixed(4)
    }

    function calcSellAmount(outcome, amountInSol) {
        let amount = new BigNumber(amountInSol).multipliedBy(LAMPORTS_PER_SOL);
        let amountPlusFees = amount.plus(amount.multipliedBy(marketStore.selectedMarket.feePercentage).dividedBy(100));

        let sellTokenPoolBalance;
        let other;
        if (outcome == 'Y') {
            sellTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
        } else {
            sellTokenPoolBalance = new BigNumber(marketStore.selectedMarket.availableNoShares.toString());
            other = new BigNumber(marketStore.selectedMarket.availableYesShares.toString());
        }

        let endingOutcomeBalance = sellTokenPoolBalance;

        endingOutcomeBalance = (endingOutcomeBalance.multipliedBy(other)).dividedBy((other.minus(amountPlusFees)));

        if (endingOutcomeBalance.isLessThanOrEqualTo(0)) {
            setPossibleSharesError("Ending outcome must have non-zero balances");
        } else {
            setPossibleSharesError("");
        }

        const shares = amountPlusFees.plus(endingOutcomeBalance).minus(sellTokenPoolBalance);

        return shares.dividedBy(LAMPORTS_PER_SOL).toFixed(4)
    }

    const BuySellSharesAmountText = ({possibleShares, possibleSharesError}) => {
        if (possibleSharesError !== '') {
            return <p className="italic text-red-500">{possibleSharesError}</p>;
        }

        if (possibleShares == '') {
            return <p></p>;
        }

        return <p>{possibleShares} shares (approx.)</p>;
    }

    return (
        <div
            className='border border-amber-100 rounded-2xl bg-neutral-900 px-3 py-6 space-y-4 w-full h-auto flex flex-col'>
            <div className='space-y-6'>
                <div className='flex justify-center items-center'>
                    <BuySellButton action={'buy'} selectedAction={action} onClick={handleActionChange}
                                   disabled={isClosedForTrading()} />
                    <BuySellButton action={'sell'} selectedAction={action} onClick={handleActionChange}
                                   disabled={isClosedForTrading()} />
                </div>
                <div className='text-sm sm:text-base font-semibold flex justify-center items-center'>
                    Pick outcome &nbsp; <RefreshButton onClick={refreshPrices}/>
                </div>
                <div className='flex justify-center items-center px-10'>
                    <OutcomeButton outcome={"Y"}
                                   selectedOutcome={outcome}
                                   price={yesOutcomeSharePrice}
                                   disabled={isClosedForTrading()}
                                   onClick={handleOutcomeChange}/>
                    <OutcomeButton outcome={"N"}
                                   selectedOutcome={outcome}
                                   price={noOutcomeSharePrice}
                                   disabled={isClosedForTrading()}
                                   onClick={handleOutcomeChange}/>
                </div>
            </div>
            <div className='space-y-8 flex flex-col justify-center items-center w-full'>
                <label className="block">
                    <span className='text-base font-medium'>SOL Amount</span>
                    <input type="number"
                           name="amount"
                           value={amount}
                           onChange={handleAmountChange}
                           disabled={isClosedForTrading()}
                           placeholder='Amount'
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-4 py-1"/>

                    <BuySellSharesAmountText
                        possibleShares={possibleShares} possibleSharesError={possibleSharesError} />
                </label>

                <CustomButton
                    onClick={handleBuySell}
                    disabled={isClosedForTrading()}
                    title={action + (outcome == 'Y' ? " yes " : " no ") + " shares"}
                    bgColor={"#FED789"}
                    bgHover={"#FED789"}
                    textColor={"#000000"}
                    padding={"8px 50px"}
                    border={'1px solid #828282'}/>
            </div>
        </div>
    )
});

export default BuySellCard