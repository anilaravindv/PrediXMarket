import {Link} from "react-router-dom";
import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import {WalletDisconnectButton, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Logo from 'assets/logo.png'
import Background from 'assets/Hero.png'
import {observer} from "mobx-react-lite";
import {useStores} from "context/StoreComponent";
import {useEffect, useState} from "react";
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiOutlineCloseCircle} from 'react-icons/ai'

interface ICreateMarketLink {
    onClick?: () => void;
}

const CreateMarketLink = observer((Props:ICreateMarketLink) => {
    const {profileStore} = useStores();
    const wallet = useAnchorWallet();

    useEffect(() => {
        profileStore.isAdmin().then(console.log)
    }, [wallet]);

    if (!profileStore.isAdminUser) {
        return null;
    }

    return (
        <Link to="/markets/create" onClick={Props.onClick}>Create Market</Link>
    );
});

const Navigation = () => {
    const {connected} = useWallet();
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <header className="fixed w-screen space-x-14 z-10" style={{
            backgroundImage: `url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}>
            <div className="xl:mx-16 xl:px-16 flex justify-between">
                <Link to="/">
                    <div className="m-2 p-2 flex justify-start items-center">
                        <img src={Logo} alt="logo"/>
                        <div className="font-semibold">Prediction Market</div>
                    </div>
                </Link>
                <div className="hidden lg:flex justify-between items-center m-2 p-2 ">
                    <div className="flex justify-between items-center space-x-9 font-semibold">
                        {
                            connected ? (
                            <>
                                <CreateMarketLink/>
                                <Link to="/markets">Markets</Link>
                                <Link to="/portfolio">Portfolio</Link>
                                <Link to="/leaderboard">Leaderboard</Link>
                            </>
                            ) : null
                        }
                        {
                            connected ? <WalletDisconnectButton/> : <WalletMultiButton/>
                        }
                    </div>
                </div>
                <section className="MOBILE-MENU flex items-center lg:hidden">
                    <GiHamburgerMenu className="w-10 h-10 p-2 pr-3"
                        onClick={() => setIsNavOpen((prev) => !prev)} />
                    <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                        <div className="flex justify-between items-center absolute top-0 right-1 left-0">
                            <Link to="/" onClick={()=> setIsNavOpen(false)}>
                                <div className="m-2 p-2 flex justify-start items-center">
                                    <img src={Logo} alt="logo" />
                                    <div className="font-semibold">Prediction Market</div>
                                </div>
                            </Link>
                            <AiOutlineCloseCircle className="w-10 h-10 p-2"
                                onClick={() => setIsNavOpen(false)} />

                        </div>
                        <div className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] font-semibold">
                            {
                                connected ? (
                                    <>
                                        <CreateMarketLink onClick={() => setIsNavOpen(false)}/>
                                        <Link to="/markets" onClick={() => setIsNavOpen(false)}>Markets</Link>
                                        <Link to="/portfolio" onClick={() => setIsNavOpen(false)}>Portfolio</Link>
                                        <Link to="/leaderboard" onClick={() => setIsNavOpen(false)}>Leaderboard</Link>
                                    </>
                                ) : null
                            }
                            {
                                connected
                                    ? <WalletDisconnectButton onClick={() => setIsNavOpen(false)} />
                                    : <WalletMultiButton onClick={() => setIsNavOpen(false)} />
                            }
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
                    width: 100%;
                    height: 100vh;
                    top: 0;
                    left: 0;
                    background: url(${Background});
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </header>
    );
}
export default Navigation;