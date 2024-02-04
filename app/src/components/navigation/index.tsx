import { Link } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Logo from 'assets/logo.png'
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
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
<div className="app">
      <nav>
        <div className="max-b-7xl mx-auto bg-orange-70">
          <div className="flex mx-auto justify-between w-5/6 ">
            {/* Primary menu and logo */}
            <div className="flex items-center gap-16 my-12">
              {/* logo */}
              <div>
                <a
                  href="/"
                  className="flex gap-1 font-bold text-gray-700 items-center "
                >
                  <img src={Logo} alt="logo" className="h-10 w-10 text-primary" />

                  <span>PredixMarket</span>
                </a>
              </div>
              {/* primary */}
              <div className="hidden lg:flex gap-12 ">
                  {
                    connected ? (
                      <>
                        <CreateMarketLink />
                        <Link to="/markets">Markets</Link>
                        {/* {<>
                                        <Link to="/portfolio">Portfolio</Link>
                                        <Link to="/leaderboard">Leaderboard</Link>
                                    </>} */}
                        <span>Portfolio</span>
                        <span>Leaderboard</span>
                      </>
                    ) : <Link to="/markets">Markets</Link>
                  }
                  {
                    connected ? <WalletDisconnectButton /> : <WalletMultiButton />
                  }
              </div>
            </div>
            {/* secondary */}
            <div className="flex gap-6">
              <div className="hidden xs:flex items-center gap-10">
                <div className="hidden lg:flex items-center gap-2">
                  {/* <MoonIcon className="h-6 w-6" /> */}
                  {/* <SunIcon className="h-6 w-6" /> */}
                </div>
                <div>
                  <button className="rounded-full border-solid border-2 border-gray-300 py-2 px-4 hover:bg-gray-700 hover:text-gray-100">
                    Free Trial
                  </button>
                </div>
              </div>
              {/* Mobile navigation toggle */}
              <div className="lg:hidden flex items-center">
                <button onClick={() => setToggleMenu(!toggleMenu)}>
                  <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                  </button>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* mobile navigation */}
        <div
          className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-700 ${
            !toggleMenu ? "h-0" : "h-full"
          }`}
        >
          <div className="px-8">
            <div className="flex flex-col gap-8 tracking-wider">
              {
                    connected ? (
                      <>
                        <CreateMarketLink />
                        <Link to="/markets">Markets</Link>
                        <span>Portfolio</span>
                        <span>Leaderboard</span>
                      </>
                    ) : <Link to="/markets">Markets</Link>
                  }
                  {
                    connected ? <WalletDisconnectButton /> : <WalletMultiButton />
                  }
            </div>
          </div>
        </div>
      </nav>
    </div>
    );
}
export default Navigation;