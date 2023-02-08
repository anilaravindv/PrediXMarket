import {AiOutlineEye} from 'react-icons/ai'
import SharesTable from "./SharesTable";

const SharesCard = ({shares}) => {
    return (
        <div className='w-full border-amber-200 border-2 rounded-xl p-4 px-6 space-y-4'>
            <div className='flex justify-between items-center '>
                <div className='flex justify-start items-center space-x-4'>
                    <div className='text-lg font-semibold'>Shares</div>
                    <AiOutlineEye className='text-2xl text-zinc-500 text-center'/>
                </div>
            </div>
            <div className='w-full'>
                <SharesTable shares={shares}/>
            </div>
        </div>
    )
}

export default SharesCard