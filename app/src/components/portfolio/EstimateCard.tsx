import Table from 'components/common/Table'
import {AiOutlineEye} from 'react-icons/ai'
import CustomButton from '../common/CustomButton'
import DonutChart from '../common/DonutChart'
import {GridColDef} from "@mui/x-data-grid";


const columns: GridColDef[] = [
    {
        field: 'name', headerName: 'Name', width: 150, renderCell: (params) => (
            <div className='flex justify-start font-semibold text-sm space-x-2'>
                <div>{params.value.title}</div>
                <div className='text-zinc-500'>{params.value.desc}</div>
            </div>
        )
    },
    {
        field: 'amount', headerName: 'Amount/Est. Value', width: 150, renderCell: (params) => (
            <div>
                <div className='font-normal text-sm'>{params.value.amount}</div>
                <div className='font-light text-xs text-zinc-500'>{params.value.equalto}</div>
            </div>
        )
    },
    {field: 'price', headerName: 'Price', width: 150,},
    {
        field: 'change24', headerName: '24H Change', width: 150, renderCell: (params) => (
            <div
                className={`font-medium text-sm ${params.value > 0 ? 'text-green-400' : 'text-red-400'}`}>{(params.value > 0 && "+") + (params.value) + "%"}</div>
        )
    },
    {
        field: "", width: 100,
        sortable: false,
        renderCell: () => (
            <CustomButton title={"Trade"} bgColor={"#101010"} bgHover={"#101010"} border={"1px solid #FEE5B9"}
                          borderRadius={"44px"} padding={'0px 10px'}/>
        )
    },
];

const rows = [
    {
        id: 1,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$9.87',
        change24: 1.87,
    },
    {
        id: 2,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$9.07',
        change24: 1.87,
    },
    {
        id: 3,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$9.17',
        change24: -1.87,
    },
    {
        id: 4,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$2.87',
        change24: 1.87,
    },
    {
        id: 5,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
    {
        id: 6,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
    {
        id: 7,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
    {
        id: 8,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
    {
        id: 9,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
    {
        id: 10,
        name: {title: "ICP", desc: "Internet Ca..."},
        amount: {amount: '6.786635', equalto: "=12.54"},
        price: '$0.87',
        change24: 1.87,
    },
];

const EstimateCard = () => {
    return (
        <div className='w-2/3 border-amber-200 border-2 rounded-xl p-4 px-6 space-y-4'>
            <div className='flex justify-between items-center '>
                <div className='flex justify-start items-center space-x-4'>
                    <div className='text-lg font-semibold'>My Shares</div>
                    <AiOutlineEye className='text-2xl text-zinc-500 text-center'/>
                </div>
                <div className='flex justify-between items-center space-x-5 bg-black p-1'>
                    <CustomButton title={"Deposit"} bgColor={"#F9A13D"} bgHover={"#F9A13D"}
                                  borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 35px"}/>
                    <CustomButton title={"Withdraw"} bgColor={"#101010"} bgHover={"#101010"}
                                  borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 35px"}/>
                    <CustomButton title={"Buy Crypto"} bgColor={"#101010"} bgHover={"#101010"}
                                  borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 35px"}/>
                </div>
            </div>

            <div className='text-3xl font-semibold'>2.637453 BTC
                <span className='text-zinc-500'> = 56665.41 SOL</span>
            </div>

            <div className='flex items-center justify-start'>
                <DonutChart/>
            </div>

            <div className='text-lg font-semibold'>Markets</div>
            <div className='flex justify-start items-center space-x-5 bg-black p-1'>
                <CustomButton title={"Spot Holdings"} bgColor={"#F9A13D"} bgHover={"#F9A13D"}
                              borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 25px"}
                              border={'1px solid #828282'}/>
                <CustomButton title={"🔥 Hot"} bgColor={"#101010"} bgHover={"#101010"}
                              borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 25px"}
                              border={'1px solid #828282'}/>
                <CustomButton title={"Favorite"} bgColor={"#101010"} bgHover={"#101010"}
                              borderRadius={"4px"} textColor={"#FEFEFE"} padding={"5px 25px"}
                              border={'1px solid #828282'}/>
            </div>
            <div>
                <Table rows={rows} columns={columns} height={400} defaultPageSize={10}/>
            </div>
        </div>
    )
}

export default EstimateCard