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
                        onClick={() => deleteTraining(`${import.meta.env.VITE_API_TRAININGS}/${params.data.id}` )} />
                </Tooltip>,
                width: 50,
                cellStyle: {textAlign: 'left'}
            },
        {headerName: 'Date',field: 'date',
            valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm'), cellStyle: {textAlign: 'left'}},
        {headerName: 'Customer',field: 'customerName', cellStyle: {textAlign: 'left'}},
        {headerName: 'Duration in minutes',field: 'duration', cellStyle: {textAlign: 'left'}},
        {headerName: 'Activity',field: 'activity', cellStyle: {textAlign: 'left'}},
    ]);
    const handleExport = () =>{
        gridApiRef.current.exportDataAsCsv();
    };

    useEffect(() => fetchTrainings(), [])

    const fetchTrainings = () =>{
        fetch(import.meta.env.VITE_API_TRAININGSANDCUSTOMERS)
        .then(response => {
            console.log(response)
            if (!response.ok)
                throw new Error(response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('TrainingData: ', data);
            const formattedData = data.map(training => ({
                ...training,
                customerName: `${training.customer.firstname} ${training.customer.lastname}`
            }))
            console.log('formattedData: ', formattedData)
            setTrainings(formattedData)
        }) 
        .catch(error => console.error(error)) 
    }
    const deleteTraining = (link) =>{
        console.log('delete link', link);
        if(window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in training deletion: " + response.statusText);
                return response.json();
            })
            .then(data => fetchTrainings(data))
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

    return (
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