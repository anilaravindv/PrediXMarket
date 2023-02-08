import {useStores} from "context/StoreComponent";
import {DateTime} from "luxon";
import {useNavigate} from "react-router-dom";
import CreateMarketForm from "components/create-market/CreateMarketForm";

const feePercentage = import.meta.env.VITE_MARKET_FEE_PERCENTAGE as number;

const CreateMarketPage = () => {
    const {marketStore} = useStores();
    const navigate = useNavigate();

    const expiresAt = DateTime.now().plus({years: 1});

    const initialValues = {
        name: '',
        about: '',
        category: '',
        imageUrl: '',
        feePercentage,
        resolutionSource: '',
        resolver: 'admin',
        expiresAt: expiresAt.toJSDate(),
        expectedValue: '',
        resolutionOperator: '',
        initialLiquidity: 0.01,
        bias: 0,
    };

    function onSubmit(values) {
        marketStore
            .createMarket(values)
            .then((marketId) => {
                alert("Market created successfully");
                navigate(`/markets/${marketId}`, {replace: true});
            })
            .catch(e => {
                alert("An error occurred while creating the market");
                console.error(e);
            });
    }

    return (
        <div className="h-auto w-full flex justify-center px-5 items-center bg-black text-white pt-28">
            <div className="m-2 p-4 border-2 border-amber-100 rounded-2xl w-full md:w-1/2">
                <div className="grid grid-cols-1 gap-6 ">
                    <div className='font-semibold text-2xl'>
                        Create market
                    </div>
                    <CreateMarketForm initialValues={initialValues} onSubmit={onSubmit}/>
                </div>
            </div>
        </div>
    );
};

export default CreateMarketPage;
