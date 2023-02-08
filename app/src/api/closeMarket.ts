import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";

export async function closeMarketWithPyth(marketAddress: any, priceAccount) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;
    const user = (program.provider as anchor.AnchorProvider).wallet;

    return await program.methods
        .closeMarketWithPyth()
        .accounts({
            market: marketAddress,
            user: user.publicKey,
            priceAccount: new PublicKey(priceAccount),
            systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();
}

export async function closeMarketWithAnswer(marketAddress: any, outcomeText) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;
    const user = (program.provider as anchor.AnchorProvider).wallet;

    const outcome = (outcomeText === 'Y') ? {yes: {}} : {no: {}};

    return await program.methods
        .closeMarketWithAnswer(outcome)
        .accounts({
            market: marketAddress,
            user: user.publicKey,
        })
        .rpc();
}