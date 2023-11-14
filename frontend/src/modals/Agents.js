/*======================================================================*/
/*				   	   		    MODAL - AGENTS       		   				*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useEffect, useState } from "react";
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

//> Components
import { UserContext } from "../components/shared/UserContext";

//> Style - CSS Files
import "../styles/modal.css"

//> Icons
import { FaTrash, FaSlidersH } from 'react-icons/fa'
import { MdMonitor } from "react-icons/md";

export default function Agents({ openAgentLmUpdate, openAgentPmmUpdate }) {

   const [userAccessToken] = useContext(UserContext);

   const [lmAgents, setLMAgents] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const [lmloaded, setLmLoaded] = useState(false);

   async function getLMAgents() {
      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userAccessToken,
         },
      };
      const response = await fetch("/agents/lm", requestOptions);
      if (response.ok) {
         const data = await response.json();
         setLMAgents(data);
         setLmLoaded(true);
      } else {
         setErrorMessage("Something went wrong. Couldn't load the agents");
      }
   };
   useEffect(() => {
      getLMAgents();
      // eslint-disable-next-line
   }, []);


   const [pmmAgents, setPMMAgents] = useState(null);
   const [pmmloaded, setPMMLoaded] = useState(false);

   async function getPMMAgents() {
      const requestOptions = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userAccessToken,
         },
      };
      const response = await fetch("/agents/pmm", requestOptions);
      if (response.ok) {
         const data = await response.json();
         setPMMAgents(data);
         setPMMLoaded(true);
      } else {
         setErrorMessage("Something went wrong. Couldn't load the agents");
      }
   };
   useEffect(() => {
      getPMMAgents();
      // eslint-disable-next-line
   }, []);


   //> Delete Agent
   async function handleDelete(strategy, id) {
      const requestOptions = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userAccessToken,
         },
      };

      const response = await fetch(`/agent/${strategy}/${id}`, requestOptions);

      if (response.ok) {
         getLMAgents();
         getPMMAgents();
      } else {
         setErrorMessage("Failed to delete agent");
      }
   };


   //> Update LM Agent
   async function handleUpdateAgent(strategy, id) {
      if (strategy === 'liquidity_mining') {
         openAgentLmUpdate(strategy, id);
      } else if (strategy === 'pure_market_making') {
         openAgentPmmUpdate(strategy, id);
      }
   };

   const navigate = useNavigate();
   const navigateToMonitor = (agentId, strategy, market, exchange) => {
      navigate(`/monitor`, {
         state: {
            agentId,
            strategy,
            market,
            exchange
         },
      });
   };
   const [activeButton, setActiveButton] = useState("Liquidity Mining");

   function isAgentActive(agent) {
      const key = `${agent.strategy}_${agent.id}`;
      const localStorageData = JSON.parse(localStorage.getItem(key));
      return (localStorageData === true);
   };

   return (
      <div className="content-list">
         <div>
            <button className={`agent-btn ${activeButton === "Liquidity Mining" ? "active" : ""}`}
               onClick={() => setActiveButton("Liquidity Mining")}>
               Liquidity Mining
            </button>
            <button className={`agent-btn ${activeButton === "Pure Market Making" ? "active" : ""}`}
               onClick={() => setActiveButton("Pure Market Making")}>
               Pure Market Making
            </button>
         </div>
         <div style={{ marginTop: "30px", color: "black" }}>
            {errorMessage && errorMessage}
         </div>
         <Card className="custom-scroll" style={{ border: "none" }}>
            <Card.Body style={{ height: "300px" }}>
               <div className="agents-container">
                  {activeButton === "Liquidity Mining" && lmloaded ? (
                     <>
                        {lmAgents && lmAgents.length > 0 ? (
                           <ul className="list-group">
                              {lmAgents.map((agent, index) => (
                                 <li key={index} className="list-item d-flex justify-content-between align-items-center">
                                    <div>
                                       <span className="agent-text">{agent.filename} </span>
                                       <span className="agent-info">{agent.strategy} - {agent.market} - {agent.exchange}</span>
                                    </div>
                                    <div className="interaction-container">
                                       <div style={{ paddingRight: "30px" }}>
                                          {isAgentActive(agent) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>}
                                       </div>
                                       <button
                                          title="Navigate to Monitor"
                                          className="interaction-btn neutral"
                                          onClick={() => {
                                             navigateToMonitor(agent.id, agent.strategy, agent.market, agent.exchange);
                                          }}
                                       >
                                          <MdMonitor />
                                       </button>
                                       <button title="Update" onClick={() => handleUpdateAgent(agent.strategy, agent.id)} className="interaction-btn neutral"><FaSlidersH /></button>
                                       <button title="Delete" onClick={() => handleDelete(agent.strategy, agent.id)} className="interaction-btn negative"><FaTrash /></button>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        ) : (
                           <p style={{ color: "black" }}>There are no Liquidity Mining agents created yet</p>
                        )}
                     </>
                  ) : activeButton === "Pure Market Making" && pmmloaded ? (
                     <>
                        {pmmAgents && pmmAgents.length > 0 ? (
                           <ul className="list-group">
                              {pmmAgents.map((agent, index) => (
                                 <li key={index} className="list-item d-flex justify-content-between align-items-center">
                                    <div>
                                       <span className="agent-text">{agent.filename} </span>
                                       <span className="agent-info">{agent.strategy} - {agent.market} - {agent.exchange}</span>
                                    </div>
                                    <div className="interaction-container">
                                       <div style={{ paddingRight: "30px" }}>
                                          {isAgentActive(agent) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>}
                                       </div>
                                       <button
                                          title="Navigate to Monitor"
                                          className="interaction-btn neutral"
                                          onClick={() => {
                                             navigateToMonitor(agent.id, agent.strategy, agent.market, agent.exchange);
                                          }}
                                       >
                                          <MdMonitor />
                                       </button>
                                       <button title="Update" onClick={() => handleUpdateAgent(agent.strategy, agent.id)} className="interaction-btn neutral"><FaSlidersH /></button>
                                       <button title="Delete" onClick={() => handleDelete(agent.strategy, agent.id)} className="interaction-btn negative"><FaTrash /></button>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        ) : (
                           <p style={{ color: "black" }}>There are no Pure Market Making agents created yet</p>
                        )}
                     </>
                  ) : (
                     <p style={{ color: "black" }}>Loading</p>
                  )}
               </div>
            </Card.Body>
         </Card>
      </div>
   );
};