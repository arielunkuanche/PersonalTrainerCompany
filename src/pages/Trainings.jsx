import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';


export default function Trainings(){
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const gridRef = useRef();
    const gridApiRef = useRef();
    const defaultColDef ={
        flex: 2,
        sortable: true,
        filter:true,
        resizable: true,
    };
    const [colDefs] = useState([
        {headerName: 'Action', maxWidth:120,
            cellRenderer: params => 
                <Tooltip title='Delete training'>
                    <DeleteIcon size='small' color="black" 
                        onClick={() => deleteTraining(params.data._links.self.href)} />
                </Tooltip>,
                width: 50,
            },
        {headerName: 'Date',field: 'date',
            valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Customer',field: 'customerName'},
        {headerName: 'Duration in minutes',field: 'duration'},
        {headerName: 'Activity',field: 'activity'},
    ]);
    const handleExport = () =>{
        gridApiRef.current.exportDataAsCsv();
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const trainingData = await fetchTrainings();
                const updatedTrainingData = await fetchCustomerNames(trainingData);
                setTrainings(updatedTrainingData);
            } catch (error) {
                console.error('Error fetching training data:', error);
            }
        }
        fetchData();
    }, []);

    const fetchTrainings = async () => {
        const response = await fetch(import.meta.env.VITE_API_TRAININGS);
        if (!response.ok) {
            throw new Error('Failed to fetch trainings' + response.statusText);
        }
        const data = await response.json();
        console.log('Trainings data:', data._embedded.trainings);
        return data._embedded.trainings;
    };

    const fetchCustomerNames = async (trainingData) => {
        const updatedTrainingData = [];
        for (const training of trainingData) {
            const customerName = await getCustomerName(training._links.customer.href);
            training.customerName = customerName;
            updatedTrainingData.push(training);
        }
        return updatedTrainingData;
    };

    const getCustomerName = async (customerLink) => {
        try {
            const response = await fetch(customerLink);
            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }
            const customerData = await response.json();
            console.log('customerData', customerData);
            return `${customerData.firstname} ${customerData.lastname}`;
        } catch (error) {
            console.error('Error fetching customer details:', error);
            return 'Error fetching customer details.'; 
        }
    };
    const deleteTraining = (link) =>{
        console.log(link);
        if(window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in training deletion: " + response.statusText);
                return response.json();
            })
            .then(data => fetchData(data))
            .catch(err => console.error(err))
            setOpen(true);
        }
    };
    const handleDeleteSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    

    return(
        <>
            <h1>Trainings</h1>
            <Button variant='contained' size='small' color='secondary' startIcon={<DownloadIcon />} 
                        sx={{mt:1} } onClick={() =>handleExport()}>Download file</Button>
            <div className="ag-theme-material" style={{width: 1500,height: 500}}>
                <AgGridReact
                    ref={gridRef}
                    onGridReady={ params => { 
                        gridRef.current = params.api; 
                        gridApiRef.current = params.api}
                    }
                    rowData={trainings}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination= {true}
                    paginationPageSizeSelector= {false}
                    paginationPageSize={6}
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleDeleteSnackClose}
                message="Training deleted!"
            />
        </>
    )
}