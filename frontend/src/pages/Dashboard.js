/*======================================================================*/
/*				   	   		   PAGES - DASHBOARD       						*/
/*======================================================================*/

//> Modules and Dependecies
import React from "react";

//> Components 
import Sidebar from '../components/Sidebar'
import Tools from '../components/Tools'
import CircularProgressBar from '../components/CircularProgressBar';
import Graph from "../components/Graph";

//> Style - CSS Files 
import '../styles/platform.css'
import "../styles/header.css"

export default function Dashboard() {

   return (
      <div>
         <Sidebar />
         <section id="main" className="d-flex">
            <div className="container-fluid">
               <div className="row justify-content-center">
                  <div className="col-xl-6 col-lg-6 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column">
                     <h3>Dashboard</h3>
                     <div className="row">
                        <div className="col text-center">
                           <div className='stats'>
                              <CircularProgressBar value='0' divider='10' symbol='$' />
                              <div className='barTitle'>Balance</div>
                           </div>
                        </div>
                        <div className="col text-center">
                           <div className='stats'>
                              <CircularProgressBar value='0' divider='10' symbol='' />
                              <div className='barTitle'>Performance</div>
                           </div>
                        </div>
                        <div className="col text-center ">
                           <div className='stats'>
                              <CircularProgressBar value='0' divider='10' symbol='$' />
                              <div className='barTitle'>Rewards</div>
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

         <section id="secondary" >
            <div className="container-fluid">
               <div className="row justify-content-center" >
                  <div className="col-xl-9 col-lg-8 d-flex flex-column">
                     <h3>Performance</h3>
                     <div><Graph /></div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   )
}
