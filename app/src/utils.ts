import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import BigNumber from "bignumber.js";
import BN from "bn.js";

export function toSol(val: BN | BigNumber): BigNumber {
    return BigNumber(val.toString()).dividedBy(LAMPORTS_PER_SOL);
}

export function formatToSol(val: BN | BigNumber): string {
    return toSol(val).toFormat(4);
}
export async function usdToSol(amount: number) {
    let data: any = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    let solPrice = data.data.solana.usd;
    let amtSol = amount / solPrice;
    return amtSol;
}
