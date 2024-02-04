import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import RecentActivityTable from "./RecentActivityTable";

const rows = [
    {
        id: 1,
        wallet: "0x79D5...56B3",
        action: "Bought 1.3 Yes shares",
        txnid: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    },
    {
        id: 2,
        wallet: "0xf294...2484",
        action: "Sold 2.6 Yes shares",
        txnid: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    },
    {
        id: 3,
        wallet: "0x4c41...9Fc1",
        action: "Bought 0.54 Yes shares",
        txnid: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    },
    {
        id: 4,
        wallet: "0x34e0...f004",
        action: "Added 1.2 Liquidity shares",
        txnid: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    },
    {
        id: 5,
        wallet: "0xd071...12Ec",
        action: "Removed 0.2 Liquidity shares",
        txnid: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    }
];

const MarketStatsCard = () => {
    const wallet = useAnchorWallet();
    const [type, setType] = useState('gv');
    const [filter, setFilter] = useState('weekly');
    const [sortedRows, setSortedRows] = useState([]);

    function handleTypeChange(e, type) {
        setType(type);
    }

    function handleFilterChange(e, filter) {
        setFilter(filter);
    }

    useEffect(() => {
        let n = [...rows];

        // // @ts-ignore
        // n.sort((a, b) => {
        //     if (type === 'gv') {
        //         return b.grossVolume - a.grossVolume;
        //     } else if (type === 'mc') {
        //         return b.marketsCreated - a.marketsCreated;
        //     }
        // });

        n = n.map((a, i) => {
            return {
                ...a,
                rank: i + 1
            }
        });

        // @ts-ignore
        setSortedRows(n);
    }, [type])

    // if (wallet == null) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="bg-transparent text-black/95 w-full space-y-6">
            {/* <div className='text-2xl font-semibold'>Leaderboard</div> */}
            <div
                className='flex flex-col lg:flex-row lg:justify-between justify-center items-center lg:items-start h-full w-full'>
                <RecentActivityTable rows={sortedRows} type={type} onTypeChange={handleTypeChange}/>
            </div>
        </div>
    )
}

export default MarketStatsCard;