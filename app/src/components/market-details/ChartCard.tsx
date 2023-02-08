import LineChart from "components/common/LineChart";
import {TbArrowsRightLeft} from 'react-icons/tb'
import {RiSettings4Line} from 'react-icons/ri'
import {observer} from "mobx-react-lite";
import {useStores} from "context/StoreComponent";
import React from "react";
import CustomButton from "components/common/CustomButton";

const ChartCard = observer((props: any) => {
    const {marketStore} = useStores();

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    return (
        <div className='border-amber-200 border-2 p-4 flex justify-start items-center rounded-xl space-x-6'>
            <div className="flex flex-col space-y-10">
                <div>
                    <hr/>
                </div>
                <div className="px-6 space-y-1">
                    <div className="flex justify-between items-center text-neutral-200 ">
                        <div className="text-sm font-medium ">No</div>
                        <div className="flex justify-between items-center text-xl space-x-3">
                            <TbArrowsRightLeft/>
                            <RiSettings4Line/>
                        </div>
                    </div>
                    <div className="text-3xl font-semibold ">100 C</div>
                    <div className="text-xs text-green-300">+76c (+2347.89%) <span className="text-zinc-500">Since Market Creation</span>
                    </div>
                </div>
                <div>
                    <LineChart/>
                </div>
                <div className="flex justify-between items-center px-3">
                    <div>
                        <select id="markets" className="bg-black border border-stone-500 text-white
                        text-sm rounded-md block w-full px-3 py-2
                        dark:placeholder-gray-400 dark:text-white">
                            <option defaultValue={"1"}>View other market</option>
                            <option value="1">ONE</option>
                            <option value="2">TWO</option>
                        </select>
                    </div>
                    <div className="flex justify-end items-center space-x-5">
                        <CustomButton title={"1H"} bgColor={"#101010"} bgHover={"#101010"}
                                      border={"1px solid #FEE5B9"}/>
                        <CustomButton title={"6H"} bgColor={"#101010"} bgHover={"#101010"}
                                      border={"1px solid #FEE5B9"}/>
                        <CustomButton title={"1D"} bgColor={"#101010"} bgHover={"#101010"}
                                      border={"1px solid #FEE5B9"}/>
                        <CustomButton title={"1W"} bgColor={"#101010"} bgHover={"#101010"}
                                      border={"1px solid #FEE5B9"}/>
                        <CustomButton title={"1M"} bgColor={"#101010"} bgHover={"#101010"}
                                      border={"1px solid #FEE5B9"}/>
                        <CustomButton title={"ALL"} bgColor={"#FEE5B9"} bgHover={"#FEE5B9"} border={"1px solid #FEE5B9"}
                                      textColor={"#000"}/>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default ChartCard