import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Loader() {
  return (
    <Backdrop
    sx={{ color: '#fff', zIndex: 99999}}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default Loader