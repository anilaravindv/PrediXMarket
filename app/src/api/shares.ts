import {getWorkspace} from "context/workspace";
import {Program} from "@project-serum/anchor";


export async function getShares(marketAddress: any) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;

    return await program.account.share.all([
        {
            memcmp: {
                offset: 8, // Discriminator.
                bytes: marketAddress,
            }
        },
    ]) as any;
}

export async function getUserShares(userAddress: any) {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return;
    }
    const program = workspace.program as Program;

    return await program.account.share.all([
        {
            memcmp: {
                offset: 8 + 32, // Discriminator + Market Public key
                bytes: userAddress,
            }
        },
    ]) as any;
}

export async function findExistingShareAccount(program, authority, market) {
    const shareAccounts = await program.account.share.all([
        {
            memcmp: {
                offset: 8, // Discriminator
                bytes: market,
            }
        },
        {
            memcmp: {
                offset: 8 + 32, // Discriminator + Market Public key
                bytes: authority.publicKey.toBase58(),
            }
        },
    ]);

    return shareAccounts[0] || null;
}
