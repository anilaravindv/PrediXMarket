import Table from 'components/common/Table'
import {GridColDef} from "@mui/x-data-grid";
import {formatToSol} from "utils";
import React from "react";
import {Link} from "react-router-dom";


const columns: GridColDef[] = [
    {
        field: 'market', headerName: 'Market', width: 150, renderCell: (params) => {
            let marketAddress = params.value.toBase58();
            marketAddress = marketAddress.slice(0, 4) + '..' + marketAddress.slice(-4);
            return (
                <div className='flex justify-start font-semibold text-sm space-x-2'>
                    <Link to={"/markets/" + params.value}>
                        <div>{marketAddress}</div>
                    </Link>
                </div>
            )
        }
    },
    {field: 'yesShares', headerName: 'Yes Shares', width: 150,},
    {field: 'noShares', headerName: 'No Shares', width: 150,},
];


const OutcomeSharesTable = ({shares}) => {
    const rows = shares.map((share: any, index) => {
        return {
            id: index,
            market: share.market,
            liquidityShares: formatToSol(share.liquidityShares),
            yesShares: formatToSol(share.yesShares),
            noShares: formatToSol(share.noShares),
            liquidityClaimed: share.liquidityClaimed ? 'Yes' : 'No',
            yesSharesClaimed: share.yesSharesClaimed ? 'Yes' : 'No',
            yesSharesClaimedVoided: share.yesSharesClaimedVoided ? 'Yes' : 'No',
            noSharesClaimed: share.noSharesClaimed ? 'Yes' : 'No',
            noSharesClaimedVoided: share.noSharesClaimedVoided ? 'Yes' : 'No',
        }
    });

    return (
        <Table rows={rows} columns={columns} height={400} defaultPageSize={10}/>
    )
}

export default OutcomeSharesTable