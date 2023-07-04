import React, { useContext } from 'react'
import { AuthContext } from '../Routing/AuthContext';
import { Container } from '@material-ui/core';
import './homeStyle.scss';
import { payoutDate } from '../Helpers';
import Heading from '../Components/heading';
import HistoryTable from '../Components/HistoryTable';


function Home() {
  const { userData } = useContext(AuthContext);
  
  return (
    <Container maxWidth="sm">
      <Heading/>
      <div className='payout'>
        <h5>
          Next Payout Date: <br/><span>{payoutDate(userData.payout)}</span>
        </h5>
        <h4> Amount: <br/><span>50000000000</span></h4>
      </div>
      <HistoryTable/>
    </Container>
  )
}

export default Home