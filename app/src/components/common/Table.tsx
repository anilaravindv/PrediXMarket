import {DataGrid} from '@mui/x-data-grid';
import {RiArrowUpDownFill} from 'react-icons/ri'
import {useState} from "react";

export function SortedDescendingIcon() {
    return <RiArrowUpDownFill/>;
}


export default function Table({rows, columns, height, defaultPageSize}) {
    const [pageSize, setPageSize] = useState(defaultPageSize || 5);

    return (
        <div className="w-full" style={{height: height, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                disableColumnMenu
                components={{
                    ColumnSortedDescendingIcon: SortedDescendingIcon,
                    ColumnSortedAscendingIcon: SortedDescendingIcon,
                }}
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: '#101010',
                    color: "#ffffff",
                    ":hover": {
                        color: "#ffffff",
                    },
                    '& .MuiDataGrid-cell:hover': {
                        color: '#',
                    },
                    '& .MuiTablePagination-root': {
                        color: '#fff',
                    },
                    '& .MuiIconButton-root': {
                        color: '#fff',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none'
                    },
                    '& .MuiDataGrid-footerContainer': {
                        display: 'block',
                        borderTop: 'none'
                    },
                    '& .MuiDataGrid-selectedRowCount': {
                        display: 'none'
                    },
                    '& .Mui-disabled': {
                        color: "#ffffff !important"
                    },
                    '& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                        outline: 'none !important'
                    },
                    '& div div div div >.MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: "none"
                    }
                }}
            />
        </div>
    );
}
