import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import BN from "bn.js";

export function toSol(val: BN | BigNumber): BigNumber {
    return BigNumber(val.toString()).dividedBy(LAMPORTS_PER_SOL);
}

export function formatToSol(val: BN | BigNumber): string {
    return toSol(val).toFormat(4);
}
