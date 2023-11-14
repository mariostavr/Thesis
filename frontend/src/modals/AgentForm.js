/*======================================================================*/
/*				   	   	   MODAL - CREATE AGENT       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import { PropagateLoader } from 'react-spinners'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

//> Components
import { UserContext } from "../components/shared/UserContext";
import { getStatsnPop } from '../components/shared/apiCalls';

//> Icons
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export default function AgentForm({ selectedMarkets, selectedExchange, closeAgentForm, mode }) {

   const [userAccessToken] = useContext(UserContext);
   const tableMode = mode === 'table';
   const [showParameters, setShowParameters] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   //> Overall Stats
   const [exchanges, setExchanges] = useState([]);
   const [markets, setMarkets] = useState([]);
   const [availableMarkets, setAvailableMarkets] = useState([]);

   const [strategy, setStrategy] = useState('');
   const [simulated, setSimulated] = useState(false);
   const [exchange, setExchange] = useState('');
   const [market, setMarket] = useState('');
   const [base_asset, quote_asset] = market.split('-');
   const [filename, setFilename] = useState('');
   const [password, setPassword] = useState('');


   useEffect(() => {
      async function getAvailableOptions() {
         try {
            const { data, exchanges } = await getStatsnPop();

            if (data && data.markets && Array.isArray(data.markets)) {
               setMarkets(data.markets);
            }
            setExchanges(exchanges);
         } catch (error) {
            console.error('Error fetching options:', error);
         }
      }
      getAvailableOptions();
   }, []);


   function filterMarketsByExchange() {
      if (simulated) {
         if (exchange === 'binance_paper_trade') {
            const filteredMarkets = (markets.filter((market) => market.exchange_name === 'binance'));
            setAvailableMarkets(filteredMarkets)
         } else if (exchange === 'kucoin_paper_trade') {
            const filteredMarkets = (markets.filter((market) => market.exchange_name === 'kucoin'));
            setAvailableMarkets(filteredMarkets)
         } else if (exchange === 'gate_io_paper_trade') {
            const filteredMarkets = (markets.filter((market) => market.exchange_name === 'gateio'));
            setAvailableMarkets(filteredMarkets)
         }
      }
      else {
         if (exchange === '') {
            setAvailableMarkets([]);
         } else {
            const filteredMarkets = (markets.filter((market) => market.exchange_name.toLowerCase() === exchange.toLowerCase()));
            setAvailableMarkets(filteredMarkets)
         }
      }
   }
   useEffect(() => {
      filterMarketsByExchange();
      // eslint-disable-next-line
   }, [exchange, markets]);


   const toggleParameters = () => {
      setShowParameters(!showParameters);
   };

   const lmAgentConfInitialState = {
      strategy: '',
      exchange: '',
      market: '',
      filename: '',
      token: '',
      order_amount: '',
      spread: '',
      inventory_skew_enabled: true,
      target_base_pct: '',
      order_refresh_time: '10.0',
      order_refresh_tolerance_pct: '0.2',
      inventory_range_multiplier: '1.0',
      volatility_interval: '300',
      avg_volatility_period: '10',
      volatility_to_spread_multiplier: '1.0',
      max_spread: '-1.0',
      max_order_age: '3600.0',
   }
   const [lmAgentConf, setLmAgentConf] = useState(lmAgentConfInitialState);


   const pmmAgentConfInitialState = {
      strategy: '',
      exchange: '',
      market: '',
      filename: '',
      bid_spread: '',
      ask_spread: '',
      minimum_spread: '-100.0',
      order_refresh_time: '',
      max_order_age: '1800.0',
      order_refresh_tolerance_pct: '0.0',
      order_amount: '',
      price_ceiling: '-1.0',
      price_floor: '-1.0',
      moving_price_band_enabled: false,
      price_ceiling_pct: '1.0',
      price_floor_pct: '-1.0',
      price_band_refresh_time: '86400',
      ping_pong_enabled: false,
      inventory_skew_enabled: false,
      inventory_target_base_pct: '50.0',
      inventory_range_multiplier: '1.0',
      inventory_price: '1.0',
      order_levels: '1',
      order_level_amount: '0',
      order_level_spread: '1.0',
      filled_order_delay: '60',
      hanging_orders_enabled: false,
      hanging_orders_cancel_pct: '10.0',
      order_optimization_enabled: false,
      ask_order_optimization_depth: '0',
      bid_order_optimization_depth: '0',
      add_transaction_costs: false,
      price_source: 'current_market',
      price_type: 'mid_price',
      price_source_exchange: '',
      price_source_market: '',
      price_source_custom_api: '',
      custom_api_update_interval: '5.0',
      take_if_crossed: false,
      order_override: false,
      split_order_levels_enabled: false,
      bid_order_level_spreads: '',
      ask_order_level_spreads: '',
      bid_order_level_amounts: '',
      ask_order_level_amounts: '',
      should_wait_order_cancel_confirmation: true
   };
   const [pmmAgentConf, setPmmAgentConf] = useState(pmmAgentConfInitialState);

   useEffect(() => {
      setLmAgentConf((prevState) => ({
         ...prevState,
         strategy,
         simulated,
         exchange,
         market,
         filename,
         password,
      }));
   }, [strategy, simulated, exchange, market, filename, password]);

   useEffect(() => {
      setPmmAgentConf((prevState) => ({
         ...prevState,
         strategy,
         simulated,
         exchange,
         market,
         filename,
         password,
      }));
   }, [strategy, simulated, exchange, market, filename, password]);


   //> Selected Market and Exchange
   useEffect(() => {
      if (tableMode) {
         setExchange(selectedExchange);
         setMarket(selectedMarkets);
      }
   }, [tableMode, selectedExchange, selectedMarkets]);


   //> Submit Agent Form
   const handleSubmit = async (event) => {
      event.preventDefault();

      setIsLoading(true)

      if (strategy === 'liquidity_mining') {
         try {
            const response = await fetch(`/agent/lm`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer " + userAccessToken,
               },
               body: JSON.stringify(lmAgentConf)
            });

            if (response.ok) {
               const data = await response.json();
               setLmAgentConf(data);
               setIsLoading(false);
               closeAgentForm();
            } else {
               console.log('Error creating agent');
            }
         } catch (error) {
            console.error(error);
         }
      }
      else if (strategy === 'pure_market_making') {
         try {
            const response = await fetch(`/agent/pmm`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer " + userAccessToken,
               },
               body: JSON.stringify(pmmAgentConf)
            });

            if (response.ok) {
               const data = await response.json();
               setPmmAgentConf(data)
               closeAgentForm();

            } else {
               console.log('Error creating agent');
            }

         } catch (error) {
            console.error(error);
         }
      }
   };

   return (
      <div>
         {isLoading ? (
            <PropagateLoader className='loader' color="rgba(88, 82, 153, 1)" />
         ) : (
            <Form className="form" onSubmit={handleSubmit}>
               <Form.Check
                  type="checkbox"
                  id="simulated"
                  title="Do you want to be a simulated agent?"
                  label="Simulated Agent"
                  inline
                  checked={simulated}
                  onChange={(event) => setSimulated(event.target.checked)}
               />
               <Row className="my-4">
                  <Col>
                     <FloatingLabel controlId="strategy" label="Strategy" className="mb-2" title="Select a strategy for your mining agent">
                        <Form.Select value={strategy} onChange={(event) => setStrategy(event.target.value)}>
                           <option value="" disabled defaultValue hidden></option>
                           <option value="liquidity_mining">Liquidity Mining</option>
                           <option value="pure_market_making">Pure Market Making</option>
                        </Form.Select>
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId="exchange" label="Exchange" title="Select an exchange to connect your mining agent.">
                        {tableMode ? (
                           <Form.Control
                              type="text"
                              placeholder="Exchange"
                              value={exchange}
                              disabled
                              onChange={(event) => setExchange(event.target.value)}
                           />
                        ) : (
                           <Form.Select value={exchange} onChange={(event) => setExchange(event.target.value)}>
                              <option value="" disabled defaultValue hidden></option>
                              {simulated ? (
                                 <>
                                    <option value="binance_paper_trade">Binance</option>
                                    <option value="kucoin_paper_trade">KuCoin</option>
                                    <option value="gate_io_paper_trade">GateIO</option>
                                 </>
                              ) : exchanges.length > 0 ? (
                                 exchanges.map((exchangeOption, index) => (
                                    <option key={index} value={exchangeOption}>
                                       {exchangeOption}
                                    </option>
                                 ))
                              ) : (
                                 <option disabled>No exchanges available</option>
                              )}
                           </Form.Select>
                        )}
                     </FloatingLabel>

                  </Col>
                  <Col>
                     <FloatingLabel controlId="market" label="Market" title="Select the market for your mining agent">
                        {tableMode ? (
                           <Form.Control type="text" placeholder="Market" value={market} disabled onChange={(event) => setMarket(event.target.value)} />
                        ) : (
                           <Form.Select value={market} onChange={(event) => setMarket(event.target.value)}>
                              <option value="" disabled defaultValue hidden></option>
                              {availableMarkets.length > 0 ? (
                                 availableMarkets.map((marketOption, index) => (
                                    <option key={index} value={marketOption.base_asset + '-' + marketOption.quote_asset}>
                                       {marketOption.base_asset + '-' + marketOption.quote_asset}
                                    </option>
                                 ))
                              ) : (
                                 <option disabled>No exchanges available</option>
                              )}
                           </Form.Select>
                        )}
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='Name' label='Name' className="mb-2">
                        <Form.Control type='text' placeholder='Name' value={lmAgentConf.filename}
                           onChange={(event) => setFilename(event.target.value)}
                        />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId="password" label="Password" className="mb-2">
                        <Form.Control type="password" placeholder="Password" value={password} required onChange={(event) => setPassword(event.target.value)} />
                     </FloatingLabel>
                  </Col>
               </Row>
               {strategy === 'liquidity_mining' ? (
                  <>
                     <h6 style={{ color: 'black', textAlign: 'left' }}>Required Settings</h6>
                     <Row>
                        <Col>
                           <FloatingLabel controlId='token' label='Token' title="What asset (base or quote) do you want to use to provide liquidity?">
                              <Form.Select
                                 value={lmAgentConf.token}
                                 onChange={(event) => setLmAgentConf({ ...lmAgentConf, token: event.target.value })}
                              >
                                 <option value="" disabled defaultValue hidden></option>
                                 <option value={base_asset}>{base_asset}</option>
                                 <option value={quote_asset}>{quote_asset}</option>
                              </Form.Select>
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='order_amount' label='Order Amount' className='mb-2' title="What is the size of each order (in [token] amount)?">
                              <Form.Control type='number' placeholder='Order Amount' defaultValue={lmAgentConf.order_amount} required
                                 onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_amount: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='spread' label='Spread' className='mb-2' title='How far away from the mid price do you want to place bid and ask orders?'>
                              <Form.Control type='number' placeholder='Spread' defaultValue={lmAgentConf.spread} required
                                 onChange={(event) => setLmAgentConf({ ...lmAgentConf, spread: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='target' label='Target Base Asset' className="mb-2" title='For each pair, what is your target base asset percentage?'>
                              <Form.Control type='number' placeholder='Target Base Asset' defaultValue={lmAgentConf.target_base_pct} required
                                 onChange={(event) => setLmAgentConf({ ...lmAgentConf, target_base_pct: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='killswitch' label='Kill Switch' className="mb-2" title='At what profit/loss rate would you like the agent to stop?'>
                              <Form.Control type='number' placeholder='Kill Switch' defaultValue={lmAgentConf.killswitch} required
                                 onChange={(event) => setLmAgentConf({ ...lmAgentConf, killswitch: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                     </Row>

                     <div style={{ textAlign: 'left', marginTop:"20px" }}>
                        <Button onClick={toggleParameters} className="action-btn btn-new">
                           {showParameters ? (<>Hide Additional Settings <BsChevronUp /></>) : (<>Show Additional Settings <BsChevronDown /></>)}
                        </Button>
                     </div>
                     {showParameters && (
                        <>
                           <Row>
                              <Col><FloatingLabel controlId='order_refresh_time' label='Order Refresh Time' className="mb-2" title='How often do you want to cancel and replace bids and asks'>
                                 <Form.Control type='number' placeholder='Order Refresh Time' defaultValue={lmAgentConf.order_refresh_time} required
                                    onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_refresh_time: event.target.value })} />
                              </FloatingLabel>
                              </Col>
                              <Col>
                                 <FloatingLabel controlId='order_refresh_tolerance_pct' label='Order Refresh Tolerance' type="order_refresh_tolerance_pct" className="mb-2"
                                    title='Enter the percent change in price needed to refresh orders at each cycle'>
                                    <Form.Control type='number' placeholder='Order Refresh Tolerance' defaultValue={lmAgentConf.order_refresh_tolerance_pct} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, order_refresh_tolerance_pct: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                              <Col>
                                 <FloatingLabel controlId='inventory_range_multiplier' label="Inventory Range Multiplier" className="mb-2"
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
                                 <FloatingLabel controlId='volatility_interval' label='Volatility Interval' className="mb-2"
                                    title='What is an interval, in second, in which to pick historical mid price data from to calculate market volatility?'>
                                    <Form.Control type='number' placeholder='Volatility Interval' defaultValue={lmAgentConf.volatility_interval} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, volatility_interval: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                              <Col>
                                 <FloatingLabel controlId='avg_volatilty_period' label='Avg Volatility Period' className="mb-2 "
                                    title='How many interval does it take to calculate average market volatility?'>
                                    <Form.Control type='number' placeholder='Avg Volatility Period' defaultValue={lmAgentConf.avg_volatility_period} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, avg_volatility_period: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                              <Col>
                                 <FloatingLabel controlId='volatility_spread_multiplier' label="Volatility to Spread Multiplier" className="mb-2 "
                                    title='Enter a multiplier used to convert average volatility to spread'>
                                    <Form.Control type='numbet' placeholder='Volatility to Spread Multiplier' defaultValue={lmAgentConf.volatility_to_spread_multiplier} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, volatility_to_spread_multiplier: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                           </Row>
                           <Row>
                              <Col>
                                 <FloatingLabel controlId='max_spread' label="Max Spread" className="mb-2 " title='What is the maximum spread?'>
                                    <Form.Control type='number' placeholder='Max Spread' defaultValue={lmAgentConf.max_spread} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, max_spread: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                              <Col>
                                 <FloatingLabel controlId='max_age' label="Max Order Age" className="mb-2 " title='What is the maximum life time of your orders (in seconds)?'>
                                    <Form.Control type='number' placeholder='Max Order Age' defaultValue={lmAgentConf.max_order_age} required
                                       onChange={(event) => setLmAgentConf({ ...lmAgentConf, max_order_age: event.target.value })} />
                                 </FloatingLabel>
                              </Col>
                           </Row>
                        </>
                     )}
                  </>
               ) : strategy === 'pure_market_making' ? (
                  <>
                     <h6 style={{ color: 'black', textAlign: 'left' }}>Required Settings</h6>
                     <Row>
                        <Col>
                           <FloatingLabel controlId='bid_spread' label="Bid Spread" className="mb-2 " title='How far away from the mid price do you want to place the first bid order?'>
                              <Form.Control type='number' placeholder='Bid Spread' defaultValue={pmmAgentConf.bid_spread} required
                                 onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, bid_spread: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='ask_spread' label="Ask Spread" className="mb-2 " title='How far away from the mid price do you want to place the first ask order?'>
                              <Form.Control type='number' placeholder='Ask Spread' defaultValue={pmmAgentConf.ask_spread} required
                                 onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ask_spread: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='order_amount' label="Order Amount" className="mb-2 " title='What is the amount of [base_asset] per order?'>
                              <Form.Control type='number' placeholder='Order Amount' defaultValue={pmmAgentConf.order_amount} required
                                 onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_amount: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='order_refresh_time' label="Order Refresh Time" className="mb-2 " title='How often do you want to cancel and replace bids and asks (in seconds)?'>
                              <Form.Control type='number' placeholder='Order Refresh Time' defaultValue={pmmAgentConf.order_refresh_time} required
                                 onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_refresh_time: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                        <Col>
                           <FloatingLabel controlId='killswitch' label='Kill Switch' className="mb-2" title='At what profit/loss rate would you like the agent to stop?'>
                              <Form.Control type='number' placeholder='Kill Switch' defaultValue={pmmAgentConf.killswitch} required
                                 onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, killswitch: event.target.value })} />
                           </FloatingLabel>
                        </Col>
                     </Row>
                     <div style={{ textAlign: 'left', marginTop:"20px" }}>
                        <Button onClick={toggleParameters} className="action-btn btn-new">
                           {showParameters ? (<>Hide Additional Settings <BsChevronUp /></>) : (<>Show Additional Settings <BsChevronDown /></>)}
                        </Button>
                     </div>
                     {showParameters && (
                        <>
                           <Card className="custom-scroll" style={{ border: "none" }}>
                              <Card.Body style={{ height: "300px" }}>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='min_spread' label="Minimum Spread" className="mb-2 " title='At what minimum spread should the agent automatically cancel orders?'>
                                          <Form.Control type='number' placeholder='Minimum Spread' defaultValue={pmmAgentConf.minimum_spread} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, minimum_spread: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>

                                    <Col>
                                       <FloatingLabel controlId='order_levels' label="Order Levels" className="mb-2 " title='How many orders do you want to place on both sides?'>
                                          <Form.Control type='number' placeholder='Order Levels' defaultValue={pmmAgentConf.order_levels} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_levels: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='order_levels_amount' label="Order Levels Amount" className="mb-2 " title='How much do you want to increase or decrease the order size for each additional order?'>
                                          <Form.Control type='number' placeholder='Order Levels Amount' defaultValue={pmmAgentConf.order_level_amount} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_level_amount: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='orders_levels_spread' label="Order Levels Spread" className="mb-2 " title='Enter the price increments (as percentage) for subsequent orders?'>
                                          <Form.Control type='number' placeholder='Order Levels Spread' defaultValue={pmmAgentConf.order_level_spread} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_levels_spread: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                 </Row>

                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='price_ceiling' label="Price Ceiling" className="mb-2 " title='Enter the price point above which only sell orders will be placed'>
                                          <Form.Control type='number' placeholder='Price Ceiling' defaultValue={pmmAgentConf.price_ceiling} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_ceiling: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='price_floor' label="Price Floor" className="mb-2 " title='Enter the price below which only buy orders will be placed'>
                                          <Form.Control type='number' placeholder='Price Floor' defaultValue={pmmAgentConf.price_floor} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_floor: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='price_ceiling_pct' label="Price Celing PCT" className="mb-2 " title='Enter a percentage to the current price that sets the price ceiling. Above this price, only sell orders will be placed'>
                                          <Form.Control type='number' placeholder='Price Celing PCT' defaultValue={pmmAgentConf.price_ceiling_pct} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_ceiling_pct: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="moving-price-enable-checkbox"
                                          title='Would you like to enable moving price floor and ceiling?'
                                          label="Moving Price Enable" checked={pmmAgentConf.moving_price_band_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, moving_price_band_enabled: event.target.checked })}
                                       />
                                       <Form.Check
                                          type="checkbox" id="ping-pong-enable-checkbox"
                                          title='Would you like to use the ping pong feature and alternate between buy and sell orders after fills?'
                                          label="Ping Pong Enabled" checked={pmmAgentConf.ping_pong_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ping_pong_enabled: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='order_refresh_pct' label="Order Refresh Tolerance PCT" className="mb-2 "
                                          title='Enter the percent change in price needed to refresh orders at each cycle'>
                                          <Form.Control type='number' placeholder='Order Refresh Tolerance PCT' defaultValue={pmmAgentConf.order_refresh_tolerance_pct} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_refresh_tolerance_pct: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='MaxOrderAge' label="Max Order Age" className="mb-2 "
                                          title='How often do you want to cancel and replace bids and asks with the same price (in seconds)?'>
                                          <Form.Control type='number' placeholder='Max Order Age' defaultValue={pmmAgentConf.max_order_age} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, max_order_age: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='PriceBandRefreshTime' label="Price Band Refresh Time" className="mb-2 "
                                          title='After this amount of time (in seconds), the price bands are reset based on the current price'>
                                          <Form.Control type='number' placeholder='Price Band Refresh Time' defaultValue={pmmAgentConf.price_band_refresh_time} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_band_refresh_time: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='InventoryPrice' label="Inventory Price" className="mb-2 "
                                          title='What is the price of your base asset inventory?'>
                                          <Form.Control type='number' placeholder='Inventory Price' defaultValue={pmmAgentConf.inventory_price} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, inventory_price: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='InventoryTarget' label="Inventory Target Base PCT" className="mb-2 "
                                          title='What is your target base asset percentage?'>
                                          <Form.Control type='number' placeholder='Inventory Target Base PCT' defaultValue={pmmAgentConf.inventory_target_base_pct} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, inventory_target_base_pct: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='InventoryRange' label="Inventory Range Multiplier" className="mb-2 "
                                          title='What is your tolerable range of inventory around the target, expressed in multiples of your total order size?'>
                                          <Form.Control type='number' placeholder='Inventory Range Multiplier' defaultValue={pmmAgentConf.inventory_range_multiplier} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, inventory_range_multiplier: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="inventory-skew-enable-checkbox"
                                          title='Would you like to enable inventory skew?                                    '
                                          label="Inventory Skew" checked={pmmAgentConf.inventory_skew_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, inventory_skew_enabled: event.target.checked })}
                                       />
                                       <Form.Check
                                          type="checkbox" id="hanging-orders-enable-checkbox"
                                          title='Do you want to enable hanging orders?'
                                          label="Hanging Orders Enabled" checked={pmmAgentConf.hanging_orders_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, hanging_orders_enabled: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='FilledOrder' label="Filled Order Delay" className="mb-2 "
                                          title='How long do you want to wait before placing the next order if your order gets filled (in seconds)?'>
                                          <Form.Control type='number' placeholder='Filled Order Delay' defaultValue={pmmAgentConf.filled_order_delay} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, filled_order_delay: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='HangingOrders' label="Hanging Orders Cancel PCT" className="mb-2 "
                                          title='At what spread percentage (from mid price) will hanging orders be canceled?'>
                                          <Form.Control type='number' placeholder='Hanging Orders Cancel PCT' defaultValue={pmmAgentConf.hanging_orders_cancel_pct} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, hanging_orders_cancel_pct: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="order-opt-enable-checkbox"
                                          title='Do you want to enable best bid ask jumping?'
                                          label="Orders Optimizarion" checked={pmmAgentConf.orders_optimization_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, orders_optimization_enabled: event.target.checked })}
                                       />
                                       <Form.Check
                                          type="checkbox" id="wait-order-conf-enable-checkbox"
                                          title='Should the strategy wait to receive a confirmation for orders cancelation before creating a new set of orders? (Not waiting requires enough available balance) (Yes/No)'
                                          label="Wait Order Cancel Confirmation" checked={pmmAgentConf.should_wait_order_cancel_confirmation || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, should_wait_order_cancel_confirmation: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='AskOrderOpt' label="Ask Order Optimization Depth" className="mb-2 "
                                          title='How deep do you want to go into the order book for calculating the top ask, ignoring dust orders on the top (expressed in base asset amount)?'>
                                          <Form.Control type='number' placeholder='Ask Order Optimization Depth' defaultValue={pmmAgentConf.ask_order_optimization_depth} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ask_order_optimization_depth: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='BidOrderOpt' label="Bid Order Optimization Depth" className="mb-2 "
                                          title='How deep do you want to go into the order book for calculating the top bid, ignoring dust orders on the top (expressed in base asset amount)?'>
                                          <Form.Control type='number' placeholder='Bid Order Optimization Depth' defaultValue={pmmAgentConf.bid_order_optimization_depth} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, bid_order_optimization_depth: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="take-if-X-enable-checkbox"
                                          title='Do you want to take the best order if orders cross the orderbook?'
                                          label="Take If Crossed" checked={pmmAgentConf.take_if_crossed || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, take_if_crossed: event.target.checked })}
                                       />
                                       <Form.Check
                                          type="checkbox" id="order-override-enable-checkbox"
                                          label="Order Override" checked={pmmAgentConf.order_override || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_override: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>

                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='PriceSource' label="Price Source" className="mb-2 "
                                          title='Which price source to use? (current_market/external_market/custom_api)'>
                                          <Form.Control type='text' placeholder='Price Source' defaultValue={pmmAgentConf.price_source}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_source: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='PriceType' label="Price Type" className="mb-2 "
                                          title='Which price type to use? (mid_price/last_price/last_own_trade_price/best_bid/best_ask/inventory_cost)'>
                                          <Form.Control type='text' placeholder='Price Type' defaultValue={pmmAgentConf.price_type}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_type: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='PriceSourceEx' label="Price Source Exchange" className="mb-2 "
                                          title='Enter external price source exchange name'>
                                          <Form.Control type='text' placeholder='Price Source Exchange' defaultValue={pmmAgentConf.price_source_exchange}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_source_exchange: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='PriceSourceMarket' label="Price Source Market" className="mb-2 "
                                          title='Enter the token trading pair on [price_source_exchange]'>
                                          <Form.Control type='text' placeholder='Price Source Market' defaultValue={pmmAgentConf.price_source_market}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_source_market: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='PriceSourceAPI' label="Price Source Custom API" className="mb-2 ">
                                          <Form.Control type='text' placeholder='Price Source Custom API' defaultValue={pmmAgentConf.price_source_custom_api}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_source_custom_api: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='CustomAPI' label="Custom API Update Interval" className="mb-2 "
                                          title='Enter pricing API URL'>
                                          <Form.Control type='number' placeholder='Custom API Update Interval' defaultValue={pmmAgentConf.custom_api_update_interval} required
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, custom_api_update_interval: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="add-transaction-costs-enable-checkbox"
                                          title='Do you want to add transaction costs automatically to order prices?'
                                          label="Add Transaction Costs" checked={pmmAgentConf.add_transaction_costs || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, add_transaction_costs: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='BidOrderLvl' label="Bid Order Level Spreads" className="mb-2 "
                                          title='Enter the spreads (as percentage) for all bid spreads e.g 1,2,3,4 to represent 1%,2%,3%,4%. The number of levels set will be equal to minimum lengths of bid_order_level_spreads and bid_order_level_amounts'>
                                          <Form.Control type='number' placeholder='Bid Order Level Spreads' defaultValue={pmmAgentConf.bid_order_level_spreads}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, bid_order_level_spreads: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='AskOrderLvl' label="Ask Order Level Spreads" className="mb-2 "
                                          title='Enter the spreads (as percentage) for all ask spreads e.g 1,2,3,4 to represent 1%,2%,3%,4%. The number of levels set will be equal to minimum lengths of ask_order_level_spreads and ask_order_level_amounts'>
                                          <Form.Control type='number' placeholder='Ask Order Level Spreads' defaultValue={pmmAgentConf.ask_order_level_spreads}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ask_order_level_spreads: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='BidOrderAmt' label="Bid Order Level Amounts" className="mb-2 "
                                          title='Enter the amount for all bid amounts. The number of levels set will be equal to the minimum length of bid_order_level_spreads and bid_order_level_amounts'>
                                          <Form.Control type='number' placeholder='Bid Order Level Amounts' defaultValue={pmmAgentConf.bid_order_level_amounts}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, bid_order_level_amounts: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <FloatingLabel controlId='AskOrderAmt' label="Ask Order Level Amounts" className="mb-2 "
                                          title='Enter the amount for all ask amounts. The number of levels set will be equal to the minimum length of ask_order_level_spreads and ask_order_level_amounts'>
                                          <Form.Control type='number' placeholder='Ask Order Level Amounts' defaultValue={pmmAgentConf.ask_order_level_amounts}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ask_order_level_amounts: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FloatingLabel controlId='PriceFloorPct' label="Price Floor PCT" className="mb-2 "
                                          title='Enter the amount for all bid amounts. The number of levels set will be equal to the minimum length of bid_order_level_spreads and bid_order_level_amounts'>
                                          <Form.Control type='number' placeholder='Price Floor PCT' defaultValue={pmmAgentConf.price_floor_pct}
                                             onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_floor_pct: event.target.value })} />
                                       </FloatingLabel>
                                    </Col>
                                    <Col>
                                       <Form.Check
                                          type="checkbox" id="Split Orders Levels"
                                          label="Split Orders Levels" checked={pmmAgentConf.split_order_levels_enabled || false}
                                          onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, split_order_levels_enabled: event.target.checked })}
                                       />
                                    </Col>
                                 </Row>
                              </Card.Body>
                           </Card>
                        </>
                     )}
                  </>
               ) : null}
               <Button type="submit" className="modal-btn">Create</Button>
            </Form>
         )}
      </div >
   );
};