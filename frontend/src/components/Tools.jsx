/*======================================================================*/
/*                         IMAGE MAPPER - TOOLS                         */
/*======================================================================*/

//> Modules and Dependecies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageMapper from 'react-img-mapper';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

//> Components
import AgentForm from '../modals/AgentForm';
import AgentLmUpdate from '../modals/AgentLmUpdate';
import AgentPmmUpdate from '../modals/AgentPmmUpdate';
import ExchangeForm from '../modals/ExchangeForm';
import Agents from '../modals/Agents';
import Exchanges from '../modals/Exchange';

//> Style - CSS Files
import "../styles/modal.css"

//> Icons
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';

export default function Tools() {

   const [agents, setAgents] = useState(false);
   const [agentForm, setAgentForm] = useState(false);
   const [agentLmUpdate, setAgentLmUpdate] = useState(false);
   const [agentPmmUpdate, setAgentPmmUpdate] = useState(false);

   const [agentId, setAgentId] = useState('');
   const [agentLmStrategy, setAgentLmStrategy] = useState('');
   const [agentPmmStrategy, setAgentPmmStrategy] = useState('');

   const [exchanges, setExchanges] = useState(false);
   const [exchangeForm, setExchangeForm] = useState(false);


   const openAgentLmUpdate = (strategy, id) => {
      setAgentLmStrategy(strategy);
      setAgentId(id);
      setAgentLmUpdate(true);
      setAgents(false);
   }
   const closeAgentLmUpdate = () => {
      setAgents(true);
      setAgentLmUpdate(false);
   };

   const openAgentPmmUpdate = (strategy, id) => {
      setAgentPmmStrategy(strategy);
      setAgentId(id);
      setAgentPmmUpdate(true);
      setAgents(false);
   }
   const closeAgentPmmUpdate = () => {
      setAgents(true);
      setAgentPmmUpdate(false);
   };

   const openAgentForm = () => {
      setAgents(false);
      setAgentForm(true);
   };
   const openExchangeForm = () => {
      setExchanges(false);
      setExchangeForm(true);
   };
   const closeAgentForm = () => {
      setAgents(true);
      setAgentForm(false);
   };
   const closeExchangeForm = () => {
      setExchanges(true);
      setExchangeForm(false);
   };


   const navigate = useNavigate()
 
   const handleAreaClick = (area) => {
      if (area.name === 'Agents') {
         setAgents(true);
      } else if (area.name === 'Exchanges') {
         setExchanges(true);
      } else if (area.name === 'Monitor') {
         navigate("/monitor")
      }
   };

   const MAP = {
      name: 'my-map',

      areas: [
         { name: "Agents", shape: "poly", coords: [9, 81, 149, 1, 289, 81, 149, 161], fillColor: 'rgba(255, 255, 255, 0.2)', strokeColor: 'rgba(0,0,0, 0)' },
         { name: "Exchanges", shape: "poly", coords: [4, 91, 4, 253, 144, 334, 144, 174], fillColor: 'rgba(255, 255, 255, 0.2)', strokeColor: 'rgba(0,0,0, 0)' },
         { name: "Monitor", shape: "poly", coords: [157, 171, 157, 334, 297, 254, 297, 92], fillColor: 'rgba(255, 255, 255, 0.2)', strokeColor: 'rgba(0,0,0, 0)' },
      ]
   };

   return (
      <div>
         <ImageMapper src="assets/img/other/tools.png" map={MAP} onClick={handleAreaClick} />

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agents} onHide={() => setAgents(false)}>
            <Modal.Header className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Agents</h5>
            </Modal.Header>
            <Modal.Body>
               <Agents openAgentLmUpdate={openAgentLmUpdate} openAgentPmmUpdate={openAgentPmmUpdate} />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={openAgentForm} className="modal-add-btn"><span>Create Agent</span></Button>
            </Modal.Footer>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentForm} onHide={() => setAgentForm(false)}>
            <Modal.Header className="d-flex justify-content-between">
               <div>
                  <h5 className='modal-title'>Create Agent</h5>
               </div>
               <div>
                  <button onClick={() => closeAgentForm()} className="btn-modal-nav"> <IoMdArrowBack /></button>
                  <button onClick={() => setAgentForm(false)} className="btn-modal-nav"> <IoMdClose /></button>
               </div>
            </Modal.Header>
            <Modal.Body>
               <AgentForm closeAgentForm={closeAgentForm} mode='tools' />
            </Modal.Body>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentLmUpdate} onHide={() => setAgentLmUpdate(false)}>
            <Modal.Header className="d-flex justify-content-between">
               <div>
                  <h5 className='modal-title'>Update Agent</h5>
               </div>
               <div>
                  <button onClick={() => closeAgentLmUpdate()} className="btn-modal-nav"> <IoMdArrowBack /></button>
                  <button onClick={() => setAgentLmUpdate(false)} className="btn-modal-nav"> <IoMdClose /></button>
               </div>
            </Modal.Header>
            <Modal.Body>
               <AgentLmUpdate agentStrategy={agentLmStrategy} agentId={agentId} closeAgentUpdate={closeAgentLmUpdate} />
            </Modal.Body>
         </Modal>

         <Modal className='platformModal' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={agentPmmUpdate} onHide={() => setAgentPmmUpdate(false)}>
            <Modal.Header className="d-flex justify-content-between">
               <div>
                  <h5 className='modal-title'>Update Agent</h5>
               </div>
               <div>
                  <button onClick={() => closeAgentPmmUpdate()} className="btn-modal-nav"> <IoMdArrowBack /></button>
                  <button onClick={() => setAgentPmmUpdate(false)} className="btn-modal-nav"> <IoMdClose /></button>
               </div>
            </Modal.Header>
            <Modal.Body>
               <AgentPmmUpdate agentStrategy={agentPmmStrategy} agentId={agentId} closeAgentUpdate={closeAgentPmmUpdate} />
            </Modal.Body>
         </Modal>


         <Modal className='platformModal' size="md" aria-labelledby="contained-modal-title-vcenter" centered show={exchanges} onHide={() => setExchanges(false)}>
            <Modal.Header className="btn-close-dark" closeButton>
               <h5 className='modal-title'>Exchanges</h5>
            </Modal.Header>
            <Modal.Body>
               <Exchanges />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={openExchangeForm} className="modal-add-btn"><span>Connect An Exchange</span></Button>
            </Modal.Footer>
         </Modal>

         <Modal className='platformModal' size="md" aria-labelledby="contained-modal-title-vcenter" centered show={exchangeForm} onHide={() => setExchangeForm(false)}>
            <Modal.Header>
               <div>
                  <h5 className='modal-title'>Connect Exchange</h5>
               </div>
               <div>
                  <button onClick={() => closeExchangeForm()} className="btn-modal-nav"> <IoMdArrowBack /></button>
                  <button onClick={() => setExchangeForm(false)} className="btn-modal-nav"> <IoMdClose /></button>
               </div>
            </Modal.Header>
            <Modal.Body>
               <ExchangeForm closeExchangeForm={closeExchangeForm} />
            </Modal.Body>
         </Modal>
      </div >

   )
}