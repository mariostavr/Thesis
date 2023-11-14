/*======================================================================*/
/*				   	   	   MODAL - CREATE AGENT       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { PropagateLoader } from 'react-spinners'

//> Components
import { UserContext } from "../components/shared/UserContext";

export default function AgentLmUpdate({ agentId, active, closeAgentUpdate }) {

   const [userAccessToken] = useContext(UserContext);

   const lmAgentConfInitialState = {
      strategy: '',
      exchange: '',
      market: '',
      filename: '',
      password: '',
      killswitch: '',
      token: '',
      order_amount: '',
      spread: '',
      inventory_skew_enabled: '',
      target_base_pct: '',
      order_refresh_time: '',
      order_refresh_tolerance_pct: '',
      inventory_range_multiplier: '',
      volatility_interval: '',
      avg_volatility_period: '',
      volatility_to_spread_multiplier: '',
      max_spread: '',
      max_order_age: '',
   }
   const [lmAgentConf, setLmAgentConf] = useState(lmAgentConfInitialState);


   async function getAgentByID() {
      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userAccessToken,
         },
      };

      const response = await fetch(`/agent/liquidity_mining/${agentId}`, requestOptions);
      if (response.ok) {
         const data = await response.json();
         setLmAgentConf(data);
      } else {
         return ("Something went wrong. Couldn't load the agent");
      }
   };

   useEffect(() => {
      getAgentByID();
      // eslint-disable-next-line
   }, []);

   const [isLoading, setIsLoading] = useState(false);

   async function handleSubmit(event) {
      event.preventDefault();
      setIsLoading(true)
      try {
         const response = await fetch(`/agent/liquidity_mining/${agentId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: "Bearer " + userAccessToken,
            },
            body: JSON.stringify(lmAgentConf),
         });

         if (response.ok) {
            const data = await response.json();
            setLmAgentConf(data);
            setIsLoading(false);
            closeAgentUpdate();
         } else {
            console.log('Error updating agent');
         }
      } catch (error) {
         console.error(error);
      }
      getAgentByID();
   };

   return (
      <div>
         {isLoading ? (
            <PropagateLoader className='loader' color="rgba(88, 82, 153, 1)" />
         ) : (
            <Form className="form" onSubmit={handleSubmit}>
               <Row className='my-4'>
                  <Col>
                     <FloatingLabel controlId='Strategy' label='Strategy' className='mb-2' title="Select a strategy for your mining agent">
                        <Form.Control type='text' defaultValue={lmAgentConf.strategy} placeholder='Strategy' required disabled
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, stategy: event.target.value })} />
                     </FloatingLabel>
                  </Col>

                  <Col>
                     <FloatingLabel controlId='Exchange' label='Exchange' className="mb-2" title="Select an exchange to connect your mining agent.">
                        <Form.Control type='text' placeholder='Select an Exchange' defaultValue={lmAgentConf.exchange} required disabled
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, exchange: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Markets' label='Markets' className="mb-2" title="Select the market for your mining agent">
                        <Form.Control type='text' placeholder='Select Markets' defaultValue={lmAgentConf.market} required disabled
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, market: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='filename' label='Filename' className="mb-2">
                        <Form.Control type='text' placeholder='Filename' defaultValue={lmAgentConf.filename} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, filename: event.target.value })}
                        />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='killswitch' label='Killswitch' className="mb-2">
                        <Form.Control type='text' placeholder='Killswitch' defaultValue={lmAgentConf.killswitch} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, killswitch: event.target.value })}
                        />
                     </FloatingLabel>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <FloatingLabel controlId='Token' label='Token' className="mb-2"
                        title="What asset (base or quote) do you want to use to provide liquidity?">
                        <Form.Control type='text' placeholder='Token to provide liquidity' defaultValue={lmAgentConf.token} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, token: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Order' label='Order Amount' className='mb-2'
                        title="What is the size of each order (in [token] amount)?">
                        <Form.Control type='number' placeholder='Order Amount' defaultValue={lmAgentConf.order_amount} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_amount: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Spread' label='Spread' className='mb-2'
                        title='How far away from the mid price do you want to place bid and ask orders?'>
                        <Form.Control type='number' placeholder='Spread' defaultValue={lmAgentConf.spread} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Target' label='Target Base Asset' className="mb-2"
                        title='For each pair, what is your target base asset percentage?'>
                        <Form.Control type='number' placeholder='Target Base Asset Percentage' defaultValue={lmAgentConf.target_base_pct} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, target_base_pct: event.target.value })} />
                     </FloatingLabel>
                  </Col>
               </Row>
               <Row>
                  <Col><FloatingLabel controlId='OrderRefreshTime' label='Order Refresh Time' className="mb-2"
                     title='How often do you want to cancel and replace bids and asks'>
                     <Form.Control type='number' placeholder='Order Refresh Time' defaultValue={lmAgentConf.order_refresh_time} required
                        onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_refresh_time: event.target.value })} />
                  </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='OrderRefreshTolerance' label='Order Refresh Tolerance' className="mb-2"
                        title='Enter the percent change in price needed to refresh orders at each cycle'>
                        <Form.Control type='number' placeholder='Order Refresh Tolerance' defaultValue={lmAgentConf.order_refresh_tolerance_pct} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_refresh_tolerance_pct: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Inventory' label="Inventory Range Multiplier" className="mb-2"
                        title='What is your tolerable range of inventory around the target, expressed in multiples of your total order size?'>
                        <Form.Control type='number' placeholder='Inventory Range Multiplier' defaultValue={lmAgentConf.inventory_range_multiplier} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, inventory_range_multiplier: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <Form.Check title='Would you like to enable inventory skew? (Yes/No)'
                        type="checkbox" id="inventory-skew-enable-checkbox"
                        label="Enable Inventory Skew" checked={lmAgentConf.inventory_skew_enabled || false}
                        onChange={(event) => setLmAgentConf({ ...lmAgentConf, inventory_skew_enabled: event.target.checked })}
                     />
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <FloatingLabel controlId='VolatilityInterval' label='Volatility Interval' className="mb-2"
                        title='What is an interval, in second, in which to pick historical mid price data from to calculate market volatility?'>
                        <Form.Control type='number' placeholder='Volatility Interval' defaultValue={lmAgentConf.volatility_interval} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, volatility_interval: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Avg' label='Avg Volatility Period' className="mb-2 "
                        title='How many interval does it take to calculate average market volatility?'>
                        <Form.Control type='number' placeholder='Avg Volatility Period' defaultValue={lmAgentConf.avg_volatility_period} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, avg_volatility_period: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='VolatilityMultiplier' label="Volatility to Spread Multiplier" className="mb-2 "
                        title='Enter a multiplier used to convert average volatility to spread'>
                        <Form.Control type='numbet' placeholder='Volatility to Spread Multiplier' defaultValue={lmAgentConf.volatility_to_spread_multiplier} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, volatility_to_spread_multiplier: event.target.value })} />
                     </FloatingLabel>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <FloatingLabel controlId='MaxSpread' label="Max Spread" className="mb-2 " title='What is the maximum spread?'>
                        <Form.Control type='number' placeholder='Max Spread' defaultValue={lmAgentConf.max_spread} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, max_spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='MaxOrderAge' label="Max Order Age" className="mb-2" title='What is the maximum life time of your orders (in seconds)?'>
                        <Form.Control type='number' placeholder='Max Order Age' defaultValue={lmAgentConf.max_order_age} required
                           onChange={(event) => setLmAgentConf({ ...lmAgentConf, max_order_age: event.target.value })} />
                     </FloatingLabel>
                  </Col>
               </Row>


               < Button type="submit" disabled={active} className="modal-btn">Update</Button>

            </Form>
         )}
      </div >
   );
};