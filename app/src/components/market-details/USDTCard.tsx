import CustomButton from 'components/common/CustomButton'
import React from 'react'
import {AiFillSetting} from 'react-icons/ai'

const USDTCard = () => {
    return (
        <div className='border border-amber-100 rounded-2xl bg-neutral-900 p-6 space-y-4 w-1/3 h-64'>
            <div className='flex justify-between items-center'>
                <div className='text-lg font-semibold'>USDT Amount</div>
                <AiFillSetting className='text-lg font-semibold'/>
            </div>
            <div className='text-lg font-semibold'>
                <label className="flex items-center border border-zinc-500 px-1 rounded-md">
                    <input type="text"
                           name="name"
                           placeholder='0 SOL'
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1 focus:outline-none"
                    />
                    <CustomButton title={"MAX"} bgColor={"#F9A13D"} bgHover={"#F9A13D"}
                                  textColor={"#000000"} padding={"3px 30px"} border={'1px solid #828282'}/>
                </label>
            </div>
            <div className='w-full pt-16'>
                <CustomButton title={"Sign Up to Tade"} bgColor={"#FED789"} bgHover={"#FED789"}
                              textColor={"#000000"} padding={"8px 60px"} border={'1px solid #828282'}/>
            </div>
        </div>
    )
}

export default USDTCard