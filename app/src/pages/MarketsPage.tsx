import {useStores} from "context/StoreComponent";
import {observer} from "mobx-react-lite";
import {Market} from "context/Market";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useEffect} from "react";
import MarketCard from "components/common/MarketCard";
import {Link} from "react-router-dom";

const MarketsViewComponent = observer(() => {
    const {marketStore} = useStores();

    const wallet = useAnchorWallet();
    useEffect(() => {
        marketStore.getMarkets().then(console.log)
    }, [wallet]);

    return (
        <>
            {marketStore.markets.map((m: Market, index) => {
                return (
                    <Link key={index} to={"/markets/" + m.address}>
                        <MarketCard market={m}/>
                    </Link>
                )
            })}
        </>
    );
});

const MarketsPage = () => {
    return (
        <div className="w-full bg-black text-white px-5 py-14 space-y-5 pt-36">
            <div className="space-y-2">
                <div className="flex justify-center gap-4 items-center flex-wrap">
                    <MarketsViewComponent/>
                </div>
            </div>
        </div>
    );
}
export default MarketsPage