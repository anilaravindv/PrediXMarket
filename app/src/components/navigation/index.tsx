import { Link } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Logo from 'assets/logo1.png'
import Background from 'assets/Hero.png'
import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { isAdmin } from "api";

import "assets/bootstrap/css/bootstrap.min.css";
import "assets/fonts/font-awesome/css/font-awesome.min.css";
import "assets/plugin/headerstick/headhesive.css";
import "assets/css/main.css";
import "assets/css/responsive.css";
import "assets/css/jquery.dataTables.css";



interface ICreateMarketLink {
    onClick?: () => void;
}

let isAdminConnected = false;

const CreateMarketLink = observer((Props: ICreateMarketLink) => {
    const { profileStore } = useStores();
    const wallet = useAnchorWallet();

    useEffect(() => {
        profileStore.isAdmin().then(() => { isAdminConnected = true; })
    }, [wallet]);

    if (!profileStore.isAdminUser) {
        return null;
    }

    return (
        <Link to="/markets/create" onClick={Props.onClick}>Create Market</Link>
    );
});

const Navigation = () => {
    const { connected } = useWallet();
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        // <header classNameName="fixed w-screen space-x-14 z-10" style={{
        //     backgroundImage: `url(${Background})`,
        //     backgroundPosition: 'center',
        //     backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
        //     backgroundAttachment: 'fixed'
        // }}>
        //     <div classNameName="xl:mx-16 xl:px-16 flex justify-between">
        //         <Link to="/">
        //             <div classNameName="m-2 p-2 flex justify-start items-center">
        //                 <img src={Logo} alt="logo" style={{ width: "40%" }} />
        //                 {/* <div classNameName="font-semibold">Prediction Market</div> */}
        //             </div>
        //         </Link>
        //         <div classNameName="hidden lg:flex justify-between items-center m-2 p-2 ">
        //             <div classNameName="flex justify-between items-center space-x-9 font-semibold">
        //                 {
        //                     connected ? (
        //                         <>
        //                             <CreateMarketLink />
        //                             <Link to="/markets">Markets</Link>
        //                             {<>
        //                                 <Link to="/portfolio">Portfolio</Link>
        //                                 <Link to="/leaderboard">Leaderboard</Link>
        //                             </>}
        //                             <span>Portfolio</span>
        //                             <span>Leaderboard</span>
        //                         </>
        //                     ) : <Link to="/markets">Markets</Link>
        //                 }
        //                 {
        //                     connected ? <WalletDisconnectButton /> : <WalletMultiButton />
        //                 }
        //             </div>
        //         </div>
        //         <section classNameName="MOBILE-MENU flex items-center lg:hidden">
        //             <GiHamburgerMenu classNameName="w-10 h-10 p-2 pr-3"
        //                 onClick={() => setIsNavOpen((prev) => !prev)} />
        //             <div classNameName={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
        //                 <div classNameName="flex justify-between items-center absolute top-0 right-1 left-0">
        //                     <Link to="/" onClick={() => setIsNavOpen(false)}>
        //                         <div classNameName="m-2 p-2 flex justify-start items-center">
        //                             <img src={Logo} alt="logo" />
        //                             <div classNameName="font-semibold">Prediction Market</div>
        //                         </div>
        //                     </Link>
        //                     <AiOutlineCloseCircle classNameName="w-10 h-10 p-2"
        //                         onClick={() => setIsNavOpen(false)} />

        //                 </div>
        //                 <div classNameName="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] font-semibold">
        //                     {
        //                         connected ? (
        //                             <>
        //                                 <CreateMarketLink onClick={() => setIsNavOpen(false)} />
        //                                 <Link to="/markets" onClick={() => setIsNavOpen(false)}>Markets</Link>
        //                                 {/* {<>
        //                                 <Link to="/portfolio" onClick={() => setIsNavOpen(false)}>Portfolio</Link>
        //                                 <Link to="/leaderboard" onClick={() => setIsNavOpen(false)}>Leaderboard</Link>
        //                                 </>} */}
        //                                 <span>Portfolio</span>
        //                                 <span>Leaderboard</span>
        //                             </>
        //                         ) : <Link to="/markets">Markets</Link>
        //                     }
        //                     {
        //                         connected
        //                             ? <WalletDisconnectButton onClick={() => setIsNavOpen(false)} />
        //                             : <WalletMultiButton onClick={() => setIsNavOpen(false)} />
        //                     }
        //                 </div>
        //             </div>
        //         </section>
        //     </div>
        //     <style>{`
        //         .hideMenuNav {
        //              display: none;
        //         }
        //         .showMenuNav {
        //             display: block;
        //             position: absolute;
        //             width: 100%;
        //             height: 100vh;
        //             top: 0;
        //             left: 0;
        //             background: url(${Background});
        //             z-index: 10;
        //             display: flex;
        //             flex-direction: column;
        //             justify-content: center;
        //             align-items: center;
        //         }
        //     `}</style>
        // </header>

        <header>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                  <a className="navbar-brand" href="home.html"><img src="assets/images/logo.png" alt="" /></a>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                      <i className="fa fa-bars" aria-hidden="true"></i>
                    </span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarScroll">
                    {
                      connected ? (
                        <>
                          <ul className="navbar-nav m-auto my-2 my-lg-0">
                            <CreateMarketLink />
                            <li className="nav-item">
                              <Link className="nav-link" to="/markets">Markets</Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link" to="/portfolio">Portfolio</Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                            </li>
                          </ul>
                        </>
                      ) : <Link to="/markets">Markets</Link>
                    }
                    <div className="d-flex">
                      <button className="btn btn-connect" type="submit">Disconnect <i className="fa fa-angle-right" aria-hidden="true"></i></button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    );
}
export default Navigation;