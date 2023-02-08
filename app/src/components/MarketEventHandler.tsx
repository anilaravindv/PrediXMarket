import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {getWorkspace} from "context/workspace";
import {useEffect} from "react";
import {useStores} from "context/StoreComponent";

const MarketEventHandler = () => {
    const wallet = useAnchorWallet();
    const {marketStore} = useStores();

    // @ts-ignore
    useEffect(() => {
        const workspace = getWorkspace();
        if (!workspace.isReady) {
            return;
        }
        const program = workspace.program;

        let marketCreatedListener = null;
        let marketResolvedListener = null;
        let liquidityPriceListener = null;
        let outcomePriceListener = null;

        function updateSelectedMarket(event) {
            if (marketStore?.selectedMarket?.address != null && event.market.toBase58() == marketStore.selectedMarket.address) {
                marketStore.getMarket(marketStore.selectedMarket.address).then(console.log);
                marketStore.getShares(marketStore.selectedMarket.address).then(console.log);
            }
        }

        function updateMarkets(event) {
            marketStore.getMarkets().then(console.log);
        }

        // @ts-ignore
        marketCreatedListener = program?.addEventListener("MarketCreated", (event, slot) => {
            console.log(event, slot);
            updateSelectedMarket(event);
            updateMarkets(event);
        });

        // @ts-ignore
        marketResolvedListener = program?.addEventListener("MarketResolved", (event, slot) => {
            console.log(event, slot);
            updateSelectedMarket(event);
        });

        // @ts-ignore
        liquidityPriceListener = program?.addEventListener("MarketLiquidity", (event, slot) => {
            console.log(event, slot);
            updateSelectedMarket(event);
        });

        // @ts-ignore
        outcomePriceListener = program?.addEventListener("MarketOutcomePrice", (event, slot) => {
            console.log(event, slot);
            updateSelectedMarket(event);
            updateMarkets(event);
        });

        return async () => {
            if (marketCreatedListener) {
                await program?.removeEventListener(marketCreatedListener);
            }
            if (marketResolvedListener) {
                await program?.removeEventListener(marketResolvedListener);
            }
            if (liquidityPriceListener) {
                await program?.removeEventListener(liquidityPriceListener);
            }
            if (outcomePriceListener) {
                await program?.removeEventListener(outcomePriceListener);
            }
        };

    }, [wallet]);

    return null;
};

export default MarketEventHandler;