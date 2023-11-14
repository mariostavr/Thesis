/*======================================================================*/
/*				   	   		   PAGES - DASHBOARD       						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Card } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

//> Components 
import Sidebar from '../components/Sidebar'
import AgentForm from '../modals/AgentForm';
import AgentLmUpdate from '../modals/AgentLmUpdate';
import AgentPmmUpdate from '../modals/AgentPmmUpdate';
import { UserContext } from "../components/shared/UserContext";

//> Style - CSS Files 
import '../styles/platform.css'
import "../styles/header.css"

//> Icons
import { FaTrash, FaSlidersH } from 'react-icons/fa'
import { MdMonitor } from "react-icons/md";
import { IoMdClose } from 'react-icons/io';


export default function AgentsPage() {

  const [userAccessToken] = useContext(UserContext);

  //> Fetch Agents
  const [lmAgents, setLMAgents] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [lmloaded, setLmLoaded] = useState(false);

  const [agentId, setAgentId] = useState('');

  const [agentForm, setAgentForm] = useState(false);
  const [agentLmUpdate, setAgentLmUpdate] = useState(false);
  const [agentPmmUpdate, setAgentPmmUpdate] = useState(false);

  function closeAgentLmUpdate() {
    setAgentLmUpdate(false)
  }

  function closeAgentPmmUpdate() {
    setAgentPmmUpdate(false)
  }

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
  }, [agentForm]);


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
  }, [agentForm]);

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

  function openAgentForm() {
    setAgentForm(true);
  };
  function closeAgentForm() {
    setAgentForm(false)
  };

  function openAgentLmUpdate(strategy, id) {
    setAgentId(id);
    setAgentLmUpdate(true);
  }

  function openAgentPmmUpdate(strategy, id) {
    setAgentId(id);
    setAgentPmmUpdate(true);
  }

  function handleUpdateAgent(strategy, id) {
    if (strategy === 'liquidity_mining') {
      openAgentLmUpdate(strategy, id);
    } else if (strategy === 'pure_market_making') {
      openAgentPmmUpdate(strategy, id);
    }
  };

  //> Delete Agent
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

  function isAgentActive(agent) {
    const key = `${agent.strategy}_${agent.id}`;
    const localStorageData = JSON.parse(localStorage.getItem(key));
    return (localStorageData === true);
  };

  return (
    <div>
      <Sidebar />
      <section id="main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-11 col-lg-10 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column">
              <div className="d-flex justify-content-between">
                <h3 style={{ color: "black" }}>Agents</h3>
                <Button onClick={openAgentForm} className="modal-add-btn"><span>Create Agent</span></Button>
              </div>
              <div className="content-list">
                <div style={{ marginTop: "30px", color: "white" }}>
                  {errorMessage && errorMessage}
                </div>
                <Card className="custom-scroll" style={{ marginTop: "30px" }}>
                  <Card.Body style={{ height: "350px" }}>
                    <h5 style={{ color: "black", marginBottom: "20px" }}>Liquidity Mining</h5>
                    {lmloaded && lmAgents && lmAgents.length > 0 ? (
                      <ul className="list-group">
                        {lmAgents.map((agent, index) => (
                          <li
                            key={index}
                            className={`list-item d-flex justify-content-between align-items-center`}
                          >
                            <div>
                              <span className="agent-name">{agent.filename}</span>
                              <span className="agent-info">
                                {agent.strategy.replace(/_/g, ' ')} - {agent.market} - {agent.exchange.replace(/_/g, ' ')}
                              </span>
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
                  </Card.Body>
                </Card>
                <Card className="custom-scroll" style={{ marginTop: "50px" }}>
                  <Card.Body style={{ height: "350px" }}>
                    <h5 style={{ color: "black", marginBottom: "20px" }}>Pure Market Making</h5>
                    {pmmloaded && pmmAgents && pmmAgents.length > 0 ? (
                      <ul className="list-group">
                        {pmmAgents.map((agent, index) => (
                          <li
                            key={index}
                            className={`list-item d-flex justify-content-between align-items-center`}
                          >
                            <div>
                              <span className="agent-name">{agent.filename}</span>
                              <span className="agent-info">
                                {agent.strategy.replace(/_/g, ' ')} - {agent.market} - {agent.exchange.replace(/_/g, ' ')}
                              </span>
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
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentForm} onHide={() => setAgentForm(false)}>
        <Modal.Header className="d-flex justify-content-between">
          <div>
            <h5 className='modal-title'>Create Agent</h5>
          </div>
          <div>
            <button onClick={() => setAgentForm(false)} className="btn-modal-nav"> <IoMdClose /></button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <AgentForm mode='tools' closeAgentForm={closeAgentForm} />
        </Modal.Body>
      </Modal>


      <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentLmUpdate} onHide={() => setAgentLmUpdate(false)}>
        <Modal.Header className="d-flex justify-content-between">
          <div>
            <h5 className='modal-title'>Update Agent</h5>
          </div>
          <div>
            <button onClick={() => setAgentLmUpdate(false)} className="btn-modal-nav"> <IoMdClose /></button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <AgentLmUpdate agentId={agentId} closeAgentUpdate={closeAgentLmUpdate} />
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentPmmUpdate} onHide={() => setAgentPmmUpdate(false)}>
        <Modal.Header className="d-flex justify-content-between">
          <div>
            <h5 className='modal-title'>Update Agent</h5>
          </div>
          <div>
            <button onClick={() => setAgentPmmUpdate(false)} className="btn-modal-nav"> <IoMdClose /></button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <AgentPmmUpdate agentId={agentId} closeAgentUpdate={closeAgentPmmUpdate} />
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </div >
  );
}