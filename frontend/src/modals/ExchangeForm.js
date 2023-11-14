/*======================================================================*/
/*				   	   		   MODAL - ADD WALLET       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

//> Components
import { UserContext } from "../components/shared/UserContext";
import { getStatsnPop } from '../components/shared/apiCalls';


export default function ExchangeForm({ closeExchangeForm }) {

   const [userAccessToken] = useContext(UserContext);
   const [errorMessage, setErrorMessage] = useState("");

   const [exchanges, setExchanges] = useState([]);
   useEffect(() => {
      async function getAvailableOptions() {
         try {
            const { data, exchanges } = await getStatsnPop();

            if (data && data.exchanges && Array.isArray(data.exchanges)) {
               setExchanges(data.exchanges);
            }
            setExchanges(exchanges);
         } catch (error) {
            console.error('Error fetching options:', error);
         }
      }
      getAvailableOptions();
   }, []);

   const [exchange, setExchange] = useState('');

   function handleSelectExchange(event) {
      setExchange(event.target.value);
   };

   const exchangeConfInitialState = {
      api_key: '',
      secret_api_key: '',
   }
   const [exchangeConf, setExchangeConf] = useState(exchangeConfInitialState);

   useEffect(() => {
      setExchangeConf((prevState) => ({
         ...prevState,
         exchange
      }));
   }, [exchange]);



   async function handleSubmit(event) {
      event.preventDefault();
      try {
         const response = await fetch('/exchanges', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: "Bearer " + userAccessToken,
            },
            body: JSON.stringify({
               name: exchange,
               api_key: exchangeConf.api_key,
               secret_api_key: exchangeConf.secret_api_key
            })
         });
         const responseData = await response.json()
         if (response.ok) {
            console.log('Connected successfully');
            closeExchangeForm();
         } else {
            setErrorMessage(responseData.detail);
            console.log('Error connecting exchange');
         }
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div>
         <form className="form" onSubmit={handleSubmit}>

            <Form.Select className='mb-2' value={exchange} onChange={handleSelectExchange} required>
               <option value="" hidden>Select an Exchange</option>
               {exchanges.length > 0 ? (
                  exchanges.map((exchangeOption, index) => (
                     <option key={index} value={exchangeOption.toLowerCase()}>
                        {exchangeOption}
                     </option>
                  ))
               ) : (
                  <option disabled>No exchanges available</option>
               )}
            </Form.Select>

            <FloatingLabel controlId="apiKey" label="API Key" className="mb-2">
               <Form.Control type="password" placeholder="API Key" value={exchangeConf.api_key} required
                  onChange={(event) => setExchangeConf({ ...exchangeConf, api_key: event.target.value })} />
            </FloatingLabel>
            <FloatingLabel controlId="apiSecretKey" label="API Secret Key" className="mb-2">
               <Form.Control type="password" placeholder="API Secret Key" value={exchangeConf.secret_api_key} required
                  onChange={(event) => setExchangeConf({ ...exchangeConf, secret_api_key: event.target.value })}
               />
            </FloatingLabel>
            <div style={{ marginTop: "30px", color: "red" }}>
               {errorMessage && errorMessage}
            </div>
            <Button type="submit" className="modal-btn" variant="primary">Add</Button>
         </form>
      </div>
   );
};