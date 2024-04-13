import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Stack } from '@mui/material';
import AddCustomer from "../components/AddCustomer";
import EditCustomer from "../components/EditCustomer";
import AddNewTraining from "../components/AddNewTraining";


export default function Customers(){
    const [customers, setCustomers] = useState([]);
    const [deleteSnackBarOpen, setDeleteSnackBarOpen] = useState(false);
    const [addNewTrainingSnackBarOpen, setAddNewTrainingSnackBarOpen] = useState(false);
    const gridRef = useRef();
    const gridApiRef = useRef();
    const [colDefs] = useState([
        {headerName: 'Actions', maxWidth: 250,
        children: [
            {field: 'Add', minWidth:80,  width: 50,
                cellRenderer: params => <AddNewTraining data={params.data} handleAddTraining={addTraining}></AddNewTraining>
            },
            {field: 'Edit', minWidth:80,width: 50,
                cellRenderer: params => <EditCustomer data={params.data} editCustomer={updateCustomer}></EditCustomer>
            },
            {field: 'Delete', minWidth:90, width: 50,
                cellRenderer: params => 
                <Tooltip title='Delete customer'>
                    <DeleteIcon size='small' color="black" 
                        onClick={() => deleteCustomer(params.data._links.customer.href)} />
                </Tooltip>
            },
            
        ]},
        {headerName: 'First name',field: 'firstname',filter: true, flex: 1},
        {headerName: 'Last name',field: 'lastname',filter: true,flex: 1},
        {headerName: 'City',field: 'city',filter: true,flex: 1},
        {headerName: 'Street address',field: 'streetaddress',filter: true,flex: 1},
        {headerName: 'Postcode',field: 'postcode',filter: true,flex: 1},
        {headerName: 'Email',field: 'email',filter: true,flex: 1},
        {headerName: 'Phone',field: 'phone',filter: true,flex: 1}
    ]);

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
    const deleteCustomer = (link) =>{
        if(window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(response => fetchCustomers())
            .catch(err => console.error(err))
        setDeleteSnackBarOpen(true);
        }
    };
    const handleDeleteSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDeleteSnackBarOpen(false);
    };
    const handleSaveCustomer = (newCustomer)=>{
        fetch(import.meta.env.VITE_API_CUSTOMERS, {
            method: 'POST',
            headers: { 'content-type' : 'application/json' },
            body: JSON.stringify(newCustomer)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when adding a customer");
            return response.json();
        })
        .then(data => fetchCustomers())
        .catch(error => console.error(error))
    }
    const addTraining= (newTraining) => {
        fetch(import.meta.env.VITE_API_TRAININGS, {
            method: 'POST',
            headers: { 'content-type' : 'application/json' },
            body: JSON.stringify(newTraining)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when adding a training");
        
            return response.json();
        })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
        setAddNewTrainingSnackBarOpen(true);
    }
    const handleAddNewTrainingSnackClose = (event, reason) =>{
        if (reason === 'clickaway') {
            return;
        }
        setAddNewTrainingSnackBarOpen(false);
    }
    const updateCustomer = (url, updatedCustomer) => { 
        fetch(url, {
            method: 'PUT',
            headers: { 'content-type' : 'application/json' },
            body: JSON.stringify(updatedCustomer)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when updating customer");
            return response.json();
        })
        .then(data => fetchCustomers(data))
        .catch(err => console.error(err))
    }


    return(
        <div className="flex justify-center items-center">
            <h1>Customers</h1>
            <Stack direction='row' margin={1} spacing={2} justifyContent='center'>
                <AddCustomer handleSave={handleSaveCustomer} />
                <Button variant='contained' size='small' color='secondary' startIcon={<DownloadIcon />} sx={{mt:1} } 
                        onClick={() =>handleExport()}>Download file</Button>
            </Stack>
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
            </div>
            <Snackbar
                open={deleteSnackBarOpen}
                autoHideDuration={6000}
                onClose={handleDeleteSnackClose}
                message="Customer deleted!"
            />
            <Snackbar
                open={addNewTrainingSnackBarOpen}
                autoHideDuration={6000}
                onClose={handleAddNewTrainingSnackClose}
                message="New training added!"
            />
        </div>
    )
    
}