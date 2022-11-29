import {getWorkspace} from "context/workspace";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import * as auth from "auth";

export async function isAdmin() {
    const workspace = getWorkspace();
    if (!workspace.isReady) {
        return Promise.reject('workspace not ready');
    }
    const program = workspace.program as Program;
    const user = (program.provider as anchor.AnchorProvider).wallet;

    return auth.isAdmin(user.publicKey.toBase58());
}
