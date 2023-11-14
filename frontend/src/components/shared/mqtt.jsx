/*======================================================================*/
/*                                  MQTT                                */
/*======================================================================*/

//> Modules and Dependecies
import { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';


export default function MQTT() {

   const [client, setClient] = useState();
   const [messages, setMessages] = useState([]);
   const [event, setEvent] = useState([]);
   const [eventData, setEventData] = useState([]);

   const [totalBidOrders, setTotalBidOrders] = useState(0);
   const [totalAskOrders, setTotalAskOrders] = useState(0);
   const [totalCanceledAskOrders, setTotalCanceledAskOrders] = useState(0);
   const [totalCanceledBidOrders, setTotalCanceledBidOrders] = useState(0);
   const [totalFilledAskOrders, setTotalFilledAskOrders] = useState(0);
   const [totalFilledBidOrders, setTotalFilledBidOrders] = useState(0);

   const [pnl, setPnl] = useState(0.00);
   const [totalPnl, setTotalPnl] = useState(0.00);

function clearMessagesAndData() {
   event.length = 0;
   messages.length = 0;
   eventData.length = 0;
   setTotalBidOrders(0);
   setTotalAskOrders(0);
   setTotalCanceledAskOrders(0);
   setTotalCanceledBidOrders(0);
   setTotalFilledAskOrders(0);
   setTotalFilledBidOrders(0);
   setPnl(0.00);
   setTotalPnl(0.00);
}

useEffect(() => {
   const newClient = new Client('ws://localhost:8083/mqtt', 'clientId');
   setClient(newClient);

   newClient.onMessageArrived = (message) => {

      const payload = JSON.parse(message.payloadString);

      const incomingMessages = {
         time: new Date().toLocaleTimeString("en-US"),
         msg: payload.msg,
      }

      if (message.destinationName.endsWith('/log')) {
         setMessages((prevLogs) => [...prevLogs, incomingMessages]);
      } else if (message.destinationName.endsWith('/notify')) {
         setPnl((prevPnl) => pnl);
         setTotalPnl((prevTotalPnl) => totalPnl);
         setMessages((prevNotifyMessages) => [...prevNotifyMessages, incomingMessages]);

      } else if (message.destinationName.endsWith('/events')) {
         const eventObject = {
            timestamp: payload.timestamp,
            type: payload.type,
            trading_pair: payload.data.trading_pair,
            amount: payload.data.amount,
            price: payload.data.price,
            equal: payload.data.price * payload.data.amount,
         };

         if (payload.type === 'SellOrderCreated') {
            setEventData((prevEventData) => [...prevEventData, eventObject])
            setTotalAskOrders((prevTotalAskOrders) => prevTotalAskOrders + 1);
         }
         else if (payload.type === 'BuyOrderCreated') {
            setEventData((prevEventData) => [...prevEventData, eventObject]);
            setTotalBidOrders((prevTotalBidOrders) => prevTotalBidOrders + 1);
         }
         else if ((payload.type === 'OrderCancelled') && (payload.data.order_id.startsWith('buy'))) {
            setTotalCanceledBidOrders((prevTotalCanceledBidOrders) => prevTotalCanceledBidOrders + 1);
         }
         else if ((payload.type === 'OrderCancelled') && (payload.data.order_id.startsWith('sell'))) {
            setTotalCanceledAskOrders((prevTotalCanceledAskOrders) => prevTotalCanceledAskOrders + 1);
         }
         else if ((payload.type === 'OrderedFilled') && (payload.data.order_id.startsWith('buy'))) {
            setTotalFilledBidOrders((prevTotalFilledBidOrders) => prevTotalFilledBidOrders + 1);
         }
         else if ((payload.type === 'OrderedFilled') && (payload.data.order_id.startsWith('sell'))) {
            setTotalFilledAskOrders((prevTotalFilledAskOrders) => prevTotalFilledAskOrders + 1);
         }
         setEvent((prevEventMessages) => [...prevEventMessages, payload.type]);
      }
   };

   return () => {
      if (newClient.isConnected()) {
         newClient.disconnect();
      }
   };
}, []);


async function cmdConnect(id) {
   if (client) {
      client.connect({
         onSuccess: function () {
            console.log('MQTT Bridge connected with success.');
            client.subscribe(`hbot/${id}/log`, {
               onSuccess: function () {
                  console.log('Subscribed to "Log" topic');
               },
            });

            client.subscribe(`hbot/${id}/notify`, {
               onSuccess: function () {
                  console.log('Subscribed to "Notify" topic');
               },
            });

            client.subscribe(`hbot/${id}/events`, {
               onSuccess: function () {
                  console.log('Subscribed to "Events" topic');
               },
            });
         },
         onFailure: function (error) {
            console.error('MQTT connection failed:', error);
         },
      });
   }
};

async function cmdDisconnect() {
   if (client && client.isConnected()) {
      client.disconnect();
      console.log('MQTT Bridge disconnected.');
   }
};

async function cmdStatus(id) {
   if (client && client.isConnected()) {
      const payload = JSON.stringify({
         header: {
            reply_to: '/status',
            timestamp: Date.now(),
         },
         data: {},
      });
      const topic = `hbot/${id}/status`;
      client.publish(topic, payload, 1);
      console.log('Command "status" sent.');
   }
};

async function cmdHistory(id) {
   if (client && client.isConnected()) {
      const payload = JSON.stringify({
         header: {
            reply_to: '/history',
            timestamp: Date.now(),
         },
         data: { "days": 7.0, "verbose": true, "precision": 1 },
      });
      const topic = `hbot/${id}/history`;
      client.publish(topic, payload, 1);
      console.log('Command "history" sent.');
   }
};

async function cmdImport(id, strategy, exchange, markets) {
   try {
      if (client && client.isConnected()) {
         const payload = JSON.stringify({
            header: {
               reply_to: '/import',
               timestamp: Date.now(),
            },
            data: {
               strategy: strategy + "_" + exchange + "_" + markets,
            },
         });
         const topic = `hbot/${id}/import`;
         client.publish(topic, payload, 1);
         console.log('Command "Import" sent.');
      }
   } catch (error) {
      console.error("Error fetching agent:", error);
   }
};

async function cmdStart(id) {
   if (client && client.isConnected()) {
      const payload = JSON.stringify({
         header: {
            reply_to: '/startmsg',
            timestamp: Date.now(),
         },
         data: {
            log_level: 'DEBUG',
            restore: true,
            //script: 'filename',
            is_quickstart: true,
         },
      });
      const topic = `hbot/${id}/start`;
      client.publish(topic, payload, 1);
      console.log('Command "start" sent.');
   }
};

async function cmdStop(id) {
   if (client && client.isConnected()) {
      const payload = JSON.stringify({
         header: {
            reply_to: '/stopmsg',
            timestamp: (Date.now()),
         },
         data: {
            skip_order_cancellation: false,
         },
      });
      const topic = `hbot/${id}/stop`;
      client.publish(topic, payload, 1);
      console.log('Command "stop" sent.');
   }
};

return {
   event,
   messages,
   eventData,
   totalBidOrders,
   totalAskOrders,
   totalCanceledAskOrders,
   totalCanceledBidOrders,
   totalFilledAskOrders,
   totalFilledBidOrders,
   totalPnl,
   pnl,
   clearMessagesAndData,
   cmdConnect,
   cmdDisconnect,
   cmdStatus,
   cmdHistory,
   cmdImport,
   cmdStart,
   cmdStop,
};
}

