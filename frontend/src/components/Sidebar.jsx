/*======================================================================*/
/*				   	   		COMPONENTS - SIDEBAR       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

//> Components
import { UserContext } from "../components/shared/UserContext";

//> Api Calls
import { stop_broker_instance } from "../components/shared/apiCalls";

//> Style - CSS Files
import '../styles/sidebar.css';

//> Icons - FontAwesome
import { FaCoins, FaMagento } from 'react-icons/fa';
import { MdMonitor } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { ImHome } from "react-icons/im";

export default function Sidebar() {

   const [userAccessToken, setUserAccessToken] = useContext(UserContext);

   const navigate = useNavigate();

   function handleLogout() {
      stop_broker_instance(userAccessToken)
      setUserAccessToken(null)
      navigate("/")
   };

   return (
      <div className="sidebar">
         <div className="sidebar-header text-center">
            <div className="logo img">
               <img src="assets/img/logo/logo.png" alt="logo" />
               <h2>Coinrep</h2>
            </div>
         </div>
         <div>
            <nav className="nav-menu">
               <ul>
                  <li><a href='/home' className="nav-link"><i><ImHome /></i><span className="nav-text">Home</span></a></li>
                  <li><a href='/agents' className="nav-link"><i><FaMagento /></i><span className="nav-text">Agents</span></a></li>
                  <li><a href='/markets' className="nav-link"><i><FaCoins /></i><span className="nav-text">Markets</span></a></li>
                  <li><a href='/monitor' className={`nav-link`}><i><MdMonitor /></i><span className="nav-text">Monitor</span></a></li>
               </ul>
            </nav>
         </div>

         <div className='d-flex logout'>
            {userAccessToken && (
               <>
                  <button className='btn-logout' onClick={handleLogout}><i><RiLogoutCircleLine /></i><span className="nav-text">Log Out</span></button>
               </>
            )}
         </div>
      </div>
   )
}