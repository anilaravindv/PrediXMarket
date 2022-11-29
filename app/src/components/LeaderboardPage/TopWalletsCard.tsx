import Dropdown from "./Dropdown";

const TopWalletsCard = ({rows, filter, onFilterChange}) => {
    const first = rows.find((i) => {
        return i.rank == 1
    });

    const second = rows.find((i) => {
        return i.rank == 2
    });

    const third = rows.find((i) => {
        return i.rank == 3
    });

    return (
        <div className='w-full lg:w-1/5 border-amber-200 border-2 rounded-xl p-4 px-6 space-y-4'>
            <div className='font-semibold'>Top Wallets</div>

            <div className="flex justify-end">
                <Dropdown selected={filter} onClick={onFilterChange}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <span className="text-orange-500">&#10102;&nbsp;&nbsp;{first?.wallet}</span>
                <span className="text-right">1</span>
                <span className="text-purple-500">&#10103;&nbsp;&nbsp;{second?.wallet}</span>
                <span className="text-right">2</span>
                <span className="text-green-500">&#10104;&nbsp;&nbsp;{third?.wallet}</span>
                <span className="text-right">3</span>
            </div>
        </div>
    )
}

export default TopWalletsCard