import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';


export default function Trainings(){
    const [trainings, setTrainings] = useState([]);
    const gridRef = useRef();
    const gridApiRef = useRef();
    const [colDefs] = useState([
        {headerName: 'Action', flex: 1,
        children: [
            {
                cellRenderer: params => 
                <Tooltip title='Delete training'>
                    <DeleteIcon size='small' color="error" 
                        onClick={() => deleteCustomer(params.data._embedded.customers._links.self.href)} />
                </Tooltip>,
                width: 50,
            },
            
        ]},
        {headerName: 'Date',field: 'date',flex: 1,filter: true,
            valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration',field: 'duration',flex: 1,filter: true},
        {headerName: 'Activity',field: 'activity',flex: 1,filter: true},
        {headerName: 'Customer',field: 'customerName',flex: 1,filter: true,
            
    },

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
                console.error('Error fetching data:', error);
            }
        }
        
        fetchData();
    }, []);

    const fetchTrainings = async () => {
        const response = await fetch(import.meta.env.VITE_API_TRAININGS);
        if (!response.ok) {
            throw new Error('Failed to fetch trainings' + response.sta);
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

    
    



    return(
        <>
            <h3>Trainings</h3>
            <div className="ag-theme-material" style={{width: 1500,height: 500}}>
                <AgGridReact
                    ref={gridRef}
                    onGridReady={ params => { 
                        gridRef.current = params.api; 
                        gridApiRef.current = params.api}
                    }
                    rowData={trainings}
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