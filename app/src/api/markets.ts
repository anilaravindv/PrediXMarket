import {getDummyWorkspace, getWorkspace} from "context/workspace";
import {Program} from "@project-serum/anchor";
import { getDialogUtilityClass } from "@mui/material";


export async function getMarket(marketAddress) {
    const workspace = getDummyWorkspace();
    if (!workspace.isReady) {
        return Promise.reject(new Error('workspace not ready'));
    }
    const program = workspace.program as Program;

    return await program.account.market.fetch(marketAddress)
}

export async function getMarkets() {
    const workspace = getDummyWorkspace();
    if (!workspace.isReady) {
        console.log("workspace not ready");
        return;
    }
    const program = workspace.program as Program;
    return await program.account.market.all() as any;
}