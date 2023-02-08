import {useAnchorWallet} from "@solana/wallet-adapter-react";
import React from "react";

const RewardsPage = () => {
    const wallet = useAnchorWallet();
    if (wallet == null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-black text-white/95 px-5 sm:px-10 lg:px-20 py-24 w-full">
            <div className='text-2xl font-semibold'>Total Weekly Rewards</div>
            <div className='text-gray-500'>Earn rewards every week by trading and providing liquidity. <a href="#">Learn more</a></div>
            <div className="w-full space-y-12 mt-4">
                <div className="flex flex-row gap-4">
                    <div className="w-1/3 rounded-xl h-30 p-4 border-amber-200 border-2 flex flex-col justify-center items-center space-y-2">
                        <div className="text-white text-md font-bold">Total Trading Rewards</div>
                        <div className="text-white text-sm font-semibold">300 USDC <span className="text-gray-400 text-sm">= $300</span></div>
                        <div className="text-white text-sm font-semibold">150 SOL<span className="text-gray-400 text-sm">= $345</span></div>
                    </div>
                    <div className="w-1/3 rounded-xl h-30 p-4 border-amber-200 border-2 flex flex-col justify-center items-center space-y-2">
                        <div className="text-white text-md font-bold">Total Liquidity Rewards</div>
                        <div className="text-white text-sm font-semibold">7000 USDC <span className="text-gray-400 text-sm">= $7,000</span></div>
                        <div className="text-white text-sm font-semibold">5000 SOL<span className="text-gray-400 text-sm">= $11,500</span></div>
                    </div>
                    <div className="w-1/3 rounded-xl h-30 p-4 border-amber-200 border-2 flex flex-col justify-center items-center space-y-2">
                        <div className="text-white text-md font-bold">Time Until Next Epoch</div>
                        <div className="text-white text-sm">05d 11h 26m 42s</div>
                        <div className="text-white text-sm">Oct 7, 2022, 9:30:00 PM</div>
                    </div>
                </div>
                <div className='border-amber-200 border-2 h-80 p-4 flex justify-start rounded-xl space-x-6'>
                    <div className="flex flex-col w-full">
                        <div className='text-2xl font-semibold'>Claimable Rewards</div>
                        <div className='text-gray-500'>Claim rewards after the epoch ends. Unclaimed rewards will roll over to the current epoch.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RewardsPage;