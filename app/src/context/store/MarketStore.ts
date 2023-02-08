import RootStore from "./RootStore";
import {action, makeAutoObservable, observable} from "mobx";
import {Program} from "@project-serum/anchor";
import * as api from 'api';
import {DateTime} from "luxon";

export default class MarketStore {
    @observable
    program?: Program;

    @observable
    markets: any[] = [];

    @observable
    selectedShares: any[] = []

    @observable
    selectedMarket: any = null;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
    }

    @action
    async getMarket(address) {
        try {
            const marketAccount: any = await api.getMarket(address);
            this.selectedMarket = {
                address: address,
                creator: marketAccount.creator,
                state: marketAccount.state,
                createdAt: DateTime.fromSeconds(marketAccount.createdAt.toNumber()),
                expiresAt: DateTime.fromSeconds(marketAccount.expiresAt.toNumber()),
                name: marketAccount.name,
                about: marketAccount.about,
                category: marketAccount.category,
                imageUrl: marketAccount.imageUrl,
                resolutionSource: marketAccount.resolutionSource,
                resolver: marketAccount.resolver,
                yesFundAmount: marketAccount.yesFundAmount,
                noFundAmount: marketAccount.noFundAmount,
                resolutionOperator: marketAccount.resolutionOperator,
                expectedValue: marketAccount.expectedValue,
                feePercentage: marketAccount.feePercentage,
                feesPoolWeight: marketAccount.feesPoolWeight,
                balance: marketAccount.balance,
                liquidity: marketAccount.liquidity,
                volume: marketAccount.volume,
                availableShares: marketAccount.availableShares,
                availableYesShares: marketAccount.availableYesShares,
                availableNoShares: marketAccount.availableNoShares,
                totalYesShares: marketAccount.totalYesShares,
                totalNoShares: marketAccount.totalNoShares,
            } as any;
        } catch (e) {
            this.selectedMarket = null;
        }
    }

    @action
    async getMarkets() {
        const accountDataList = await api.getMarkets();
        if (accountDataList) {
            const markets = accountDataList
                .sort((a, b) => b.account.createdAt.toNumber() - a.account.createdAt.toNumber())
                .map((programAccount) => {
                    const {account, publicKey}: { account: any, publicKey: any } = programAccount;

                    return {
                        address: publicKey,
                        creator: account.creator,
                        state: account.state,
                        createdAt: DateTime.fromSeconds(account.createdAt.toNumber()),
                        expiresAt: DateTime.fromSeconds(account.expiresAt.toNumber()),
                        name: account.name,
                        about: account.about,
                        category: account.category,
                        imageUrl: account.imageUrl,
                        resolutionSource: account.resolutionSource,
                        resolver: account.resolver,
                        liquidity: account.liquidity,
                        volume: account.volume,
                        availableShares: account.availableShares,
                        availableYesShares: account.availableYesShares,
                        availableNoShares: account.availableNoShares,
                        totalYesShares: account.totalYesShares,
                        totalNoShares: account.totalNoShares,
                    } as any
                });
            this.markets = [...markets];
        } else {
            this.markets = [];
        }
    }

    @action
    async createMarket(marketInfo: any) {
        return api.createMarket(marketInfo);
    }

    @action
    async deleteMarket(marketAddress: any) {
        return api.deleteMarket(marketAddress);
    }

    @action
    async closeMarketWithPyth(market: any) {
        await api.closeMarketWithPyth(market.address, market.resolutionSource);
    }

    @action
    async closeMarketWithAnswer(marketAddress: any, outcome) {
        await api.closeMarketWithAnswer(marketAddress, outcome);
    }

    @action
    async addLiquidity({market, amount}) {
        await api.addLiquidity(market, amount);
    }

    @action
    async removeLiquidity({market, amount}) {
        await api.removeLiquidity(market, amount);
    }

    @action
    async buyShares({market, outcome, amount}) {
        await api.buyShares(market, outcome, amount);
    }

    @action
    async sellShares({market, outcome, amount}) {
        await api.sellShares(market, outcome, amount);
    }

    @action
    async getShares(marketAddress: any) {
        this.selectedShares = await api.getShares(marketAddress) || [];
    }

    @action
    async claimWinnings(market) {
        await api.claimWinnings(market);
    }

    @action
    async claimLiquidity(market) {
        await api.claimLiquidity(market);
    }

    @action
    async claimLiquidityFees(market) {
        await api.claimLiquidityFees(market);
    }
}
