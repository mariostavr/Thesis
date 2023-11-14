/*======================================================================*/
/*				   	   		COMPONENTS - HEADER       							*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState } from 'react'

//> Style 
import '../styles/header.css';

//> Icons
import { FaBars } from "react-icons/fa";

export default function Header() {

   //> ---------------------------------------- < Header On Scroll >
   const [color, setColor] = useState(false)
   const changeColor = () => {
      if (window.scrollY >= 90) {
         setColor(true)
      } else {
         setColor(false)
      }
   }
   window.addEventListener('scroll', changeColor)


   //> ---------------------------------------- < Toggle Navbar >
   const [showNav, setShowNav] = useState(false);

   const toggleNav = () => {
      setShowNav(!showNav);
   };

   return (
      <>
         <header className={color ? 'colored-header fixed-top' : 'header fixed-top'}>
            <div className="container d-flex align-items-center justify-content-between">
               <h1 className="header-logo">
                  <a href="#home">
                     <img src="assets/img/logo/logo.png" alt="logo" />Coinrep
                  </a>
               </h1>
               <nav id="navbar" className={`navbar ${showNav ? 'show' : ''}`}>
                  <ul>
                     <li>
                        <a href="#about">About</a>
                     </li>
                     <li>
                        <a href="#statistics">Statistics</a>
                     </li>
                     <li>
                        <a href="#popularMarkets">Markets</a>
                     </li>
                     <li>
                        <a href="#how">How It Works</a>
                     </li>
                  </ul>
               </nav>
               <button className="nav-toggle" onClick={toggleNav}>
                  <i className={showNav ? 'show' : ''}>
                     <FaBars />
                  </i>
               </button>
            </div>
         </header>
      </>
   )
}