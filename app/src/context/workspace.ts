import {clusterApiUrl, Connection, ConnectionConfig, PublicKey} from "@solana/web3.js";
import {AnchorProvider, Idl, Program, web3} from "@project-serum/anchor";
// import {Wallet as AnchorWallet} from "@project-serum/anchor";
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

export function getDummyWorkspace(): Workspace {

    // Create your Anchor Provider that rejects when it signs anything.This is a provider used when wallet is not connected
    const provider = new AnchorProvider(
        connection,
        {
            signTransaction: () => Promise.reject(),
            signAllTransactions: () => Promise.reject(),
            publicKey: web3.Keypair.generate().publicKey,
        },
        {}
    );
    
    let workspace2: Workspace = {
        isReady: false,
        wallet: null,
        provider: null,
        programId: null,
        program: null,
        connection,
    };

    workspace2.isReady = true;
    workspace2.provider = provider;
    workspace2.programId = new PublicKey(idl.metadata.address);
    workspace2.program = new Program(idl as Idl, workspace2.programId,provider);
    return workspace2;
}