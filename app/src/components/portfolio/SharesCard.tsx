import ShareTypeButton from "./ShareTypeButton";
import {useState} from "react";
import Dropdown from "./Dropdown";
import LiquiditySharesTable from "./LiquiditySharesTable";
import OutcomeSharesTable from "./OutcomeSharesTable";

const SharesCard = ({shares}) => {
    const [type, setType] = useState('liquidity');
    const [filter, setFilter] = useState('open');

    function onTypeChange(e, type) {
        setType(type)
    }

    return (
        <>
            <div className='w-full border-amber-200 border-2 rounded-xl p-4 px-6 space-y-4'>
                <div className='flex flex-wrap gap-4 '>
                    <ShareTypeButton title={"Liquidity"} type="liquidity" selectedType={type} onClick={onTypeChange}/>
                    <ShareTypeButton title={"Outcome"} type="outcome" selectedType={type} onClick={onTypeChange}/>

                    <div className="flex justify-end grow">
                        <Dropdown selected={filter} onClick={(e, f) => setFilter(f)}/>
                    </div>
                </div>
                <div>
                    {
                        (type === 'liquidity')
                            ? <LiquiditySharesTable shares={shares}/>
                            : null
                    }
                    {
                        (type === 'outcome')
                            ? <OutcomeSharesTable shares={shares}/>
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default SharesCard