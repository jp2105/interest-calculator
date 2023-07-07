import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Routing/AuthContext';
import { Container } from '@material-ui/core';
import './homeStyle.scss';
import { payoutAmount, payoutDate, finalPayoutAmount } from '../Helpers';
import Heading from '../Components/heading';
import HistoryTable from '../Components/HistoryTable';
import Loader from '../Components/Loader';


function Home() {
  const { userData, loading, fetchUserData } = useContext(AuthContext);
  const [payoutData, setPayOutData] = useState([])
  const [payoutAmount, setpayoutAmount] = useState(0)
  useEffect(() => {
    finalPayoutAmount(userData).then(res => {
      let finalTotal = 0;
      res?.map(i => finalTotal = i.total + finalTotal)
      setpayoutAmount(finalTotal)
      console.log('{ ...res, finalTotal }', res)
      setPayOutData(res)
    })
  }, [userData])

  useEffect(() => {
    fetchUserData();
  }, [])
  return (
    <Container maxWidth="sm">
      {loading && <Loader />}
      <Heading />
      <div className='payout'>
        <h5>
          Next Payout Date: <br /><span>{payoutDate(userData.payout)}</span>
        </h5>
        <h4> Amount: <br /><span>{(payoutAmount ? payoutAmount : 0).toLocaleString('en-IN')}</span></h4>
      </div>
      <HistoryTable />
      <div style={{margin:5}}>
        <h3>breakout:</h3>
        <div>
          {Object.entries(payoutData).map(([key, item]) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                User: {item.username}
              </div>
              <table style={{ border: '1px solid', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid', padding: '5px' }}>Capital</th>
                    <th style={{ border: '1px solid', padding: '5px' }}>Days</th>
                    <th style={{ border: '1px solid', padding: '5px' }}>Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {item?.breakout?.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid', padding: '5px' }}>
                        {row.capital.toLocaleString('en-IN')}
                      </td>
                      <td style={{ border: '1px solid', padding: '5px' }}>
                        {row.days}
                      </td>
                      <td style={{ border: '1px solid', padding: '5px' }}>
                        {row.interest.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '10px' }}>
                Interest Amount: {item.total.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Home