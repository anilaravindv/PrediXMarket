import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {findExistingShareAccount} from "./shares";

export async function sellShares(market, outcomeText, amountSol) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject(new Error('workspace not ready'));
    }
    const program = workspace.program as Program;

    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const outcome = (outcomeText === 'Y') ? {yes: {}} : {no: {}};
    const amount = new anchor.BN(amountSol * LAMPORTS_PER_SOL);
    const maxOutcomeSharesToSell = new anchor.BN(0 * LAMPORTS_PER_SOL);

    const existingShare = await findExistingShareAccount(program, authority, market);
    if (existingShare == undefined) {
        return Promise.reject(new Error('no shares exists for given outcome'));
    }

    await program.methods
        .sellOutcomeShares(outcome, amount, maxOutcomeSharesToSell)
        .accounts({
            authority: authority.publicKey,
            share: existingShare.publicKey,
            market: market,
        })
        .rpc();

    return existingShare.publicKey;
}
