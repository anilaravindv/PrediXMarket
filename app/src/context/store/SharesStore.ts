import RootStore from "./RootStore";
import {action, makeAutoObservable, observable} from "mobx";
import {Program} from "@project-serum/anchor";
import * as api from 'api';

export default class SharesStore {
    @observable
    program?: Program;

    @observable
    myShares: any[] = []

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
    }

    @action
    async getMyShares(userAddress) {
        const accountDataList = await api.getUserShares(userAddress);
        if (accountDataList) {
            const shares = accountDataList
                .map((programAccount) => {
                    const {account, publicKey}: { account: any, publicKey: any } = programAccount;

                    return {
                        address: publicKey,
                        market: account.market,
                        authority: account.authority,
                        liquidityClaimed: account.liquidityClaimed,
                        yesSharesClaimed: account.yesSharesClaimed,
                        noSharesClaimed: account.noSharesClaimed,
                        liquidityShares: account.liquidityShares,
                        yesShares: account.yesShares,
                        noShares: account.noShares,
                    } as any
                });
            this.myShares = [...shares];
        } else {
            this.myShares = [];
        }
    }
}
