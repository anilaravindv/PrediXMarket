import CustomButton from "components/common/CustomButton";
import {BsArrowRight} from "react-icons/bs";
import Background from 'assets/Hero.png'
import {Link} from "react-router-dom";
import {useWallet} from "@solana/wallet-adapter-react";
import {useWalletModal} from "@solana/wallet-adapter-react-ui";

const LandingPage = () => {
    const {connected} = useWallet();
    const {setVisible} = useWalletModal();

    return (<>
        <div className="h-screen w-full flex justify-center items-center bg-no-repeat bg-cover"
             style={{backgroundImage: `url(${Background})`}}>
            <div className="flex justify-center items-center flex-col space-y-8 pt-10">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-center">Bet on your Opinions</div>
                <div className="text-base font-medium w-3/5 text-center">PredixMarket is a information
                    markets platform, built on Solana.
                </div>
                {
                    <Link to="/markets">
                            <CustomButton
                            title={"Explore Markets"}
                            bgColor={"rgba(119,40,164,0.33)"}
                            bgHover={"rgba(119,40,164,0.44)"}
                            borderRadius={"24px"}
                            endIcon={<BsArrowRight/>}
                            border={"2px solid #000"}
                            textColor={"#1a1515"}
                            padding={"7px 35px"}
                            /></Link>
                }
            </div>
        </div>
        {/*        <div className="bg-black text-white px-36 py-14 w-full space-y-5">
            <div className="font-semibold text-3xl text-center">Popular Markets</div>
            <div className="space-y-2">
                <div className="text-2xl font-semibold py-3">Sport Markets</div>
                <div className="flex justify-between items-center flex-wrap">
                    <MarketCard image={Image1} topic={"Will India get 50 silver medals by the end?"}
                        title={"Sports"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                    <MarketCard image={Image1} topic={"Will India get 50 silver medals by the end?"}
                        title={"Sports"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                    <MarketCard image={Image1} topic={"Will India get 50 silver medals by the end?"}
                        title={"Sports"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="text-2xl font-semibold py-3">Politics Markets</div>
                <div className="flex justify-between items-center flex-wrap">
                    <MarketCard image={Image2} topic={"Will India get 50 silver medals by the end?"}
                        title={"Politics"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                    <MarketCard image={Image2} topic={"Will India get 50 silver medals by the end?"}
                        title={"Politics"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                    <MarketCard image={Image2} topic={"Will India get 50 silver medals by the end?"}
                        title={"Politics"} totalVoulume={42265} yesValue={0.32} noValue={0.68} users={[]} />
                </div>
            </div>
        </div>*/}
    </>)
}
export default LandingPage