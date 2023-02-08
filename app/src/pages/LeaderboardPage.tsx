import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import LeaderBoardCard from "components/LeaderboardPage/LeaderboardCard";
import TopWalletsCard from "components/LeaderboardPage/TopWalletsCard";

const rows = [
    {
        id: 1,
        wallet: "0x79D5...56B3",
        grossVolume: 9120.7,
        marketsCreated: 2,
        wonPredictions: 0,
        netVolume: -6254.8,
        netLiquidity: 4194.0,
    },
    {
        id: 2,
        wallet: "0xf294...2484",
        grossVolume: 15722.7,
        marketsCreated: 3,
        wonPredictions: 0,
        netVolume: -5010.6,
        netLiquidity: 3654.2,
    },
    {
        id: 3,
        wallet: "0x4c41...9Fc1",
        grossVolume: 9865.2,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 9834.8,
        netLiquidity: 0,
    },
    {
        id: 4,
        wallet: "0x34e0...f004",
        grossVolume: 9120.7,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 9008.3,
        netLiquidity: 0,
    },
    {
        id: 5,
        wallet: "0xd071...12Ec",
        grossVolume: 8930.0,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 8855.3,
        netLiquidity: 0,
    },
    {
        id: 6,
        wallet: "0xd142...1b8d",
        grossVolume: 8884.6,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 8809.6,
        netLiquidity: 0,
    },
    {
        id: 7,
        wallet: "0xb2f4...2D2B",
        grossVolume: 8764.1,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8647.0,
        netLiquidity: 0,
    },
    {
        id: 8,
        wallet: "0xffF5...E04f",
        grossVolume: 8610.0,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8501.0,
        netLiquidity: 0,
    },
    {
        id: 9,
        wallet: "0xffF5...E04f",
        grossVolume: 8610.0,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8501.0,
        netLiquidity: 0,
    },
    {
        id: 10,
        wallet: "0x537e...2418",
        grossVolume: 8565.8,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8457.1,
        netLiquidity: 0,
    },
    {
        id: 11,
        wallet: "0x537e...2418",
        grossVolume: 8565.8,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8457.1,
        netLiquidity: 0,
    },
    {
        id: 12,
        wallet: "0x537e...2418",
        grossVolume: 8565.8,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: -8457.1,
        netLiquidity: 0,
    },
    {
        id: 13,
        wallet: "0x951d...f535",
        grossVolume: 0,
        marketsCreated: 0,
        wonPredictions: 1,
        netVolume: 0,
        netLiquidity: 0,
    },
    {
        id: 14,
        wallet: "0x695d...05d9",
        grossVolume: 15.0,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 0,
        netLiquidity: 15.0,
    },
    {
        id: 15,
        wallet: "0x59Af...Af7e",
        grossVolume: 14.5,
        marketsCreated: 0,
        wonPredictions: 0,
        netVolume: 14.5,
        netLiquidity: 0,
    },
    {
        id: 16,
        wallet: "0x9b54...F37D",
        grossVolume: 101.2,
        marketsCreated: 0,
        wonPredictions: 1,
        netVolume: 7.5,
        netLiquidity: -10.7,
    },
];

const LeaderboardPage = () => {
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

        // @ts-ignore
        n.sort((a, b) => {
            if (type === 'gv') {
                return b.grossVolume - a.grossVolume;
            } else if (type === 'mc') {
                return b.marketsCreated - a.marketsCreated;
            } else if (type === 'wp') {
                return b.wonPredictions - a.wonPredictions;
            } else if (type === 'nv') {
                return b.netVolume - a.netVolume;
            } else if (type === 'nl') {
                return b.netLiquidity - a.netLiquidity;
            }
        });

        n = n.map((a, i) => {
            return {
                ...a,
                rank: i + 1
            }
        });

        // @ts-ignore
        setSortedRows(n);
    }, [type])

    if (wallet == null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-black text-white/95  px-5 sm:px-10 lg:px-20 py-32 w-full space-y-12">
            <div className='text-2xl font-semibold'>Leaderboard</div>
            <div
                className='flex flex-col lg:flex-row lg:justify-between justify-center items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-6 h-full w-full'>
                <LeaderBoardCard rows={sortedRows} type={type} onTypeChange={handleTypeChange}/>
                <TopWalletsCard rows={sortedRows} filter={filter} onFilterChange={handleFilterChange}/>
            </div>
        </div>
    )
}

export default LeaderboardPage;