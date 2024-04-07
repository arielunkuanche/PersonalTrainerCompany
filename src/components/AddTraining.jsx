import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';



export default function AddTraining({ handleCustomerLink, handleOpen, handleClose, handleSave }){
    const [training, setTraining] = useState({
        activity: '',
        date: null,
        duration: '',
    });
    const handleSaveClick = () =>{
        const newTraining = {...training, handleCustomerLink};
        handleSave(newTraining);
        handleClose();
    }

    return(
        <div>
            <Dialog
            open={handleOpen}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    console.log(email);
                    props.handleClose();
                },
            }}
        >
            <DialogTitle>New training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        label="Activity"
                        onChange={e=>setTraining({...training, activity: e.target.value})}
                        fullWidth
                        variant="standard"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker  
                            required
                            margin="dense"
                            name="date"
                            value={training.date}
                            label="Date"
                            format='DD.MM.YYYY HH:mm'
                            onChange={(date)=>setTraining({...training, date})}
                            fullWidth
                            variant="standard"  />
                    </LocalizationProvider>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        label="Duration(minutes)"
                        onChange={e=>setTraining({...training, duration: e.target.value})}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSaveClick}>Save</Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}