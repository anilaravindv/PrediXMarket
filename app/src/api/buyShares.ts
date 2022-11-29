import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {LAMPORTS_PER_SOL, Transaction} from "@solana/web3.js";
import {findExistingShareAccount} from "./shares";


export async function buyShares(market, outcomeText, amountSol) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject(new Error('workspace not ready'));
    }
    const program = workspace.program as Program;

    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const outcome = (outcomeText === 'Y') ? {yes: {}} : {no: {}};
    const amount = new anchor.BN(amountSol * LAMPORTS_PER_SOL);
    const minOutcomeSharesToBuy = new anchor.BN(0 * LAMPORTS_PER_SOL);

    const existingShare = await findExistingShareAccount(program, authority, market);
    if (existingShare) {
        await program.methods
            .buyOutcomeShares(outcome, amount, minOutcomeSharesToBuy)
            .accounts({
                authority: authority.publicKey,
                share: existingShare.publicKey,
                market: market,
            })
            .signers([])
            .rpc();

        return existingShare.publicKey;
    }

    const shareKeyPair = anchor.web3.Keypair.generate();

    const initShareInstruction = await program.methods
        .initShare()
        .accounts({
            share: shareKeyPair.publicKey,
            market: market,
            authority: authority.publicKey,
        })
        .signers([shareKeyPair])
        .instruction();

    const buyOutcomeShareInstruction = await program.methods
        .buyOutcomeShares(outcome, amount, minOutcomeSharesToBuy)
        .accounts({
            authority: authority.publicKey,
            share: shareKeyPair.publicKey,
            market: market,
        })
        .signers([])
        .instruction();

    const transaction = new Transaction();

    transaction.add(initShareInstruction);
    transaction.add(buyOutcomeShareInstruction);

    transaction.feePayer = authority.publicKey;
    transaction.recentBlockhash = (await workspace.provider!.connection.getLatestBlockhash()).blockhash;

    transaction.sign(shareKeyPair);

    let tx = await authority.signTransaction(transaction);

    const txId = await workspace.provider?.connection?.sendRawTransaction(tx.serialize());
    if (txId) {
        await workspace.provider?.connection?.confirmTransaction(txId)
    }

    return shareKeyPair.publicKey.toBase58();
}
