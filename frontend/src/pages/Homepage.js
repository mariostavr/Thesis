/*======================================================================*/
/*				   	   		   PAGES - HOMEPAGE         						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Table} from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'

//> Components
import Header from "../components/Header"
import Login from "../modals/Login"
import Register from "../modals/Register"
import Footer from '../components/Footer'
import CircularProgressBar from '../components/CircularProgressBar';

//> Api Calls
import { getStatsnPop } from '../components/shared/apiCalls';

//> Style - CSS Files
import '../styles/homepage.css'
import '../styles/modal.css';

//> Icons
import { FaExchangeAlt } from "react-icons/fa";
import { TbHexagon } from "react-icons/tb";


export default function Homepage() {

   //> Fetch Top 5 Markets - Overall Stats
   const [markets, setMarkets] = useState([]);
   const [topMarkets, setTopMarkets] = useState([]);
   const [activeBots, setActiveBots] = useState(0);
   const [exchanges, setExchanges] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchData() {
         const { data, topMarkets, total_active_bots, exchanges } = await getStatsnPop();

         setMarkets(data.markets);
         setTopMarkets(topMarkets);
         setActiveBots(total_active_bots);
         setExchanges(exchanges);

         setLoading(true);
         setIsLoading(false);
      }
      fetchData();
   }, []);



   //----------------------------------------> Register & LogIn Modals
   const [showReg, setShowReg] = useState(false);
   const [showLog, setShowLog] = useState(false);

   function handleOpenReg () {
      setShowReg(true);
      setShowLog(false);
   };
   function handleOpenLog () {
      setShowLog(true);
      setShowReg(false);
   };
   function handleCloseModal () {
      setShowReg(false);
      setShowLog(false);
   };
   function handleOpenRegFromLog () {
      setShowLog(false);
      setShowReg(true);
   };
   function handleOpenLogFromReg () {
      setShowReg(false);
      setShowLog(true);
   };



   return (
      <div>
         <Header />
         <div id="home" className="d-flex align-items-center">
            <div className="container-fluid">
               <div className="row justify-content-center">
                  <div className="col-xl-6 col-lg-6 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
                     <h1>Simplified Mining Experience<br />with CoinRep</h1>
                     <h2>Liquidity Mining Agents</h2>
                     <h3>Create your own optimized mining agent and start earning rewards</h3>
                     <div style={{marginTop:"30px"}}>
                        <button type="button" className="btn" onClick={handleOpenReg}>Get Started</button>
                        <button type="button" className="btn" onClick={handleOpenLog}>Launch</button>
                     </div>
                  </div>
                  <div className="col-xl-2 col-lg-2 order-1 order-lg-4 home-img img" style={{ width: "400px" }}>
                     <img src="assets/img/logo/3dlogo.png" className="img-fluid animated logo3d" alt="3dlogo" />
                  </div>
               </div>
            </div>
         </div>

         <div className='homepage'>
            <section id="about" className="about">
               <div className="container-fluid">
                  <div className="row justify-content-center">
                     <div className="col-xl-6 col-lg-6 pt-3 pt-lg-0 order-1 order-lg-1 d-flex flex-column justify-content-center">
                        <div className='section-title'>
                           About
                        </div>
                        <div className='section-content'>
                           Welcome to CoinRep, the ultimate liquidity mining platform, where you can Create, Monitor and Tune your own custom mining agents to earn rewards like never before.
                           Build to help you maximize your earnings through liquidity pooling opportunities.
                           With CoinRep you have the flexibility to configure your own mining agents according to your investment goals.
                           Our user-friendly interface allows you to easily monitor your mining agents and track their performance in real-time.
                           Join thousands of investors who have already discovered the power of CoinRep and start earning higher returns today with your mining agent!
                        </div>
                     </div>
                     <div className="col-xl-2 col-lg-2 order-2 order-lg-4" style={{ width: "500px" }}>
                        <img src="assets/img/about/about_v3.png" className="" alt="about" />
                     </div>
                  </div>
               </div>
            </section>

            <section id='statistics'>
               <div className='container'>
                  <div className="row justify-content-center">
                     <div className="col-3 mx-5 text-center">
                        <div className='stats'>
                           <CircularProgressBar value={exchanges.length} divider="0.5" symbol="" isLoading={isLoading} />
                           <div className='barTitle'>Available<br />Exchanges</div>
                        </div>
                     </div>
                     <div className="col-3 mx-5 text-center">
                        <div className='stats'>
                           <CircularProgressBar value={markets.length} divider="1" symbol="" isLoading={isLoading} />
                           <div className='barTitle'>Available<br />Markets</div>
                        </div>
                     </div>
                     <div className="col-3 mx-5 text-center">
                        <div className='stats'>
                           <CircularProgressBar value={activeBots} divider="20" symbol="" isLoading={isLoading} />
                           <div className='barTitle'>Active<br />Agents</div>
                        </div>
                     </div>
                  </div>

               </div>
            </section>

            <section id="popularMarkets">
               <div className="container-fluid">
                  <div className="row justify-content-center">
                     <div className="col-xl-9 col-lg-9 d-flex flex-column">
                        <div className='section-title'>Popular Markets</div>
                        <div style={{ overflowX: 'scroll' }}>
                           <Table striped>
                              <thead>
                                 <tr>
                                    <th>Market</th>
                                    <th>Weekly Rewards</th>
                                    <th>Active Agents</th>
                                    <th>24h Volume</th>
                                 </tr>
                              </thead>

                              {!loading && (
                                 <tbody>
                                    {[...Array(5)].map((_, i) => (
                                       <tr key={i}>
                                          <>
                                             <td><Skeleton height={12} count={2} style={{ margin: '2px 0' }} /></td>
                                             <td><Skeleton height={15} /></td>
                                             <td><Skeleton height={15} /></td>
                                             <td><Skeleton height={15} /></td>
                                          </>
                                       </tr>
                                    ))}
                                 </tbody>
                              )}

                              {loading && (
                                 <tbody style={{ width: '25%', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    {topMarkets.map((market) => (
                                       <tr key={market.market_id}>
                                          <td className="info">
                                             <div>{market.base_asset} <FaExchangeAlt /> {market.quote_asset}</div>
                                             <div className="exchange">{market.exchange_name}</div>
                                          </td>
                                          <td className='info'>${market.weekly_reward_in_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                          <td className='info'>{market.last_hour_bots}</td>
                                          <td className='info'>${market.filled_24h_volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
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

            <section id="how" className="how">
               <div className="container ">
                  <div className='section-title text-center'>
                     How It Works
                  </div>
                  <div className="row" style={{ paddingTop: "30px" }}>
                     <div className="col text-center d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                           <Card.Body>
                              <TbHexagon className='card-icon' />
                              <Card.Title>Sign Up</Card.Title>
                              <Card.Text>
                                 Sign Up with an email
                              </Card.Text>
                           </Card.Body>
                        </Card>
                     </div>
                     <div className="col text-center d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                           <Card.Body>
                              <TbHexagon className='card-icon' /><TbHexagon className='card-icon' />
                              <Card.Title>Configure Mining Agents</Card.Title>
                              <Card.Text>
                                 Customize your own mining strategies
                              </Card.Text>
                           </Card.Body>
                        </Card>
                     </div>
                     <div className="col text-center d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                           <Card.Body>
                              <TbHexagon className='card-icon' /><TbHexagon className='card-icon' /><TbHexagon className='card-icon' />
                              <Card.Title>Earn Rewards</Card.Title>
                              <Card.Text>
                                 Maximize your rewards and get paid
                              </Card.Text>
                           </Card.Body>
                        </Card>
                     </div>
                  </div>
               </div>
            </section >
         </div >

         <Footer />


         <Modal className='homepageModal' size="md" aria-labelledby="contained-modal-title-vcenter" centered show={showReg} onHide={handleCloseModal}>
            <Modal.Header className="btn-close-white" closeButton></Modal.Header>
            <Modal.Body>
               <Register />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={handleOpenLogFromReg} className="btn-modal">Have an account? Sign In.</Button>
            </Modal.Footer>
         </Modal>

         <Modal className='homepageModal' size="md" aria-labelledby="contained-modal-title-vcenter" centered show={showLog} onHide={handleCloseModal}>
            <Modal.Header className="btn-close-white" closeButton></Modal.Header>
            <Modal.Body>
               <Login />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={handleOpenRegFromLog} className="btn-modal">Don't have an account? Sign Up.</Button>
            </Modal.Footer>
         </Modal>

      </div >
   )
}