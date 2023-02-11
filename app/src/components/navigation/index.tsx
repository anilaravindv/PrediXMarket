import { Link } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Logo from "assets/images/logo.png";
import ElementHeader from "assets/images/element_01.png";

import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface ICreateMarketLink {
    onClick?: () => void;
}

const CreateMarketLink = observer((Props: ICreateMarketLink) => {
    const { profileStore } = useStores();
    const wallet = useAnchorWallet();

    useEffect(() => {
        profileStore.isAdmin().then(console.log);
    }, [wallet]);

    if (!profileStore.isAdminUser) {
        return null;
    }

    return (
        <Link to="/markets/create" onClick={Props.onClick}>
            Create Market
        </Link>
    );
});

const Navigation = () => {
    const { connected } = useWallet();
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <>
            <header className="flex w-screen justify-center space-x-14 z-20 bg-transparent py-5 absolute">
                <div className="container flex justify-between px-3">
                    <Link to="/">
                        <div className="flex justify-start items-center">
                            <img className="md:h-20 h-16" src={Logo} alt="logo" />
                        </div>
                    </Link>
                    <div className="hidden lg:flex justify-between items-center space-x-10 font-normal">
                        {connected ? (
                            <>
                                <CreateMarketLink />
                                {[
                                    { name: "Markets", link: "/markets" },
                                    { name: "Portfolio", link: "/portfolio" },
                                    { name: "Leaderboard", link: "/leaderboard" },
                                ].map(({ name, link }) => (
                                    <li className="list-none hover:text-sky-blue hover:underline hover:underline-offset-8 transition-colors duration-75">
                                        <Link className="px-2" to={link}>
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                            </>
                        ) : (
                            <>
                                {[{ name: "Markets", link: "/markets" }].map(({ name, link }) => (
                                    <li className="list-none hover:text-sky-blue hover:underline hover:underline-offset-8">
                                        <Link className="px-2" to={link}>
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                    </div>
                    <div className="hidden lg:flex justify-between items-center">
                        {connected ? (
                            <WalletDisconnectButton className="!bg-navy !py-3 !px-5 !uppercase !font-medium hover:!scale-[1.05]" />
                        ) : (
                            <WalletMultiButton className="!bg-navy !py-3 !px-5 !uppercase !font-medium hover:!scale-[1.05]" />
                        )}
                    </div>
                    <section className="MOBILE-MENU flex items-center lg:hidden">
                        <GiHamburgerMenu
                            className="w-12 h-12 p-2 pr-3 text-white bg-navy rounded"
                            onClick={() => setIsNavOpen((prev) => !prev)}
                        />
                        <div className={isNavOpen ? "showMenuNav shadow-sm" : "hideMenuNav"}>
                            <div className="MENU-LINK-MOBILE-OPEN flex flex-col min-h-[250px] px-3 py-5 font-normal">
                                {connected ? (
                                    <>
                                        <CreateMarketLink onClick={() => setIsNavOpen(false)} />
                                        <Link
                                            className="py-1 border-b border-b-neutral-200"
                                            to="/markets"
                                            onClick={() => setIsNavOpen(false)}
                                        >
                                            Markets
                                        </Link>
                                        <Link
                                            className="py-1 border-b border-b-neutral-200"
                                            to="/portfolio"
                                            onClick={() => setIsNavOpen(false)}
                                        >
                                            Portfolio
                                        </Link>
                                        <Link
                                            className="py-1 border-b border-b-neutral-200 mb-5"
                                            to="/leaderboard"
                                            onClick={() => setIsNavOpen(false)}
                                        >
                                            Leaderboard
                                        </Link>
                                    </>
                                ) : null}
                                {connected ? (
                                    <WalletDisconnectButton onClick={() => setIsNavOpen(false)} />
                                ) : (
                                    <WalletMultiButton onClick={() => setIsNavOpen(false)} />
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                <style>{`
                .hideMenuNav {
                     display: none;
                }
                .showMenuNav {
                    display: block;
                    position: absolute;
                    width: 95%;
                    top: 72%;
                    left: 2.5%;
                    background: white;
                    border-radius: 8px;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
            </header>
            <div className="absolute top-0 right-0 max-w-[268px] lg:max-w-[428px]">
                <img className="w-full" src={ElementHeader} alt="" />
            </div>
        </>
    );
};
export default Navigation;
