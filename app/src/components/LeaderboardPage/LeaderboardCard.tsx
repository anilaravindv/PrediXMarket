import Table from 'components/common/Table'
import {GridColDef} from "@mui/x-data-grid";
import LeaderBoardTypeButton from "./LeaderBoardTypeButton";

const columns: GridColDef[] = [
    {
        field: 'wallet', headerName: 'Wallet', minWidth: 280, maxWidth: 300, sortable: false,
        renderCell: (params) => {
            const rowNo = params.api.getRowIndex(params.row.id);
            let topIcon;
            let textColor;
            if (rowNo === 0) {
                topIcon = <span>&#10102;&nbsp;</span>;
                textColor = "text-orange-500";
            } else if (rowNo === 1) {
                topIcon = <span>&#10103;&nbsp;</span>;
                textColor = "text-purple-500";
            } else if (rowNo === 2) {
                topIcon = <span>&#10104;&nbsp;</span>;
                textColor = "text-green-500";
            }

            return (
                <div className={'flex justify-start font-semibold text-sm space-x-2 ' + textColor}>
                    <div>
                        {topIcon}
                        {params.value}
                    </div>
                </div>
            );
        }
    },
    // {
    //     field: 'grossVolume', headerName: 'Gross Volume', width: 150, sortable: false,
    //     renderCell: (params) => (
    //         <div className='font-normal text-sm text-right w-full sm:sm:pr-8'>
    //             <span className="font-semibold text-right">{params.value.toFixed(1)}</span>&nbsp;
    //             <span className="text-gray-500 text-right">SOL</span>
    //         </div>
    //     )
    // },
    // {
    //     field: 'marketsCreated', headerName: 'Markets Created', width: 150, sortable: false,
    //     renderCell: (params) => (
    //         <div className='font-normal text-sm text-right w-full sm:pr-8'>
    //             <p>{params.value}</p>
    //         </div>
    //     )
    // },
    {
        field: 'wonPredictions', headerName: 'Won Predictions', width: 150, sortable: false,
        renderCell: (params) => (
            
            <div className='font-normal text-sm text-right w-full sm:pr-8'>
                <p>{params.value}</p>
            </div>
        )
    },
    {
        field: 'netVolume', headerName: 'Net Volume', width: 150, sortable: false,
        renderCell: (params) => (
            <div className='font-normal text-sm text-right w-full sm:pr-12'>
                <span className="font-semibold text-right">{params.value.toFixed(1)}</span>&nbsp;
                <span className="text-gray-500 text-right">SOL</span>
            </div>
        )
    },
    {
        field: 'netLiquidity', headerName: 'Net Liquidity', width: 150, sortable: false,
        renderCell: (params) => (
            <div className='font-normal text-sm text-right w-full sm:pr-12'>
                <span className="font-semibold text-right">{params.value.toFixed(1)}</span>&nbsp;
                <span className="text-gray-500 text-right">SOL</span>
            </div>
        )
    },
    {
        field: 'rank', headerName: 'Rank', width: 150, sortable: false,
        renderCell: (params) => (
            <div className='font-normal text-sm text-right w-full sm:pr-24'>
                <span className="font-semibold text-right">{params.value}</span>&nbsp;
            </div>
        )
    },
];

const LeaderBoardCard = ({rows, type, onTypeChange}) => {

    return (
        <div className='w-full lg:w-4/5 border-amber-200 border-2 rounded-xl p-4 px-6 space-y-4'>
            <div className='flex flex-wrap gap-4 '>
                {/*<LeaderBoardTypeButton title={"GROSS VOLUME"} type="gv" selectedType={type} onClick={onTypeChange}/>*/}
                {/*<LeaderBoardTypeButton title={"MARKETS CREATED"} type="mc" selectedType={type} onClick={onTypeChange}/>*/}
                <LeaderBoardTypeButton title={"WON PREDICTIONS"} type="wp" selectedType={type} onClick={onTypeChange}/>
                <LeaderBoardTypeButton title={"NET VOLUME"} type="nv" selectedType={type} onClick={onTypeChange}/>
                <LeaderBoardTypeButton title={"NET LIQUIDITY"} type="nl" selectedType={type} onClick={onTypeChange}/>
            </div>
            <div>
                <Table rows={rows} columns={columns} height={500} defaultPageSize={10}/>
            </div>
        </div>
    )
}

export default LeaderBoardCard