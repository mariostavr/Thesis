/*======================================================================*/
/*				   	   	   MODAL - CREATE AGENT       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { PropagateLoader } from 'react-spinners'

//> Components
import AgentPmmUpdateForm from './AgentPmmUpdateForm';
import { UserContext } from "../components/shared/UserContext";

export default function AgentPmmUpdate({ agentId, active, closeAgentUpdate, mode }) {
   const [userAccessToken] = useContext(UserContext);

   const pmmAgentConfInitialState = {
      strategy: '',
      exchange: '',
      market: '',
      filename: '',
      password: '',
      killswitch: '',
      bid_spread: '',
      ask_spread: '',
      minimum_spread: '',
      order_refresh_time: '',
      max_order_age: '',
      order_refresh_tolerance_pct: '',
      order_amount: '',
      price_ceiling: '',
      price_floor: '',
      moving_price_band_enabled: '',
      price_ceiling_pct: '',
      price_floor_pct: '',
      price_band_refresh_time: '',
      ping_pong_enabled: '',
      inventory_skew_enabled: '',
      inventory_target_base_pct: '',
      inventory_range_multiplier: '',
      inventory_price: '',
      order_levels: '',
      order_level_amount: '',
      order_level_spread: '',
      filled_order_delay: '',
      hanging_orders_enabled: '',
      hanging_orders_cancel_pct: '',
      order_optimization_enabled: '',
      ask_order_optimization_depth: '',
      bid_order_optimization_depth: '',
      add_transaction_costs: '',
      price_source: '',
      price_type: '',
      price_source_exchange: '',
      price_source_market: '',
      price_source_custom_api: '',
      custom_api_update_interval: '',
      take_if_crossed: '',
      order_override: '',
      split_order_levels_enabled: '',
      bid_order_level_spreads: '',
      ask_order_level_spreads: '',
      bid_order_level_amounts: '',
      ask_order_level_amounts: '',
      should_wait_order_cancel_confirmation: ''
   };
   const [pmmAgentConf, setPmmAgentConf] = useState(pmmAgentConfInitialState);

   async function getAgentByID() {
      const requestOptions = {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userAccessToken,
         },
      };

      const response = await fetch(`/agent/pure_market_making/${agentId}`, requestOptions);
      if (response.ok) {
         const data = await response.json();
         setPmmAgentConf(data);
      } else {
         return 'Something went wrong. Couldn\'t load the agent';
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
         const response = await fetch(`/agent/pure_market_making/${agentId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: 'Bearer ' + userAccessToken,
            },
            body: JSON.stringify(pmmAgentConf),
         });

         if (response.ok) {
            const data = await response.json();
            setPmmAgentConf(data);
            setIsLoading(false)
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
               <AgentPmmUpdateForm pmmAgentConf={pmmAgentConf} setPmmAgentConf={setPmmAgentConf} mode={mode} />
               <Button type="submit" disable={active} className="modal-btn">Update</Button>
            </Form>
         )}
      </div >
   );
};