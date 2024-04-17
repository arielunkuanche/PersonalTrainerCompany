import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Stack, TextField } from '@mui/material';
import AddCustomer from "../components/AddCustomer";
import EditCustomer from "../components/EditCustomer";
import AddNewTraining from "../components/AddNewTraining";


export default function Customers(){
    const [customers, setCustomers] = useState([]);
    const [deleteSnackBarOpen, setDeleteSnackBarOpen] = useState(false);
    const [addNewTrainingSnackBarOpen, setAddNewTrainingSnackBarOpen] = useState(false);
    const gridRef = useRef();
    const gridApiRef = useRef();
    const [colDefs, setColDefs] = useState([
        {headerName: 'Actions', maxWidth: 250,
        children: [
            {field: 'Add',  width: 80,
                cellRenderer: params => <AddNewTraining data={params.data} handleAddTraining={addTraining}></AddNewTraining>
            },
            {field: 'Edit', width: 80,
                cellRenderer: params => <EditCustomer data={params.data} editCustomer={updateCustomer}></EditCustomer>
            },
            {field: 'Delete', width: 90,
                cellRenderer: params => 
                <Tooltip title='Delete customer'>
                    <DeleteIcon size='small' color="black" 
                        onClick={() => deleteCustomer(params.data._links.customer.href)} />
                </Tooltip>
            },
            
        ], cellStyle: {textAlign: 'left'}},
        {headerName: 'First name',field: 'firstname',filter: true,sortable: true,width: 130,cellStyle: {textAlign: 'left'}},
        {headerName: 'Last name',field: 'lastname',filter: true,sortable: true,width: 130,cellStyle: {textAlign: 'left'}},
        {headerName: 'City',field: 'city',filter: true,sortable: true,width: 130,cellStyle: {textAlign: 'left'}},
        {headerName: 'Street address',field: 'streetaddress',filter: true,sortable: true,width: 200,cellStyle: {textAlign: 'left'}},
        {headerName: 'Postcode',field: 'postcode',filter: true,sortable: true,width: 130,cellStyle: {textAlign: 'left'}},
        {headerName: 'Email',field: 'email',filter: true,sortable: true,width: 180,cellStyle: {textAlign: 'left'}},
        {headerName: 'Phone',field: 'phone',filter: true,sortable: true,width: 140,cellStyle: {textAlign: 'left'}}
    ]);

    const handleExport = () =>{
        gridApiRef.current.exportDataAsCsv();
    };

    const onFilterTextBoxChanged = (event) => {
        const filterText = event.target.value;
        gridApiRef.current.setQuickFilter(filterText);
    };

    useEffect(() => 
        fetchCustomers(), []);

    const fetchCustomers = () => {
        fetch(import.meta.env.VITE_API_CUSTOMERS)
        .then (response => {
            console.log('customer:', response)
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
        console.log('customer delete link:', link)
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
        <div className="flex justify-center items-center"  style={{ width: '100%' }}>
            <h1>Customers</h1>
            <Stack direction='row' margin={1} spacing={2} justifyContent='center'>
                <AddCustomer handleSave={handleSaveCustomer} />
                <Button variant='contained' size='small' color='secondary' startIcon={<DownloadIcon />} sx={{mt:1} } 
                        onClick={() =>handleExport()}>Download file</Button>
            </Stack>
            <div className="example-header" style={{ textAlign: 'left',marginTop: '3rem', height:70 }}>
                <TextField 
                    type="text" 
                    id="filter-text-box" 
                    placeholder="Filter..." 
                    onChange={onFilterTextBoxChanged}
                    style={{ 
                        width: '200px', 
                        height: '20px', 
                        fontSize: '16px' 
                    }}
                />
            </div>
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