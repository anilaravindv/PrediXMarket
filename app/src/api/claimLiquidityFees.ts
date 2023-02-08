import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {findExistingShareAccount} from "./shares";

export async function claimLiquidityFees(market) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject(new Error('workspace not ready'));
    }
    const program = workspace.program as Program;

    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const existingShare = await findExistingShareAccount(program, authority, market);
    if (existingShare == undefined) {
        return Promise.reject(new Error('no shares for user in given market'));
    }

    await program.methods
        .claimLiquidityFees()
        .accounts({
            authority: authority.publicKey,
            share: existingShare.publicKey,
            market: market,
        })
        .signers([])
        .rpc();

    return existingShare.publicKey;
}
