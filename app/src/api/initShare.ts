import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {findExistingShareAccount} from "./shares";

export async function initShare(market) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject('workspace not ready');
    }
    const program = workspace.program as Program;

    const authority = (program.provider as anchor.AnchorProvider).wallet;

    const shareKeyPair = anchor.web3.Keypair.generate();
    const existingShare = await findExistingShareAccount(program, authority, market);
    if (existingShare) {
        return Promise.reject("Share already exists");
    } else {
        const tx = await program.methods
            .initShare()
            .accounts({
                share: shareKeyPair.publicKey,
                market: market,
                authority: authority.publicKey,
            })
            .signers([shareKeyPair])
            .rpc();

        return shareKeyPair.publicKey.toBase58();
    }
}
