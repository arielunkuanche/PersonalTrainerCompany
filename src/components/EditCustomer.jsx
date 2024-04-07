import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';


export default function EditCustomer ({data, editCustomer}){
    const [open, setOpen] = useState(false);
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
        setOpen(true);
        console.log(data);
        setCustomer({
            firstname: data.firstname,
            lastname: data.lastname,
            city: data.city,
            streetaddress: data.streetaddress,
            postcode: data.postcode,
            email: data.email,
            phone: data.phone
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveClick = () => {
        editCustomer(data._links.self.href, customer);
        handleClose();
    }

    return (
        <>
            <Tooltip title='Edit customer'>
                <EditIcon size='small' color="black" onClick={handleClickOpen} />
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Update Customer</DialogTitle>
                <DialogContent>
                <TextField
                    margin="dense"
                    name="firstname"
                    value={customer.firstname}
                    label="First name"
                    onChange={e => setCustomer({...customer, firstname: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="lastname"
                    value={customer.lastname}
                    label="Last name"
                    onChange={e => setCustomer({...customer, lastname: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="city"
                    value={customer.city}
                    label="City"
                    onChange={e => setCustomer({...customer, city: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="streetaddress"
                    value={customer.streetaddress}
                    label="Stress address"
                    onChange={e => setCustomer({...customer, streetaddress: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="postcode"
                    value={customer.postcode}
                    label="Postcode"
                    onChange={e => setCustomer({...customer, postcode: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="email"
                    value={customer.email}
                    label="Email"
                    onChange={e => setCustomer({...customer, email: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    name="phone"
                    value={customer.phone}
                    label="Phone"
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSaveClick}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}