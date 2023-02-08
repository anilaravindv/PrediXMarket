import {AiOutlineAmazon} from 'react-icons/ai'

const LPCard = () => {
    return (
        <div className='border border-amber-100 rounded-2xl bg-neutral-900 p-6 w-1/3 h-64'>
            <div className='flex justify-between items-center pb-3'>
                <div className='flex justify-start items-center space-x-3'>
                    <span className='text-base font-medium'>LP Fee </span>
                    <AiOutlineAmazon/>
                </div>
                <div className='font-semibold'>2.32%</div>
            </div>
            <div className='space-y-1'>
                <div className='flex justify-between items-center'>
                    <div className='text-sm font-normal text-zinc-500'>
                        Your Avg. Price
                    </div>
                    <div className='text-sm font-medium'>0.00 SOL</div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='text-sm font-normal text-zinc-500'>
                        Estimated share bought
                    </div>
                    <div className='text-sm font-medium'>0.00 SOL</div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='text-sm font-normal text-zinc-500'>
                        Maximum winnings
                    </div>
                    <div className='text-sm font-medium'>0.00 SOL</div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='text-sm font-normal text-zinc-500'>
                        Max ROI
                    </div>
                    <div className='text-sm font-medium'>0.00%</div>
                </div>
            </div>
        </div>
    )
}

export default LPCard