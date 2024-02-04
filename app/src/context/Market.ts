import {PublicKey} from "@solana/web3.js";

export interface Market {
    address: PublicKey
    creator: PublicKey,
    status: any,
    createdAt: Date,
    expiresAt: Date,
    name: string,
    about: string,
    resolution_source: string,
    resolver: string,
    category: string,
}