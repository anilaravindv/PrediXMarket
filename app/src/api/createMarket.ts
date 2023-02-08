import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {LAMPORTS_PER_SOL, Transaction} from "@solana/web3.js";
import {BN} from "bn.js";
import {DateTime} from "luxon";

export async function createMarket(marketInfo: any) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;

    const marketKeypair = anchor.web3.Keypair.generate();
    const shareKeyPair = anchor.web3.Keypair.generate();
    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const expiresAt = DateTime.fromJSDate(marketInfo.expiresAt);

    const createMarketInstruction = await program.methods
        .createMarket(
            marketInfo.name,
            marketInfo.about,
            marketInfo.category,
            marketInfo.imageUrl,
            marketInfo.feePercentage,
            marketInfo.resolutionSource,
            marketInfo.resolver,
            new anchor.BN(expiresAt.toUnixInteger()),
            marketInfo.expectedValue,
            marketInfo.resolutionOperator
        )
        .accounts({
            market: marketKeypair.publicKey,
            creator: authority.publicKey
        })
        .signers([marketKeypair])
        .instruction();

    const initShareInstruction = await program.methods
        .initShare()
        .accounts({
            share: shareKeyPair.publicKey,
            market: marketKeypair.publicKey,
            authority: authority.publicKey,
        })
        .signers([shareKeyPair])
        .instruction();

    const addLiquidityInstruction = await program.methods
        .addLiquidity(new BN(marketInfo.initialLiquidity * LAMPORTS_PER_SOL))
        .accounts({
            authority: authority.publicKey,
            market: marketKeypair.publicKey,
            share: shareKeyPair.publicKey,
        })
        .signers([])
        .instruction();

    const transaction = new Transaction();

    transaction.add(createMarketInstruction);
    transaction.add(initShareInstruction);
    transaction.add(addLiquidityInstruction);

    if (marketInfo.bias != 0) {
        const outcome = (marketInfo.bias > 0) ? {yes: {}} : {no: {}};
        const biasAmount = Math.abs(marketInfo.bias);

        const buyOutcomeShareInstruction = await program.methods
            .buyOutcomeShares(outcome, new BN(biasAmount * LAMPORTS_PER_SOL), new BN(0))
            .accounts({
                authority: authority.publicKey,
                share: shareKeyPair.publicKey,
                market: marketKeypair.publicKey,
            })
            .signers([])
            .instruction();

        transaction.add(buyOutcomeShareInstruction);
    }

    transaction.feePayer = authority.publicKey;
    transaction.recentBlockhash = (await workspace.provider!.connection.getLatestBlockhash()).blockhash;

    transaction.sign(marketKeypair, shareKeyPair);

    let tx = await authority.signTransaction(transaction);

    const txId = await workspace.provider?.connection?.sendRawTransaction(tx.serialize());
    if (txId) {
        await workspace.provider?.connection?.confirmTransaction(txId)
    }

    return marketKeypair.publicKey.toBase58();
}
