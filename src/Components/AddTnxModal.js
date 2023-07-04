import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import * as Yup from "yup";
import { AuthContext } from '../Routing/AuthContext';
import moment from 'moment';

export default function AddTnxModal({ setOpen, open }) {
    const { AddTransaction } = useContext(AuthContext);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Transaction</DialogTitle>
            <Formik
                initialValues={{ date: new Date(), amount: '', type: 'credit' }}
                validationSchema={Yup.object().shape({
                    amount: Yup.string()
                      .required("Amount is required!")
                  })}
                onSubmit={async (values, { setSubmitting }) => {
                    values.date=moment(values.date).format('MM/DD/YYYY')
                AddTransaction(values).then(()=>{
                    handleClose()
                })
                }}>
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent style={{ paddingTop: 5 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date"
                                    inputFormat="DD MMM YYYY"
                                    value={values.date}
                                    onChange={(d)=> setFieldValue('date',d)}
                                    name="date"
                                    renderInput={(params) => <TextField style={{ width: '100%' }} {...params} />}
                                />

                            </LocalizationProvider>
                            <TextField
                                value={values.amount}
                                type='number'
                                onChange={handleChange}
                                style={{ marginTop: 10, width: '100%' }} 
                                id="outlined-basic" 
                                label="Amount" 
                                name="amount"
                                onBlur={handleBlur}
                                variant="outlined"
                                error={!!touched.amount && !!errors.amount} />
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                                <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                            </RadioGroup>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
}