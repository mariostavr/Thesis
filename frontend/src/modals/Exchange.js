/*======================================================================*/
/*				   	   		   MODAL - Exchanges         						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useEffect, useState } from "react";

//> Components
import { UserContext } from "../components/shared/UserContext";

//> Style - CSS Files
import "../styles/modal.css"

//> Icons
import { FaTrash } from "react-icons/fa";

export default function Exchange () {

   const [token] = useContext(UserContext);

   //> Fetch Exchanges 
   const [exchanges, setExchanges] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const [loaded, setLoaded] = useState(false);

   async function getExchanges () {
      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
         },
      };
      const response = await fetch("/exchanges", requestOptions);
      if (response.ok) {
         const data = await response.json();
         setExchanges(data);
         setLoaded(true);
      } else {
         setErrorMessage("Something went wrong. Couldn't load the exchanges");
      }
   };
   useEffect(() => {
      getExchanges();
      // eslint-disable-next-line
   }, []);



   //> Delete Wallet
   async function handleDelete (id) {
      const requestOptions = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
         },
      };
      const response = await fetch(`/exchanges/${id}`, requestOptions);
      if (response.ok){
         getExchanges();
      }
      else{
         setErrorMessage("Failed to delete wallet");
      }
   };


   return (
      <div className="content-list">
         <div style={{ marginTop: "30px", color: "red" }}>
            {errorMessage && errorMessage}
         </div>
         {loaded ? (
            exchanges && exchanges.length > 0 ? (
               <ul className="list-group">
                  {exchanges.map((exchange) => (
                     <li key={exchange.id} className="list-item d-flex justify-content-between align-items-center">
                        {exchange.name.toUpperCase()}
                        <div className="interaction-container">
                           <button onClick={() => handleDelete(exchange.id)} className="interaction-btn negative"><FaTrash /></button>
                        </div>
                     </li>
                  ))}
               </ul>
            ) : (
               <p style={{ color: "black" }}>There are not any exchanges added yet</p>
            )
         ) : (
            <p>Loading...</p>
         )}
      </div>
   );
};