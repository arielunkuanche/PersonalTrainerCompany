import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddCustomer(props){
    const [openDialog, setOpenDialog] = useState(false);
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        city: '',
        streetaddress: '',
        postcode: '',
        email: '',
        phone: ''
    });
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    
    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleInputChange = (e)=>{
        setCustomer({...customer, [e.target.name]: e.target.value})
    }
    const handleSaveClick = () =>{
        props.handleSave(customer);
        handleClose();
    }

    return(
        <div>
            <Button variant='contained' size='small' color='secondary' startIcon={<PersonAddAlt1Icon />} sx={{mt:1}}
                    onClick={handleClickOpen}>
            Add new customer
            </Button>
            <Dialog
            open={openDialog}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    console.log(email);
                    handleClose();
                },
            }}
        >
            <DialogTitle>New customer information</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        label="First name"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        label="Last name"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="city"
                        value={customer.city}
                        label="City"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        label="Stress address"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="postcode"
                        value={customer.postcode}
                        label="Postcode"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="email"
                        value={customer.email}
                        label="Email"
                        onChange={e=>handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="phone"
                        value={customer.phone}
                        label="Phone"
                        onChange={e=>handleInputChange(e)}
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