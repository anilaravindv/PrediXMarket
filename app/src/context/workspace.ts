import {clusterApiUrl, Connection, ConnectionConfig, PublicKey} from "@solana/web3.js";
import {AnchorProvider, Idl, Program} from "@project-serum/anchor";
// import idl from "../../../target/idl/marketplace.json";
import idl from "../../../target/idl/marketplace.json";
// import idl from "idl/marketplace.json";
import {Wallet} from "@project-serum/anchor/src/provider";

interface Workspace {
    isReady: boolean,
    wallet: Wallet | null,
    provider: AnchorProvider | null,
    programId: PublicKey | null,
    program: Program | null,
    connection: Connection,
}

const network = import.meta.env.VITE_NETWORK;
let endpoint;
if (network === 'localnet') {
    endpoint = import.meta.env.VITE_LOCALNET_ENDPOINT;
} else {
    endpoint = clusterApiUrl(network);
}

const connectionConfig: ConnectionConfig = {commitment: 'confirmed'};
const connection = new Connection(endpoint, connectionConfig);

let workspace: Workspace = {
    isReady: false,
    wallet: null,
    provider: null,
    programId: null,
    program: null,
    connection,
};

function updateWorkspace() {
    if (workspace.wallet) {
        workspace.isReady = true;
        workspace.provider = new AnchorProvider(connection, workspace.wallet, AnchorProvider.defaultOptions());
        workspace.programId = new PublicKey(idl.metadata.address);
        workspace.program = new Program(idl as Idl, workspace.programId, workspace.provider);
    } else {
        workspace.isReady = false;
        workspace.provider = null;
        workspace.programId = null;
        workspace.program = null;
    }
}

export function setWallet(w: Wallet | null) {
    workspace.wallet = w;
    updateWorkspace();
}

export function getWorkspace(): Workspace {
    return workspace;
}
