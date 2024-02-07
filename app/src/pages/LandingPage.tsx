import CustomButton from "components/common/CustomButton";
import { BsArrowRight } from "react-icons/bs";
import Background from "assets/images/bg.png";
import BannerImg from "assets/images/banner_01.png";
import ElementFooter from "assets/images/element_02.png";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {Route, Routes} from "react-router-dom";
import MarketsPage from "pages/MarketsPage";
import CreateMarketPage from "pages/CreateMarketPage";
import RequireAuth from "components/auth/RequireAuth";



const LandingPage = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();

    return (
        <>
            <div
                className="h-screen w-full flex justify-center bg-no-repeat bg-white bg-cover"
                style={{ backgroundImage: `url(${Background})` }}
            >
                <div className="grid pt-[270px] max-md:pt-[150px] max-md:pb-[150px] grid-cols-12 w-full container max-md:gap-y-6 px-4">
                    <div className="col-span-6 max-md:col-span-12 max-md:text-center">
                        <div className="text-light-black pt-6">
                            <h1 className="text-3xl md:text-5xl xl:text-7xl font-bold mb-5">Bet on your Opinions</h1>
                            <p className="text-lg max-md:text-base mb-10">
                                PredixMarket is a information markets platform, built on Solana.
                            </p>
                            <Link
                                            className="btn bg-sky-blue text-white uppercase text-lg font-normal py-3 px-5 rounded"
                                            to="/markets"
                                        >
                                            Explore Markets
                            </Link>
                            {/* <RequireAuth>
                                <Link
                                            className="btn bg-sky-blue text-white uppercase text-lg font-normal py-3 px-5 rounded"
                                            to="/markets/create"
                                        >
                                           Create Market
                                </Link>
                            </RequireAuth> */}
                        </div>
                    </div>
                    <div className="col-span-6 max-md:col-span-12 max-md:text-center">
                        <div className="text-center">
                            <img
                                className="w-full h-full max-w-[300px] md:max-w-[605px] md:max-h-[640px] sm:max-w-[360px] mx-auto"
                                src={BannerImg}
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 max-w-[180px]">
                    <img className="w-full" src={ElementFooter} alt="" />
                </div>
                {/* <div className="flex justify-center items-center flex-col space-y-8 pt-10">
                    <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-center">Bet on your Opinions</div>
                    <div className="text-base font-medium w-3/5 text-center">
                        PerpCrypto is a information markets platform, built on Solana.
                    </div>
                    {connected ? (
                        <Link to="/markets">
                            <CustomButton
                                title={"Explore Markets"}
                                bgColor={"transparent"}
                                bgHover={"transparent"}
                                borderRadius={"24px"}
                                endIcon={<BsArrowRight />}
                                border={"2px solid #000"}
                                textColor={"#000000"}
                                padding={"7px 35px"}
                            />
                        </Link>
                    ) : (
                        <CustomButton
                            title={"Connect Your Wallet To Explore Markets..."}
                            bgColor={"rgba(119,40,164,0.33)"}
                            bgHover={"rgba(119,40,164,0.44)"}
                            borderRadius={"24px"}
                            endIcon={<BsArrowRight />}
                            border={"2px solid #000"}
                            textColor={"#1a1515"}
                            padding={"7px 35px"}
                            onClick={() => setVisible(true)}
                        />
                    )}
                </div> */}
            </div>
        </>
    );
};
export default LandingPage;
