import CustomButton from "components/common/CustomButton";
import React, { useState } from "react";
import { DateTime } from "luxon";
import AddRemoveLiquidityButton from "./AddRemoveLiquidityButton";
import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";

const LiquidityCard = observer(() => {
    const { marketStore } = useStores();
    const [action, setAction] = useState("add");
    const [amount, setAmount] = useState(0);

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    function isClosedForTrading() {
        let isClosed = Object.keys(marketStore.selectedMarket.state)[0].toUpperCase() != "OPEN";
        let isExpired = marketStore.selectedMarket.expiresAt <= DateTime.now();
        return isClosed || isExpired;
    }

    function handleActionChange(e, action) {
        setAction(action);
    }

    function handleAmountChange(e) {
        setAmount(e.target.value);
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

    function handleAddRemove() {
        if (action === "add") {
            marketStore
                .addLiquidity({
                    market: marketStore.selectedMarket.address,
                    amount: amount,
                })
                .then(() => alert("Liquidity added successfully."))
                .catch((e) => {
                    console.error(e);
                    alert("Add liquidity operation failed");
                });
        } else {
            marketStore
                .removeLiquidity({
                    market: marketStore.selectedMarket.address,
                    amount: amount,
                })
                .then(() => alert("Liquidity removed successfully."))
                .catch((e) => {
                    console.error(e);
                    alert("Remove liquidity operation failed");
                });
        }
    }

    return (
        // <div className='border border-amber-100 rounded-2xl bg-neutral-900  px-3 py-6 space-y-4 w-full'>
        //     <div className='space-y-8 flex flex-col'>
        //         <div className='flex justify-center items-center'>
        //             <AddRemoveLiquidityButton action={'add'}
        //                                       selectedAction={action}
        //                                       onClick={handleActionChange}
        //                                       disabled={isClosedForTrading()}/>
        //             <AddRemoveLiquidityButton action={'remove'}
        //                                       selectedAction={action}
        //                                       onClick={handleActionChange}
        //                                       disabled={isClosedForTrading()}/>
        //         </div>

        //         <div className='space-y-8 flex flex-col  justify-center items-center w-full'>
        //             <label className="block">
        //                 <span className='text-base font-medium'>SOL Amount</span>
        //                 <input type="number"
        //                        name="amount"
        //                        value={amount}
        //                        onChange={handleAmountChange}
        //                        placeholder='Amount'
        //                        className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
        //             </label>

        //             <CustomButton
        //                 onClick={handleAddRemove}
        //                 disabled={isClosedForTrading()}
        //                 title={(action == 'add' ? "Add" : "Remove") + " liquidity"}
        //                 bgColor={"#FED789"}
        //                 bgHover={"#FED789"}
        //                 textColor={"#000000"}
        //                 padding={"8px 55px"}
        //                 border={'1px solid #828282'}/>
        //         </div>
        //     </div>
        // </div>
        <div className="box2 mt-8 bg-white rounded border border-[#e5e5e5] p-5">
            <div className="text-lg font-semibold">Manage Liquidity</div>
            <div className="buySell pt-2">
                <div className="toggleBtn flex flex-wrap justify-between">
                    <AddRemoveLiquidityButton
                        action={"add"}
                        selectedAction={action}
                        onClick={handleActionChange}
                        disabled={isClosedForTrading()}
                    />
                    <AddRemoveLiquidityButton
                        action={"remove"}
                        selectedAction={action}
                        onClick={handleActionChange}
                        disabled={isClosedForTrading()}
                    />
                </div>
            </div>

            {/* <div className="flex flex-wrap justify-between text-md mt-6 mx-2">
                <div>Daily USDC Reward</div>
                <div>11 USDC</div>
            </div>
            <div className="flex flex-wrap justify-between text-md mx-2">
                <div>Daily UMA Reward</div>
                <div>11 UMA</div>
            </div>
            <div className="flex flex-wrap justify-between text-md mx-2">
                <div>Reward vAPR</div>
                <div>261%</div>
            </div> */}

            <div className="solWrap mt-5">
                <div className="text-lg font-semibold pb-2">USDC Amount</div>
                <div className="">
                    <input
                        className="pt-2 block w-full rounded border text-lg border-[#e5e5e5]"
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Amount"
                    />
                </div>
                <CustomButton
                    onClick={handleAddRemove}
                    disabled={isClosedForTrading()}
                    title={(action == "add" ? "Add" : "Remove") + " liquidity"}
                    className="!mt-4 w-full !bg-navy !p-3 !rounded text-white !text-lg !font-semibold hover:opacity-90"
                />
            </div>
        </div>
    );
});

export default LiquidityCard;
