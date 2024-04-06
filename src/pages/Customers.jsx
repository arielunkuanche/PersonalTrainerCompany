import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export default function Customers(){
    const [customers, setCustomers] = useState([]);
    const gridRef = useRef();
    const gridApiRef = useRef();
    const [colDefs] = useState([
        {headerName: 'Actions', 
        children: [
            {
                cellRenderer: params => 
                <Tooltip title='Add new training'>
                    <AddToPhotosIcon size='small' color="primary" 
                        onClick={() => deleteCustomer(params.data._embedded.customers._links.self.href)} />
                </Tooltip>,
                width: 50,
            },
            {
                cellRenderer: params => 
                <Tooltip title='Edit customer'>
                    <EditIcon size='small' color="primary" 
                        onClick={() => deleteCustomer(params.data._embedded.customers._links.self.href)} />
                </Tooltip>,
                width: 50,
            },
            {
                cellRenderer: params => 
                <Tooltip title='Delete customer'>
                    <DeleteIcon size='small' color="error" 
                        onClick={() => deleteCustomer(params.data._embedded.customers._links.self.href)} />
                </Tooltip>,
                width: 50,
            },
            
        ]},
        {headerName: 'First name',field: 'firstname',filter: true},
        {headerName: 'Last name',field: 'lastname',filter: true},
        {headerName: 'Stress address',field: 'streetaddress',filter: true},
        {headerName: 'Postcode',field: 'postcode',filter: true},
        {headerName: 'City',field: 'city',filter: true},
        {headerName: 'Email',field: 'email',filter: true},
        {headerName: 'Phone',field: 'phone',filter: true}
    ]);

    const Search = styled('div')(({ theme }) => ({
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
            },
        }));
    const SearchIconWrapper = styled('div')(({ theme }) => ({
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }));
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
            color: 'inherit',
            '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
            },
        }));
    const handleExport = () =>{
        gridApiRef.current.exportDataAsCsv();
    };
    useEffect(() => 
        fetchCustomers(), []);

    const fetchCustomers = () => {
        fetch(import.meta.env.VITE_API_CUSTOMERS)
        .then (response => {
            if (!response.ok)
                throw new Error(response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('rowData: ', data._embedded.customers);
            const filteredCustomers = data._embedded.customers.filter(customer => customer.firstname !== null);
            // console.log('filter:', filteredCustomers);
            setCustomers(filteredCustomers);
        })
        .catch(error => console.error(error))
    };

    return(
        <>
            <Box>
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            </Box>
            <div className="ag-theme-material" style={{width: 1500,height: 500}}>
                <AgGridReact
                    ref={gridRef}
                    onGridReady={ params => { 
                        gridRef.current = params.api; 
                        gridApiRef.current = params.api}
                    }
                    rowData={customers}
                    columnDefs={colDefs}
                    pagination= {true}
                    paginationPageSizeSelector= {false}
                    paginationPageSize={6}
                />
                <Button variant='contained' size='small' color='secondary' startIcon={<DownloadIcon />} 
                        sx={{mt:1} } onClick={() =>handleExport()}>Download file</Button>
            </div>
        </>
    )
    
}