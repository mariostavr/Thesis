/*======================================================================*/
/*                                API CALLS                             */
/*======================================================================*/



//--------------------------------------------------> CoinRep
//> Get User Profile
export async function getUserProfile(userToken) {
   const requestOptions = {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer " + userToken,
      },
   };
   const response = await fetch("/users/profile", requestOptions);
   if (!response.ok) {
      console.log("Something went wrong. Couldn't load profile");
   } else {
      const data = await response.json();
      return data;
   }
};


//> Get All Agents
export async function getAgents(userToken) {
   const requestOptions = {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer " + userToken,
      },
   };
   const response = await fetch("/agents", requestOptions);
   if (!response.ok) {
      console.log("Something went wrong. Couldn't load the agents");
   } else {
      const data = await response.json();
      return data;
   }
};


//> Get Agent By ID
export async function getAgent(userToken, agent_id, agent_type) {
   const requestOptions = {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer " + userToken,
      },
   };
   const response = await fetch(`/${agent_type}agents/${agent_id}`, requestOptions);
   if (!response.ok) {
      console.log("Something went wrong. Couldn't load the agent");
   } else {
      const data = await response.json();
      return data;
   }
};



//--------------------------------------------------> Docker
//> Status Existing Instance
export async function status_instance(container_name, userToken) {
   try {
      const response = await fetch(`/status/${container_name}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + userToken,
         },
         body: JSON.stringify({})
      });
      if (response.ok) {
         const data = await response.json()
         return data.status
      }
   } catch (error) {
      console.error(error)
   }
}


//> Start Existing Instance
export async function start_instance(container_name, userToken) {
   try {
      const response = await fetch(`/start/${container_name}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + userToken,
         },
         body: JSON.stringify({})
      });
      if (!response.ok) {
         const errorMessage = await response.text();
         throw new Error(errorMessage);
      }
   } catch (error) {
      console.error(error)
   }
}


//> Stop Existing Instance
export async function stop_agent_instance(container_name, userToken) {
   try {
      const response = await fetch(`/stop/${container_name}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + userToken,
         },
         body: JSON.stringify({})
      });

      if (!response.ok) {
         const errorMessage = await response.text();
         throw new Error(errorMessage);
      }
   } catch (error) {
      console.error(error)
   }
}


//> Remove Existing Instance
export async function remove_instance(instance_id, userToken) {
   try {
      const response = await fetch(`/instance/${instance_id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
         },
         body: JSON.stringify({})
      });

      if (!response.ok) {
         const errorMessage = await response.text();
         throw new Error(errorMessage);
      }
   } catch (error) {
      console.error(error);
   }
}



//--------------------------------------------------> Docker Hummingbot
//> Get Instances
export async function getInstance(userToken) {
   const requestOptions = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: "Bearer " + userToken,
      },
   };
   const response = await fetch("/instances", requestOptions);
   if (!response.ok) {
      console.log("Error fetching instances");
   } else {
      const data = await response.json();
      return data;
   }
}


//> Get Instance ID
export async function getInstanceID(containerName, userToken) {
   const requestOptions = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: "Bearer " + userToken,
      },
   };
   const response = await fetch(`/id/${containerName}`, requestOptions);
   if (!response.ok) {
      console.log("Error fetching instance ID");
   } else {
      const data = await response.json();
      return data;
   }
}



//--------------------------------------------------> Hummingbot
//> Get All Markets
export async function getMarkets() {
   const requestOptions = {
      method: "GET",
   };
   const response = await fetch("/markets", requestOptions);
   if (!response.ok) {
      console.log("Error fetching markets data");
   } else {
      const data = await response.json();
      return data;
   }
}

export async function getDexMarkets() {
   const requestOptions = {
      method: "GET",
   };
   const response = await fetch("/dexmarkets", requestOptions);
   if (!response.ok) {
      console.log("Error fetching dex markets data");
   } else {
      const data = await response.json();
      return data;
   }
}

//> Get Top 5 Markets
export async function getTopMarkets() {
   const data = await getMarkets();
   const topMarkets = data.markets.sort((a, b) => b.last_hour_bots - a.last_hour_bots);
   return topMarkets.slice(0, 5);
}


//> Get Top 5 Markets and Overall Stats
export async function getStatsnPop() {
   const data = await getMarkets();
   const topMarkets = data.markets.sort((a, b) => b.last_hour_bots - a.last_hour_bots).slice(0, 5);

   let total_active_bots = 0;
   for (let market of data.markets) {
      total_active_bots += market.last_hour_bots;
   }

   const exchanges = new Set();
   data.markets.forEach(market => {
      exchanges.add(market.exchange_name.toUpperCase());
   });

   return {
      data,
      topMarkets,
      total_active_bots,
      exchanges: Array.from(exchanges)
   };
}

//> Get Market
export async function getMarket(base_asset, quote_asset, exchange) {
   const requestOptions = {
      method: "GET",
   };
   const response = await fetch(`/market?base_asset=${base_asset}&quote_asset=${quote_asset}&exchange=${exchange}`, requestOptions);
   if (!response.ok) {
      console.log("Error fetching markets data");
   } else {
      const data = await response.json();
      return data;
   }
}

//> Get Market Snapshot
export async function getMarketSnapshot(market_id, interval) {
   const requestOptions = {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   };
   const response = await fetch(`/market/${market_id}/snapshot/${interval}`, requestOptions);
   if (!response.ok) {
      console.log("Something went wrong. Couldn't load data");
   } else {
      const data = await response.json();
      return data;
   }
};


//> Stop Broker Instance
export async function stop_broker_instance(userToken) {
   try {
      const response = await fetch(`/broker/stop`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + userToken,

         },
         body: JSON.stringify({})
      });
      if (!response.ok) {
         const errorMessage = await response.text();
         throw new Error(errorMessage);
      }
   } catch (error) {
      console.error(error);
   }
}