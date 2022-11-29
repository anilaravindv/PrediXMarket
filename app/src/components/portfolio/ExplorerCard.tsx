import TempImage from 'assets/tempImage.png'
import SearchInput from 'components/common/SearchInput'
import CoinImage from 'assets/coinIcon.png'
import LearnNEarnImage from 'assets/LearnNEarnIcon.png'

const ExplorerCard = () => {
    return (
        <aside className='w-full lg:w-1/3 border-amber-200 border-2 rounded-xl p-4 px-6 space-y-6 py-5'>
            <div className='text-2xl font-semibold'>Explore</div>
            <SearchInput/>
            <div className='py-5'>
                <img src={TempImage} alt="this should relapce" className='w-full'/>
            </div>
            <div className="block">
                <button type="button"
                        className="inline-flex justify-between items-center px-6 py-3
                     text-white border-zinc-500 border
                     font-semibold text-base
                     leading-tight rounded-lg w-full">
                    <span>New: 0% fees on Bitcoin Trading</span>
                    <div>
                        <img src={CoinImage} alt="coinImage"/>
                    </div>
                </button>
            </div>
            <div className='text-2xl font-semibold pt-8'>More Services</div>
            <div className="block">
                <button type="button"
                        className="inline-flex justify-start items-center p-4 px-2
                     text-white border-zinc-500 border
                     font-semibold text-base
                     leading-tight rounded-lg w-full">
                    <div className='pt-3'>
                        <img src={LearnNEarnImage} alt="LearnAndEarnImage"/>
                    </div>
                    <div className='flex flex-col space-y-2 items-start text-left sm:pr-12'>
                        <span className='text-base font-semibold'>
                            Learn and Earn
                        </span>
                        <span className='font-light text-sm'>
                            Earn FREE crypto while you learn with perdction Market
                        </span>
                    </div>
                </button>
            </div>
        </aside>
    )
}

export default ExplorerCard