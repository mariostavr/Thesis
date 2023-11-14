/*======================================================================*/
/*				   	   		   PAGES - Monitor             						*/
/*======================================================================*/


//> Modules and Dependecies
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ScaleLoader } from 'react-spinners'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

//> Components 
import Sidebar from '../components/Sidebar'
import MarketGraph from '../components/MarketGraph'
import AgentLmUpdate from '../modals/AgentLmUpdate';
import AgentPmmUpdate from '../modals/AgentPmmUpdate';
import MQTT from '../components/shared/mqtt';
import { UserContext } from "../components/shared/UserContext";

//> API Calls
import { getAgents, getInstanceID, start_instance, stop_agent_instance, status_instance } from '../components/shared/apiCalls';
//stop_agent_instance

import { BarLoader } from 'react-spinners'

//> Icons - FontAwesome
import { FaPlay, FaStop, FaPause, FaHistory } from 'react-icons/fa'
import { MdQueryStats, } from 'react-icons/md';

export default function Monitor() {

   const location = useLocation();
   const { agentId, strategy, market, exchange } = location.state || {};

   useEffect(() => {
      if (agentId && strategy && market && exchange) {
         const formattedOption = `${agentId},${strategy},${market},${exchange}`;
         setSelectedOption(formattedOption);
      }
   }, [agentId, strategy, market, exchange]);

   const {
      messages,
      event,
      eventData,
      totalAskOrders,
      totalBidOrders,
      totalCanceledAskOrders,
      totalCanceledBidOrders,
      totalFilledAskOrders,
      totalFilledBidOrders,
      totalPnl,
      pnl,
      clearMessagesAndData,
      cmdConnect,
      cmdDisconnect,
      cmdStatus,
      cmdHistory,
      cmdImport,
      cmdStart,
      cmdStop,
   } = MQTT();

   const [userToken] = useContext(UserContext);


   //----------------------------------------> API Calls
   //> Fetch 
   const [agents, setAgents] = useState([]);
   const [isLoadingAgents, setIsLoadingAgents] = useState(true);
   useEffect(() => {
      async function fetchAgents() {
         const data = await getAgents(userToken);
         setAgents(data);
      }
      setIsLoadingAgents(false)
      fetchAgents();
      //eslint-disable-next-line
   }, []);


   const [agentConf, setAgentConf] = useState('')
   const [isLoadingAgent, setIsLoadingAgent] = useState(false)

   async function getAgent(strategy, agentId) {

      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
         },
      };
      const response = await fetch(`/agent/${strategy}/${agentId}`, requestOptions);
      if (!response.ok) {
         return ("Something went wrong. Couldn't load the agent");
      } else {
         const data = await response.json();
         setAgentConf(data)
      }
      setIsLoadingAgent(false)
   };


   const [selectedMarketId, setSelectedMarketId] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   async function getMarketId(baseAsset, quoteAsset, exchange) {
      setIsLoading(true)
      try {
         const response = await fetch(`/market_id?base_asset=${baseAsset}&quote_asset=${quoteAsset}&exchange=${exchange}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
         });

         if (!response.ok) {
            throw new Error('Error fetching market ID');
         }

         const market_id = await response.json();
         setSelectedMarketId(market_id);
      } catch (error) {
         setSelectedMarketId('');
         console.error(error);
         setMarketInfo('')
      }
      setIsLoading(false);
   }


   //> Selected agent
   const [marketInfo, setMarketInfo] = useState('');
   const [selectedOption, setSelectedOption] = useState('');
   const [instance_id, setInstance_id] = useState('');

   const [dockerLoading, setDockerLoading] = useState(false)
   async function handleSelectAgent(event) {
      clearMessagesAndData()

      setIsLoadingAgent(true)
      setDockerLoading(true)

      setSelectedOption(event.target.value);
      let [id, strategy, market, exchange] = event.target.value.split(',');
      const [baseAsset, quoteAsset] = market.split('-').map(asset => asset.trim());

      if (exchange === 'binance_paper_trade') {
         exchange = 'binance';
      }
      else if (exchange === 'kucoin_paper_trade') {
         exchange = 'kucoin';
      }
      else if (exchange === 'gate_io_paper_trade') {
         exchange = 'gateio';
      }
      const info = { baseAsset: baseAsset, quoteAsset: quoteAsset, exchange: exchange.toLowerCase() };

      setMarketInfo(info)
      getMarketId(info.baseAsset, info.quoteAsset, info.exchange)

      getAgent(strategy, id)
      let containerName = strategy + '_' + id
      const status = await status_instance(containerName, userToken)
      if (status === "Active") {
         setDockerLoading(false)
      }
      else {
         await start_instance(containerName, userToken)
         await sleep(5000)
         setDockerLoading(false)
      }

      const instanceid = await getInstanceID(containerName, userToken);
      setInstance_id(instanceid)
      await cmdDisconnect(instanceid)
      await cmdConnect(instanceid)
   }

   async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

   function isAgentActive(agent) {
      const key = `${agent.strategy}_${agent.id}`;
      const localStorageData = JSON.parse(localStorage.getItem(key));
      return (localStorageData === true);
   };

   //> Play Button
   async function handlePlayButtonClick(agent) {
      setDockerLoading(true)

      const key = `${agent.strategy}_${agent.id}`
      localStorage.setItem(key, JSON.stringify(true));

      const status = await status_instance(key, userToken)
      if (status === "Active") {
         const instanceid = await getInstanceID(key, userToken);
         await cmdImport(instanceid, agent.strategy, agent.exchange, agent.market)
         await sleep(3000)
         await cmdStart(instanceid)
         setDockerLoading(false)
      }
      else {
         await start_instance(key, userToken)
         const instanceid = await getInstanceID(key, userToken);
         setInstance_id(instanceid)
         await cmdDisconnect(instanceid)
         await cmdConnect(instanceid)
         await sleep(10000)
         await cmdImport(instanceid, agent.strategy, agent.exchange, agent.market)
         await sleep(3000)
         await cmdStart(instanceid)
         setDockerLoading(false)
      }      
   }

   //>  Pause Button
   async function handlePauseButtonClick(agent) {
      const key = `${agent.strategy}_${agent.id}`;
      localStorage.removeItem(key);
      await cmdStop(instance_id);
   }

   //>  Stop Button
   async function handleStopButtonClick(agent) {
      const key = `${agent.strategy}_${agent.id}`;
      localStorage.removeItem(key);
      await cmdStop(instance_id);
      setDockerLoading(true)
      stop_agent_instance(key, userToken)
      await sleep(10000)
      setDockerLoading(false)
   }


   //----------------------------------------> Display Incoming Messages
   const receivedMessages = useRef(null);
   useEffect(() => {
      receivedMessages.current?.scrollTo(0, receivedMessages.current?.scrollHeight);
   }, [messages]);

   const eventMessages = useRef(null);
   useEffect(() => {
      eventMessages.current?.scrollTo(0, eventMessages.current?.scrollHeight);
   }, [event]);

   const [isEventsCollapsed, setEventsCollapsed] = useState(true);
   const [activeButton, setActiveButton] = useState("Statistics");

   return (
      <div>
         <Sidebar />

         <section id="main">
            <Container>
               <h3>Monitor</h3>
               <Row>
                  <Col>
                     <Form.Select onChange={handleSelectAgent} value={selectedOption || ""}>
                        <option value="" hidden>Select an Agent</option>
                        {isLoadingAgents ? (
                           <option disabled>Loading Agents...</option>
                        ) : (
                           agents.length > 0 ? (
                              agents.map((agent, index) => (
                                 <option key={index} value={`${agent.id},${agent.strategy},${agent.market},${agent.exchange}`}>
                                    {`${agent.filename}`}
                                 </option>
                              ))
                           ) : (
                              <option disabled>There are no mining agents created yet.</option>
                           )
                        )}
                     </Form.Select>
                  </Col>

                  <Col>
                     {agents.map((agent, index) => (
                        <div key={index}>
                           {selectedOption === `${agent.id},${agent.strategy},${agent.market},${agent.exchange}` && (
                              <>
                                 <div className='interaction-container monitoring-actions'>
                                    {dockerLoading ? (
                                       <BarLoader color="rgba(88, 82, 153, 1)" />
                                    ) : (
                                       <>
                                          {!isAgentActive(agent) ? (
                                             <button className="interaction-btn positive" title='Start Agent' onClick={() => handlePlayButtonClick(agent)}>
                                                <FaPlay />
                                             </button>
                                          ) : (
                                             <>
                                                <button className="interaction-btn negative" title='Pause Agent' onClick={() => handlePauseButtonClick(agent)}>
                                                   <FaPause />
                                                </button>
                                                <button className="interaction-btn negative" title='Stop Agent' onClick={() => handleStopButtonClick(agent)}>
                                                   <FaStop />
                                                </button>
                                                <button className="interaction-btn neutral" title='Stats Agent' onClick={() => cmdStatus(instance_id)} >
                                                   <MdQueryStats />
                                                </button>
                                                <button className="interaction-btn neutral" title='History Agent' onClick={() => cmdHistory(instance_id)} >
                                                   <FaHistory />
                                                </button>
                                             </>
                                          )}
                                       </>
                                    )}
                                 </div>
                              </>
                           )}
                        </div>
                     ))}
                  </Col>
               </Row>
            </Container>
         </section>

         <section id="secondary">
            <div className="container" style={{ marginTop: "-20px" }}>
               <div>
                  <button className={`mode-btn ${activeButton === "Statistics" ? "active" : ""}`}
                     onClick={() => setActiveButton("Statistics")}>
                     Statistics
                  </button>
                  <button className={`mode-btn ${activeButton === "Messages" ? "active" : ""}`}
                     onClick={() => setActiveButton("Messages")}>
                     Messages
                  </button>
               </div>

               <div>
                  {activeButton === "Statistics" ? (
                     <div>
                        <Row style={{ paddingTop: "40px" }}>
                           <Col>
                              <Card style={{ height: "280px" }}>
                                 <Card.Body>
                                    {marketInfo ? (`${marketInfo.exchange.toUpperCase()}: ${marketInfo.baseAsset} - ${marketInfo.quoteAsset}`)
                                       : ("Exchange: Quote Asset - Base Asset")}
                                    <ResponsiveContainer width="100%" height={210}>
                                       <LineChart
                                          margin={{
                                             left: -60,
                                             bottom: -30
                                          }}
                                          data={eventData}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis
                                             dataKey="equal"
                                             name='Quote Asset'
                                             labelStyle={{ color: "#8884d8" }}
                                             labelFormatter={(value) => `Quote Base Asset: ${value}`}
                                          />
                                          <YAxis domain={['dataMin', 'dataMax']} />
                                          <Tooltip
                                             formatter={(value, name, props) => {
                                                const xAxisLabel = `Quote Base Asset: ${props.label}`;
                                                if (name === 'Base Asset') {
                                                   return [`Base Asset Price: ${value}`];
                                                }
                                                if (name === 'Quote Asset') {
                                                   return [`Quote Asset Ptice: ${value}`];
                                                }
                                                if (name === 'Type') {
                                                   return [`Type: ${value}`];
                                                }
                                                return '';
                                             }}
                                             labelStyle={{ color: "blue" }}
                                             labelFormatter={(value) => `Quote Base Asset: ${value}`}
                                          />
                                          <Line dataKey="price" fill="#8884d8" name="Base Asset" />
                                          <Line dataKey="type" fill="#ffc658" name="Type" />
                                       </LineChart>
                                    </ResponsiveContainer>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col lg={4}>
                              <h6 style={{ color: "black" }}>Ask Orders</h6>
                              <Row>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Orders
                                          <div className="monitor-stats">{totalAskOrders}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Filled
                                          <div className="monitor-stats">{totalFilledAskOrders}</div>
                                       </Card.Body>

                                    </Card>
                                 </Col>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Canceled
                                          <div className="monitor-stats">{totalCanceledAskOrders}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                              </Row>

                              <h6 style={{ marginTop: "20px", color: "black" }}>Bid Orders</h6>
                              <Row>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Orders
                                          <div className="monitor-stats">{totalBidOrders}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Filled
                                          <div className="monitor-stats">{totalFilledBidOrders}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col>
                                    <Card>
                                       <Card.Body>
                                          Canceled
                                          <div className="monitor-stats">{totalCanceledBidOrders}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                              </Row>
                           </Col>
                        </Row>
                        <Row style={{ marginTop: "40px" }}>
                           <Col lg={3}>
                              <h6 style={{ color: "black" }}>Profit & Loss</h6>
                              <Row>
                                 <Col>
                                    <Card>
                                       <Card.Body style={{ height: "250px" }}>
                                          Total PnL
                                          <div className="monitor-stats">{totalPnl.toFixed(2)}</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col>
                                    <Card>
                                       <Card.Body style={{ height: "250px" }}>
                                          Return PnL
                                          <div className="monitor-stats">{pnl.toFixed(2)}%</div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                              </Row>
                           </Col>
                           <Col lg={3}>
                              <Card style={{ height: "280px" }}>
                                 <Card.Body>
                                    Overall Market Statistics
                                    {isLoading ? (
                                       <div
                                          style={{
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             height: "150px",
                                          }}
                                       >
                                          <ScaleLoader color={"#5B8D6D"} loading={isLoading} />
                                       </div>
                                    ) : (
                                       <>
                                          {selectedMarketId !== "" ? (
                                             <MarketGraph selectedMarketId={selectedMarketId} marketInfo={marketInfo} />
                                          ) : (
                                             <p style={{ color: "black" }}>There is no available data.</p>
                                          )}
                                       </>
                                    )}
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col>
                              <Card className={`custom-scroll ${isAgentActive(agentConf) ? 'disabled' : ''}`} style={{ height: "280px" }}>
                                 <Card.Body>
                                    Agent Configuration
                                    {isLoadingAgent ? (
                                       <div
                                          style={{
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             height: "150px",
                                          }}
                                       >
                                          <ScaleLoader color={"#5B8D6D"} loading={isLoadingAgent} />
                                       </div>
                                    ) : (
                                       <>
                                          {selectedOption !== "" ? (
                                             agentConf.strategy === 'liquidity_mining' ? (
                                                <AgentLmUpdate agentId={agentConf.id} active={isAgentActive(agentConf)} />
                                             ) : agentConf.strategy === 'pure_market_making' ? (
                                                <AgentPmmUpdate agentId={agentConf.id} active={isAgentActive(agentConf)} mode={true} />
                                             ) : null
                                          ) : (
                                             <p style={{ color: "black" }}>No Selected Agent.</p>
                                          )}
                                       </>
                                    )}
                                 </Card.Body>

                              </Card>
                           </Col>
                        </Row>
                     </div>
                  ) : activeButton === "Messages" ? (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: "30px" }}>
                           <Form style={{ marginRight: "20px" }}>
                              <Form.Check
                                 type="switch"
                                 id="Events"
                                 label="Events"
                                 checked={isEventsCollapsed}
                                 onChange={() => setEventsCollapsed(!isEventsCollapsed)}
                              />
                           </Form>
                        </div>
                        <div>
                           <Row>
                              <Col>
                                 <div style={{ border: "1px solid lightgrey", borderRadius: "10px" }}>
                                    <Card className="custom-scroll" style={{ height: "600px", border: "none" }}>
                                       <Card.Header style={{ textAlign: "left" }}>Notifications</Card.Header>
                                       <Card.Body ref={receivedMessages}>
                                          <ul style={{ color: "blue" }}>
                                             {messages.map((message, index) => (
                                                <li key={index}>{message.time}: {message.msg}</li>
                                             ))}
                                          </ul>
                                       </Card.Body>
                                    </Card>
                                 </div>

                              </Col>
                              {isEventsCollapsed && (
                                 <Col lg={3}>
                                    <div style={{ border: "1px solid lightgrey", borderRadius: "10px" }}>
                                       <Card className="custom-scroll" style={{ height: "600px", border: "none" }}>
                                          <Card.Header style={{ textAlign: "left" }}>Events</Card.Header>
                                          <Card.Body ref={eventMessages}>
                                             <ul style={{ color: "blue" }}>
                                                {event.map((eve, index) => (
                                                   <li key={index}>{eve}</li>
                                                ))}
                                             </ul>
                                          </Card.Body>
                                       </Card>
                                    </div>
                                 </Col>
                              )}
                           </Row>
                        </div>
                     </div>
                  ) : null}
               </div>
            </div>
         </section >
      </div >
   );
}