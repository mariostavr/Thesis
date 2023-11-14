/*======================================================================*/
/*				   	   		   PAGES - HOME             						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

//> Components 
import Sidebar from '../components/Sidebar';
import Tools from '../components/Tools'
import CircularProgressBar from '../components/CircularProgressBar';
import Agents from "../modals/Agents";
import AgentForm from "../modals/AgentForm";
import MarketSnapshot from '../modals/MarketSnapshot';


//> Api Calls
import { getStatsnPop } from '../components/shared/apiCalls';

//> Style - CSS Files 
import '../styles/platform.css'

//> Icons - FontAwesome 
import { FaPlus, FaMagento } from "react-icons/fa";
import { TbArrowsExchange2 } from 'react-icons/tb';
import { IoStatsChart } from "react-icons/io5";


export default function Home() {

   //> Fetch Top 5 Markets - Overall Stats
   const [markets, setMarkets] = useState([]);
   const [topMarkets, setTopMarkets] = useState([]);
   const [activeBots, setActiveBots] = useState(0);
   const [exchanges, setExchanges] = useState([]);
   const [loaded, setLoaded] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchData() {
         const { data, topMarkets, total_active_bots, exchanges } = await getStatsnPop();

         setMarkets(data.markets);
         setTopMarkets(topMarkets);
         setActiveBots(total_active_bots);
         setExchanges(exchanges);

         setLoaded(true);
         setIsLoading(false);
      }
      fetchData();
   }, []);


   //----------------------------------------> Agent Modals
   const [agents, setAgents] = useState(false);
   const [agentForm, setAgentForm] = useState(false);

   const [selectedExchange, setSelectedExchange] = useState("");
   const [selectedMarkets, setSelectedMarkets] = useState("");

   function openAgentForm (market) {
      setAgents(false);
      setSelectedExchange(market.exchange_name.toUpperCase());
      setSelectedMarkets(`${market.base_asset} - ${market.quote_asset}`)
      setAgentForm(true);
   };

   function closeAgentForm () {
      setAgents(true);
      setAgentForm(false);
   };


   //----------------------------------------> Market Modal
   const [marketData, setMarketData] = useState(false);
   const [selectedMarketId, setSelectedMarketId] = useState(null);
   const [marketInfo, setMarketInfo] = useState([]);

   function openMarketData (market_id, base_asset, quote_asset, exchange) {
      const info = { base_asset, quote_asset, exchange };
      setMarketInfo(info);
      setSelectedMarketId(market_id)
      setMarketData(true);
   };


   return (
      <div>
         <Sidebar />

         <section id="main" className="d-flex">
            <div className="container-fluid">
               <div className="row justify-content-center">
                  <div className="col-xl-6 col-lg-6 pt-3 pt-lg-0 order-2 order-lg-1">
                     <h3>Create your own optimized mining agent and start earning rewards</h3>
                     <div className="row">
                        <div className="col text-center">
                           <div className='stats'>
                              <CircularProgressBar value={exchanges.length} divider="0.5" symbol="" isLoading={isLoading} />
                              <div className='barTitle'>Available<br />Exchanges</div>
                           </div>
                        </div>
                        <div className="col text-center">
                           <div className='stats'>
                              <CircularProgressBar value={markets.length} divider="1" symbol="" isLoading={isLoading} />
                              <div className='barTitle'>Available<br />Markets</div>
                           </div>
                        </div>
                        <div className="col text-center ">
                           <div className='stats'>
                              <CircularProgressBar value={activeBots} divider="20" symbol="" isLoading={isLoading} />
                              <div className='barTitle'>Active<br />Agents</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 order-1 order-lg-4 image-container">
                     <Tools />
                  </div>
               </div>
            </div>
         </section>

         <section id="secondary">
            <div className="container-fluid">
               <div className="row justify-content-center">
                  <div className="col-xl-9 col-lg-9 d-flex flex-column">
                     <h3>Popular Markets</h3>
                     <div style={{ overflowX: 'scroll' }}>
                        <Table>
                           <thead>
                              <tr>
                                 <th>Market</th>
                                 <th>Weekly Rewards</th>
                                 <th>Active Agents</th>
                                 <th>24h Volume</th>
                                 <th></th>
                              </tr>
                           </thead>

                           {!loaded && (
                              <tbody>
                                 {[...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                       <>
                                          <td><Skeleton height={12} count={2} style={{ margin: '2px 0' }} /></td>
                                          <td><Skeleton height={15} /></td>
                                          <td><Skeleton height={15} /></td>
                                          <td><Skeleton height={15} /></td>
                                          <td>
                                             <div style={{ display: 'flex' }}>
                                                <Skeleton circle width={38} height={38} style={{ margin: '0 3px' }} />
                                                <Skeleton circle width={38} height={38} style={{ margin: '0 3px' }} />
                                             </div>
                                          </td>
                                       </>
                                    </tr>
                                 ))}
                              </tbody>
                           )}

                           {loaded && (
                              <tbody style={{ width: '25%', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                 {topMarkets.map((market) => (
                                    <tr key={market.market_id}>
                                       <td className="info">
                                          <div>{market.base_asset} <TbArrowsExchange2 /> {market.quote_asset}</div>
                                          <div className="exchange">{market.exchange_name}</div>
                                       </td>
                                       <td className='info'>${market.weekly_reward_in_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                       <td className='info'>{market.last_hour_bots}</td>
                                       <td className='info'>${market.filled_24h_volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                       <td>
                                          <div className="interaction-container">
                                             <button title="Crate Agent" onClick={() => openAgentForm(market)} className="interaction-btn neutral"><FaMagento /></button>
                                             <button title="Statistics" onClick={() => openMarketData(market.market_id, market.base_asset, market.quote_asset, market.exchange_name)}
                                                className="interaction-btn neutral"><IoStatsChart /></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           )}
                        </Table>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agents} onHide={() => setAgents(false)}>
            <Modal.Header
               className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Agents</h5>
            </Modal.Header>
            <Modal.Body>
               <Agents />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={openAgentForm} className="modal-add-btn"><FaPlus /><span>Create a Simulated Agent</span></Button>
            </Modal.Footer>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentForm} onHide={() => setAgentForm(false)}>
            <Modal.Header
               className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Create Agent</h5>
            </Modal.Header>
            <Modal.Body>
               <AgentForm selectedMarkets={selectedMarkets} selectedExchange={selectedExchange} closeAgentForm={closeAgentForm} mode="table" />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={marketData} onHide={() => setMarketData(false)}>
            <Modal.Header
               className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Market Statistics</h5>
            </Modal.Header>
            <Modal.Body>
               <MarketSnapshot selectedMarketId={selectedMarketId} marketInfo={marketInfo} />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
         </Modal>

      </div>


   )
}
