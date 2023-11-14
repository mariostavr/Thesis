/*======================================================================*/
/*				   	   		    MODAL - MARKET       		   				*/
/*======================================================================*/

//> Libraries and Modules
import React, { useEffect, useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { ScaleLoader } from 'react-spinners'

//> API Calls
import { getMarketSnapshot } from '../components/shared/apiCalls';

export default function MarketSnapshot({ selectedMarketId }) {

   const [marketSnapshot, setMarketSnapshot] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [chartInterval] = useState("1");

   useEffect(() => {
      const fetchMarketSnapshot = async () => {
         try {
            const { data } = await getMarketSnapshot(selectedMarketId, chartInterval);
            setMarketSnapshot(data);
            setIsLoading(false);
         } catch (error) {
            console.log(error);
            setIsLoading(false);
         }
      };

      if (selectedMarketId) {
         fetchMarketSnapshot();
      }
   }, [selectedMarketId, chartInterval]);


   const dataSnapshot = marketSnapshot.map((market) => {
      return {
         Price: market.price,
         Ask: market.ask,
         Bid: -market.bid,
         Ask_Spread: market.spread_ask,
         Bid_Spread: -market.spread_bid,
         Liquidity: market.liquidity
      };
   });

   const priceSum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Price, 0);
   const priceAvg = (priceSum / dataSnapshot.length).toFixed(8)

   const liquiditySum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Liquidity, 0);
   const liquidityAvg = (liquiditySum / dataSnapshot.length).toFixed(8)

   const askSum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Ask, 0);
   const askAvg = (askSum / dataSnapshot.length).toFixed(8)

   const askSpreadSum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Ask_Spread, 0);
   const askSpreadAvg = (askSpreadSum / dataSnapshot.length).toFixed(8)

   const bidSum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Bid, 0);
   const bidAvg = Math.abs(bidSum / dataSnapshot.length).toFixed(8)

   const bidSpreadSum = dataSnapshot.reduce((total, currentValue) => total + currentValue.Bid_Spread, 0);   
   const bidSpreadAvg = Math.abs(bidSpreadSum / dataSnapshot.length).toFixed(8)

   const squaredDifferences = dataSnapshot.map(item => Math.pow(item.Price - priceAvg, 2)).reduce((total, currentValue) => total + currentValue, 0);
   const variance = squaredDifferences / (dataSnapshot.length - 1);
   const volatility = Math.sqrt(variance).toFixed(10);


   return (
      <div>

         {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
               <ScaleLoader color={'#5B8D6D'} loading={isLoading} />
            </div>
         ) : (
            <>
               <Row style={{ marginTop: "40px" }}>
                  <Col>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600', color: '#82ca9d' }}>Ask Spread: </span> {askSpreadAvg}%</li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600', color: '#8884d8' }}>Bid Spread: </span> {bidSpreadAvg}%</li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600' }}>Liquidity:</span> ${liquidityAvg}</li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600' }}>Price:</span> ${priceAvg}</li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600', color: 'green' }}>Ask:</span> ${askAvg} </li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600', color: '#514F81' }}>Bid:</span> ${bidAvg} </li>
                     <li style={{ listStyle: "none" }}><span style={{ fontWeight: '600' }}>Volatility:</span> {volatility}</li>
                  </Col>
               </Row>
            </>
         )}
      </div>
   );

};