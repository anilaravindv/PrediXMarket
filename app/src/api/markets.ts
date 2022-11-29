import {getWorkspace} from "context/workspace";
import {Program} from "@project-serum/anchor";


export async function getMarket(marketAddress) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject(new Error('workspace not ready'));
    }
    const program = workspace.program as Program;

    return await program.account.market.fetch(marketAddress)
}

export async function getMarkets() {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;

    return await program.account.market.all() as any;
}