import React from 'react'
import {FiHeart} from 'react-icons/fi'
import {formatToSol} from "utils";

interface IMarketCardProps {
    market: any,
}

const MarketCard = ({market,}: IMarketCardProps) => {
    const yesOutcomeSharePrice = ((market.availableShares - market.availableYesShares) / market.availableShares).toFixed(4);
    const noOutcomeSharePrice = ((market.availableShares - market.availableNoShares) / market.availableShares).toFixed(4);
    return (
        <div className='flex flex-col border-2 border-amber-100 rounded-2xl space-y-2 mb-4 w-72 sm:w-80'>
            <div className='flex flex-col space-y-4 p-3'>
                <div className='flex justify-start items-center space-x-2'>
                    <img src={market.imageUrl} alt="image" className='rounded-md w-16 h-16'/>
                    <div className='text-sm sm:text-base'>{market.name}</div>
                </div>
                <div className='flex justify-between items-center'>
                    <div
                        className='bg-orange-400 px-3 py-1 text-black text-base text-center font-medium rounded-2xl'>{market.category}</div>
                    <div>
                        <div className="flex mr-4">
                            {/*                <Avatar className="border-2 border-black -mr-5 w-5" src={image} />
                            <Avatar className="border-2 border-black -mr-5 w-5" src={image} />
                            <Avatar className="border-2 border-black -mr-5 w-5" src={image} />
                            <Avatar className="border-2 -mr-5" sx={{ width: '80px', borderRadius: "50px", borderColor: '#000', backgroundColor: '#6D73F5' }}>
                                <label className="text-black text-sm font-medium">+{"3.2k"}</label>
                            </Avatar>*/}
                        </div>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='flex justify-start space-x-2 items-center'>
                        <div className='text-zinc-500 text-sm font-medium'>Liquidity</div>
                        <div className='text-neutral-200 text-sm font-bold'>{formatToSol(market.liquidity)}</div>
                    </div>
                    <div><FiHeart/></div>
                </div>
            </div>
            <div className='flex justify-around items-center rounded-b-2xl bg-neutral-900 py-3'>
                <div className='flex justify-center items-center space-x-2'>
                    <div className='text-base sm:text-lg font-semibold'>Yes</div>
                    <div className='text-base sm:text-lg font-bold'>{yesOutcomeSharePrice} SOL</div>
                </div>
                <div className='h-8 border w-0 border-zinc-700 '></div>
                <div className='flex justify-center items-center space-x-2 '>
                    <div className='text-base sm:text-lg font-semibold'>No</div>
                    <div className='text-base sm:text-lg font-bold'>{noOutcomeSharePrice} SOL</div>
                </div>
            </div>
        </div>
    )
}

export default MarketCard