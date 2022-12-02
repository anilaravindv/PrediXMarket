import Table from "components/common/Table";
import { GridColDef } from "@mui/x-data-grid";
import { formatToSol } from "utils";
import React from "react";

const columns: GridColDef[] = [
    {
        field: "authority",
        headerName: "User",
        minWidth: 270,
        maxWidth: 300,
        renderCell: (params) => {
            let authorityAddress = params.value.toBase58();
            authorityAddress = authorityAddress.slice(0, 4) + ".." + authorityAddress.slice(-4);
            return (
                <div className="flex justify-start font-semibold text-sm space-x-2">
                    <div>{authorityAddress}</div>
                </div>
            );
        },
    },
    { field: "liquidityShares", headerName: "Liquidity Shares", minWidth: 270, maxWidth: 200 },
    { field: "yesShares", headerName: "Yes Shares", minWidth: 270, maxWidth: 200 },
    { field: "noShares", headerName: "No Shares", minWidth: 270, maxWidth: 250 },
    // {field: 'liquidityClaimed', headerName: 'Liquidity Claimed', width: 150,},
    // {field: 'yesSharesClaimed', headerName: 'YesShares Claimed', width: 150,},
    // {field: 'noSharesClaimed', headerName: 'NoShares Claimed', width: 150,},
];

const SharesTable = ({ shares }) => {
    const rows = shares.map((share: any, index) => {
        return {
            id: index,
            authority: share.account.authority,
            liquidityShares: formatToSol(share.account.liquidityShares),
            yesShares: formatToSol(share.account.yesShares),
            noShares: formatToSol(share.account.noShares),
            liquidityClaimed: share.account.liquidityClaimed ? "Yes" : "No",
            yesSharesClaimed: share.account.yesSharesClaimed ? "Yes" : "No",
            noSharesClaimed: share.account.noSharesClaimed ? "Yes" : "No",
        };
    });

    return <Table rows={rows} columns={columns} height={400} defaultPageSize={10} />;
};

export default SharesTable;
