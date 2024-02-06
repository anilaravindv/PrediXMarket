import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {LAMPORTS_PER_SOL, Transaction} from "@solana/web3.js";
import {BN} from "bn.js";
import {DateTime} from "luxon";

export async function deleteMarket(marketAddress: any) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }

    console.log("marketInfo :" , marketAddress);
    const program = workspace.program as Program;

    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const deleteMarketInstruction = await program.methods
        .deleteMarket()
        .accounts({
            market: new anchor.web3.PublicKey(marketAddress),
            creator: authority.publicKey
        })
        .signers([])
        .instruction();

    const transaction = new Transaction();

    transaction.add(deleteMarketInstruction);

    transaction.feePayer = authority.publicKey;
    transaction.recentBlockhash = (await workspace.provider!.connection.getLatestBlockhash()).blockhash;

    //transaction.sign(marketKeypair);

    let tx = await authority.signTransaction(transaction);

    const txId = await workspace.provider?.connection?.sendRawTransaction(tx.serialize());
    if (txId) {
        await workspace.provider?.connection?.confirmTransaction(txId)
    }

    return marketAddress;
}
