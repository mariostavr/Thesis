/*======================================================================*/
/*				   	   	   MODAL - CREATE AGENT       						*/
/*======================================================================*/

//> Modules and Dependecies
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export default function AgentPmmUpdateForm({ pmmAgentConf, setPmmAgentConf, mode }) {

   return (
      <div>
         <Row className='my-4'>
            <Col>
               <FloatingLabel controlId='Strategy' label='Strategy' className='mb-2' title="Select a strategy for your mining agent">
                  <Form.Control type='text' defaultValue={pmmAgentConf.strategy} placeholder='Strategy' required disabled
                     onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, stategy: event.target.value })} />
               </FloatingLabel>
            </Col>

            <Col>
               <FloatingLabel controlId='Exchange' label='Exchange' className="mb-2" title="Select an exchange to connect your mining agent.">
                  <Form.Control type='text' placeholder='Select an Exchange' defaultValue={pmmAgentConf.exchange} required disabled
                     onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, exchange: event.target.value })} />
               </FloatingLabel>
            </Col>
            <Col>
               <FloatingLabel controlId='Markets' label='Markets' className="mb-2" title="Select the market for your mining agent">
                  <Form.Control type='text' placeholder='Select Markets' defaultValue={pmmAgentConf.market} required disabled
                     onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, market: event.target.value })} />
               </FloatingLabel>
            </Col>
            <Col>
               <FloatingLabel controlId='Name' label='Name' className="mb-2">
                  <Form.Control type='text' placeholder='Name' defaultValue={pmmAgentConf.filename} required
                     onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, filename: event.target.value })}
                  />
               </FloatingLabel>
            </Col>
            <Col>
               <FloatingLabel controlId='killswitch' label='Killswitch' className="mb-2">
                  <Form.Control type='text' placeholder='Killswitch' defaultValue={pmmAgentConf.killswitch} required
                     onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, killswitch: event.target.value })}
                  />
               </FloatingLabel>
            </Col>
         </Row>

         <Card className={`${mode ? '' : 'custom-scroll'}`} style={{ border: "none" }}>
            <Card.Body style={mode ? {} : { height: "300px" }}>
               <Row>
                  <Col>
                     <FloatingLabel controlId='BidSpread' label="Bid Spread" className="mb-2 "
                        title='How far away from the mid price do you want to place the first bid order?'>
                        <Form.Control type='number' placeholder='Bid Spread' defaultValue={pmmAgentConf.bid_spread} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, bid_spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='AskSpread' label="Ask Spread" className="mb-2 "
                        title='How far away from the mid price do you want to place the first ask order?'>
                        <Form.Control type='number' placeholder='Ask Spread' defaultValue={pmmAgentConf.ask_spread} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, ask_spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='MinimumSpread' label="Minimum Spread" className="mb-2 "
                        title='At what minimum spread should the agent automatically cancel orders?'>
                        <Form.Control type='number' placeholder='Minimum Spread' defaultValue={pmmAgentConf.minimum_spread} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, minimum_spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
               </Row>

               <Row>
                  <Col>
                     <FloatingLabel controlId='OrderAmount' label="Order Amount" className="mb-2 " title='What is the amount of [base_asset] per order?'>
                        <Form.Control type='number' placeholder='Order Amount' defaultValue={pmmAgentConf.order_amount} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_amount: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='OrderLevels' label="Order Levels" className="mb-2 " title='How many orders do you want to place on both sides?'>
                        <Form.Control type='number' placeholder='Order Levels' defaultValue={pmmAgentConf.order_levels} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_levels: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='OrderLevelsAmount' label="Order Levels Amount" className="mb-2 "
                        title='How much do you want to increase or decrease the order size for each additional order?'>
                        <Form.Control type='number' placeholder='Order Levels Amount' defaultValue={pmmAgentConf.order_level_amount} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_level_amount: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='OrderLevelsSpread' label="Order Levels Spread" className="mb-2 "
                        title='Enter the price increments (as percentage) for subsequent orders?'>
                        <Form.Control type='number' placeholder='Order Levels Spread' defaultValue={pmmAgentConf.order_level_spread} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_levels_spread: event.target.value })} />
                     </FloatingLabel>
                  </Col>
               </Row>

               <Row>
                  <Col>
                     <FloatingLabel controlId='PriceCeiling' label="Price Ceiling" className="mb-2 "
                        title='Enter the price point above which only sell orders will be placed'>
                        <Form.Control type='number' placeholder='Price Ceiling' defaultValue={pmmAgentConf.price_ceiling} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_ceiling: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='PriceFloor' label="Price Floor" className="mb-2 "
                        title='Enter the price below which only buy orders will be placed'>
                        <Form.Control type='number' placeholder='Price Floor' defaultValue={pmmAgentConf.price_floor} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, price_floor: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='PriceCelingPCT' label="Price Celing PCT" className="mb-2 "
                        title='Enter a percentage to the current price that sets the price ceiling. Above this price, only sell orders will be placed'>
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
                     <FloatingLabel controlId='OrderRefreshTime' label="Order Refresh Time" className="mb-2 "
                        title='How often do you want to cancel and replace bids and asks (in seconds)?'>                        <Form.Control type='number' placeholder='Order Refresh Time' defaultValue={pmmAgentConf.order_refresh_time} required
                           onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, order_refresh_time: event.target.value })} />
                     </FloatingLabel>
                  </Col>
                  <Col>
                     <FloatingLabel controlId='OrderRefreshTolerancePCT' label="Order Refresh Tolerance PCT" className="mb-2 "
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
                        label="Wait Order Cancel Confirmation" checked={pmmAgentConf.wait_order_cancel_conf || false}
                        onChange={(event) => setPmmAgentConf({ ...pmmAgentConf, wait_order_cancel_conf: event.target.checked })}
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
      </div>
   );
};