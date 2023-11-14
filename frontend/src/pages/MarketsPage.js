/*======================================================================*/
/*				   	   		   PAGES - MARKETPAGE       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Skeleton from "react-loading-skeleton";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Card } from "react-bootstrap";

//> Components 
import Sidebar from '../components/Sidebar';
import Agents from "../modals/Agents";
import AgentForm from "../modals/AgentForm";
import MarketSnapshot from '../modals/MarketSnapshot';

//> Api Calls
import { getMarkets, getDexMarkets } from '../components/shared/apiCalls';

//> Style - CSS Files 
import '../styles/platform.css'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

//> Icons - FontAwesome 
import { FaPlus, FaMagento, FaSort } from "react-icons/fa";
import { TbArrowsExchange2 } from 'react-icons/tb'
import { IoStatsChart } from "react-icons/io5";
import { BsBrowserChrome } from "react-icons/bs";



export default function MarketsPage() {

   const [activeButton, setActiveButton] = useState("CEXs");

   //> Fetch All Markets
   const [markets, setMarkets] = useState([]);
   const [loaded, setLoaded] = useState(false);
   useEffect(() => {
      async function fetchMarkets() {
         const marketsData = await getMarkets();
         setMarkets(marketsData.markets);
         setLoaded(true);
      }
      fetchMarkets();
   }, []);

   const [dexMarkets, setDexMarkets] = useState([]);
   useEffect(() => {
      async function fetchDexMarkets() {
         const dexMarketsData = await getDexMarkets();
         setDexMarkets(dexMarketsData.data);
      }
      fetchDexMarkets();
   }, []);

   //----------------------------------------> Agent Modals
   const [agents, setAgents] = useState(false);
   const [agentForm, setAgentForm] = useState(false);

   const [selectedExchange, setSelectedExchange] = useState("");
   const [selectedMarkets, setSelectedMarkets] = useState("");

   function openAgentForm(market) {
      setSelectedExchange(market.exchange_name.toUpperCase());
      setSelectedMarkets(`${market.base_asset} - ${market.quote_asset}`)
      setAgents(false);
      setAgentForm(true);
   };
   function closeAgentForm() {
      setAgents(true);
      setAgentForm(false);
   };

   //----------------------------------------> Market Modal
   const [marketData, setMarketData] = useState(false);
   const [selectedMarketId, setSelectedMarketId] = useState(null);
   const [marketInfo, setMarketInfo] = useState([]);

   function openMarketData(market_id, base_asset, quote_asset, exchange) {
      const info = { base_asset, quote_asset, exchange };
      setMarketInfo(info);
      setSelectedMarketId(market_id)
      setMarketData(true);
   };


   //----------------------------------------> Table Sort
   const [sort, setSort] = useState({ column: null, direction: null });

   if (sort.column === 'weekly_reward_in_usd') {
      markets.sort((a, b) => {
         if (a.weekly_reward_in_usd < b.weekly_reward_in_usd) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.weekly_reward_in_usd > b.weekly_reward_in_usd) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }
   if (sort.column === 'last_hour_bots') {
      markets.sort((a, b) => {
         if (a.last_hour_bots < b.last_hour_bots) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.last_hour_bots > b.last_hour_bots) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }
   if (sort.column === 'filled_24h_volume') {
      markets.sort((a, b) => {
         if (a.filled_24h_volume < b.filled_24h_volume) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.filled_24h_volume > b.filled_24h_volume) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }
   if (sort.column === 'active_traders') {
      dexMarkets.sort((a, b) => {
         if (a.active_traders < b.active_traders) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.active_traders > b.active_traders) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }
   if (sort.column === 'base_volume_buy') {
      dexMarkets.sort((a, b) => {
         if (a.base_volume_buy < b.base_volume_buy) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.base_volume_buy > b.base_volume_buy) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   } if (sort.column === 'base_volume_sell') {
      dexMarkets.sort((a, b) => {
         if (a.base_volume_sell < b.base_volume_sell) {
            return sort.direction === 'asc' ? -1 : 1;
         }
         if (a.base_volume_sell > b.base_volume_sell) {
            return sort.direction === 'asc' ? 1 : -1;
         }
         return 0;
      });
   }

   const [searchFilter, setSearchFilter] = useState('');
   function handleSearchFilterChange(event) {
      setSearchFilter(event.target.value);
   };
   const filteredCex = markets.filter((market) => {
      const marketName = `${market.base_asset} ${market.quote_asset} ${market.exchange_name}`.toLowerCase();
      return marketName.includes(searchFilter.toLowerCase());
   });
   const filteredDex = dexMarkets.filter((dex) => {
      const dexName = `${dex.relationships.market.base_asset} ${dex.relationships.market.quote_asset} ${dex.relationships.market.exchange_name}`.toLowerCase();
      return dexName.includes(searchFilter.toLowerCase());
   });


   async function goToWebsite(exchange, base_asset, quote_asset) {
      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      };
      const response = await fetch(`/get_exchange_url?exchange=${exchange}&base_asset=${base_asset}&quote_asset=${quote_asset}`, requestOptions)
      if (response.ok) {
         const data = await response.json();
         const spot = data.url
         if (spot) {
            window.open(spot, '_blank');
         } else {
            console.log("Something went wrong. Couldn't get spot connector");
         }
      }
   }


   return (
      <div>
         <Sidebar />
         <section id="main">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-xl-11 col-lg-10 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column">
                     <div className="d-flex justify-content-between">
                        <div>
                           <button className={`page-header-btn ${activeButton === "CEXs" ? "active" : ""}`}
                              onClick={() => setActiveButton("CEXs")}>
                              CEXs
                           </button>
                           <button className={`page-header-btn ${activeButton === "DEXs" ? "active" : ""}`}
                              onClick={() => setActiveButton("DEXs")}>
                              DEXs
                           </button>
                        </div>
                        <FloatingLabel className="search-bar" controlId="search" label="Search Market/Exchange">
                           <Form.Control
                              type="text"
                              value={searchFilter}
                              onChange={handleSearchFilterChange}
                           />
                        </FloatingLabel>
                     </div>
                     <div style={{ overflowX: 'scroll' }}>
                        <Card className="custom-scroll" style={{border:"none", marginTop:"50px"}}>
                           <Card.Body style={{ height: "700px" }}>
                              <Table>
                                 {activeButton === "CEXs" && (
                                    <thead>
                                       <tr>
                                          <th style={{ paddingBottom: '16px' }}>Market</th>
                                          <th>
                                             Weekly Rewards
                                             <button onClick={() => setSort({ column: 'weekly_reward_in_usd', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                          <th>
                                             Active Agents
                                             <button onClick={() => setSort({ column: 'last_hour_bots', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                          <th>
                                             24h Volume
                                             <button onClick={() => setSort({ column: 'filled_24h_volume', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                          <th></th>
                                       </tr>
                                    </thead>
                                 )}
                                 {activeButton === "DEXs" && (
                                    <thead>
                                       <tr>
                                          <th style={{ paddingBottom: '16px' }}>Market</th>
                                          <th>
                                             Active Traders
                                             <button onClick={() => setSort({ column: 'active_traders', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                          <th>
                                             Base Volume Buy
                                             <button onClick={() => setSort({ column: 'base_volume_buy', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                          <th>
                                             Base Volume Sell
                                             <button onClick={() => setSort({ column: 'base_volume_sell', direction: sort.direction === 'asc' ? 'desc' : 'asc' })} className="btn-sort">
                                                <FaSort />
                                             </button>
                                          </th>
                                       </tr>
                                    </thead>
                                 )}

                                 {!loaded && (
                                    <tbody>
                                       {[...Array(12)].map((_, i) => (
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
                                       {activeButton === "CEXs" && filteredCex.map((market) => (
                                          <tr key={market.market_id}>
                                             <td className="info">
                                                <div>
                                                   {market.base_asset} <TbArrowsExchange2 /> {market.quote_asset}
                                                </div>
                                                <div className="exchange">{market.exchange_name}</div>
                                             </td>
                                             <td className='info'>${market.weekly_reward_in_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                             <td className='info'>{market.last_hour_bots}</td>
                                             <td className='info'>${market.filled_24h_volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                             <td>
                                                <div className="interaction-container">
                                                   <button title="Create Agent" onClick={() => openAgentForm(market)} className="interaction-btn neutral">
                                                      <FaMagento />
                                                   </button>
                                                   <button title="Statistics" onClick={() => openMarketData(market.market_id, market.base_asset, market.quote_asset, market.exchange_name)} className="interaction-btn neutral">
                                                      <IoStatsChart />
                                                   </button>
                                                   <button title="Direct to Webpage" onClick={() => goToWebsite(market.exchange_name, market.base_asset, market.quote_asset)} className="interaction-btn neutral">
                                                      <BsBrowserChrome />
                                                   </button>

                                                </div>
                                             </td>
                                          </tr>
                                       ))}
                                       {activeButton === "DEXs" && filteredDex.map((dexMarket) => (
                                          <tr key={dexMarkets.pool_id}>
                                             <td className="info">
                                                <div>
                                                   {dexMarket.relationships.market.base_asset} <TbArrowsExchange2 /> {dexMarket.relationships.market.quote_asset}
                                                </div>
                                                <div className="exchange">{dexMarket.relationships.market.exchange_name}</div>
                                             </td>
                                             <td className="info">{dexMarket.active_traders}</td>
                                             <td className="info">${dexMarket.base_volume_buy.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                             <td className="info">${dexMarket.base_volume_sell.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 )}
                              </Table>
                           </Card.Body>
                        </Card>
                     </div>
                  </div>
               </div>
            </div >
         </section >



         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agents} onHide={() => setAgents(false)}>
            <Modal.Header
               className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Agents</h5>
            </Modal.Header>
            <Modal.Body>
               <Agents />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={openAgentForm} className="modal-add-btn"><FaPlus /><span>Create a new Agent</span></Button>
            </Modal.Footer>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentForm} onHide={() => setAgentForm(false)}>
            <Modal.Header
               className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Create Agent</h5>
            </Modal.Header>            <Modal.Body>
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

      </div >
   );
}
