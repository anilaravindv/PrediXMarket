import Table from 'components/common/Table'
import {GridColDef, GridColumnHeaderParams} from "@mui/x-data-grid";
import TableButton from "./TableButton";

const columns: GridColDef[] = [
    {
        field: 'wallet', headerName: 'Wallet', minWidth: 150, maxWidth: 270, sortable: false,
        renderHeader: (params: GridColumnHeaderParams) => {
            return(
                <strong>
                {'Wallet '}
              </strong>
            )
          },
        renderCell: (params) => {
            return (
                <div className={'flex justify-start font-semibold text-sm space-x-2 text-black-500'}>
                    {params.value}
                </div>
            );
        }
    },
    {
        field: 'action', headerName: 'Action', minWidth: 220, maxWidth: 270, sortable: false,
        renderHeader: (params: GridColumnHeaderParams) => {
            return(
                <strong>
                {'Action '}
              </strong>
            )
          },
        renderCell: (params) => (
            <div className='font-normal text-sm text-left w-full sm:pr-8'>
                <p>{params.value}</p>
            </div>
        )
    },
    {
        field: 'txnid', headerName: 'Transaction ID', minWidth: 290, maxWidth: 320, sortable: false,
        renderHeader: (params: GridColumnHeaderParams) => {
            return(
                <strong>
                {'Transaction ID '}
              </strong>
            )
          },
        renderCell: (params) => (
            <div className='font-normal text-sm text-right w-full sm:pr-12'>
                <span className="font-semibold text-right">{params.value}</span>&nbsp;
            </div>
        )
    }
];

const StatsCard = ({rows, type, onTypeChange}) => {

    return (
        <div className='w-full p-4 px-6 space-y-4'>
            <div className='flex flex-wrap gap-4 '>
                <TableButton title={"Price Chart"} type="pc" selectedType={type} onClick={onTypeChange}/>
                <TableButton title={"Recent Activity"} type="ra" selectedType={type} onClick={onTypeChange}/>
            </div>
            <div>
                <Table rows={rows} columns={columns} height={400} defaultPageSize={5}/>
            </div>
        </div>
    )
}

export default StatsCard