import LineChart from "./LineChart";
import React from "react";
import WalletBalance from "./WalletBalance";
import CustomButton from "components/common/CustomButton";
import {useNavigate} from "react-router-dom";

const ChartCard = (props: any) => {
    const navigate = useNavigate();

    return (
        <div className='border-amber-200 border-2 p-4 flex justify-start items-center rounded-xl space-x-6'>
            <div className="flex flex-col w-full">
                <div className="px-6 space-y-1">
                    <div className="flex flex-col justify-start text-neutral-200 ">
                        <div className="flex">
                            <div className="text-2xl">
                                <WalletBalance/>
                            </div>
                            <div className="grow flex justify-end">
                                <CustomButton title="Rewards"
                                              bgColor="#F9A13D"
                                              bgHover="#F9A13D"
                                              border="1px solid #828282"
                                              borderRadius="4px"
                                              textColor="#FEFEFE"
                                              width="140px" fontSize="10px"
                                              onClick={() => {navigate("/rewards")}}/>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-500">Total Balance</div>
                    </div>
                    <div className="text-3xl font-semibold ">
                    </div>
                </div>
                <LineChart/>
            </div>
        </div>
    )
}

export default ChartCard