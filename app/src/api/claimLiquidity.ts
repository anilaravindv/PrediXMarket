import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {Transaction} from "@solana/web3.js";
import {findExistingShareAccount} from "./shares";

export async function claimLiquidity(market) {
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

    const claimLiquidityFeesInstruction = await program.methods
        .claimLiquidityFees()
        .accounts({
            authority: authority.publicKey,
            share: existingShare.publicKey,
            market: market,
        })
        .instruction();

    const claimLiquidityInstruction = await program.methods
        .claimLiquidity()
        .accounts({
            authority: authority.publicKey,
            share: existingShare.publicKey,
            market: market,
        })
        .instruction();

    const transaction = new Transaction();

    transaction.add(claimLiquidityFeesInstruction);
    transaction.add(claimLiquidityInstruction);

    transaction.feePayer = authority.publicKey;
    transaction.recentBlockhash = (await workspace.provider!.connection.getLatestBlockhash()).blockhash;

    let tx = await authority.signTransaction(transaction);

    const txId = await workspace.provider?.connection?.sendRawTransaction(tx.serialize());
    if (txId) {
        await workspace.provider?.connection?.confirmTransaction(txId)
    }

    return existingShare.publicKey;
}
