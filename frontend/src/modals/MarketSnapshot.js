/*======================================================================*/
/*				   	   		    MODAL - MARKET       		   				*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useEffect, useState } from "react";
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { GridLoader, ScaleLoader } from 'react-spinners'
import { Row, Col } from 'react-bootstrap'

//> API Calls
import { getMarketSnapshot } from '../components/shared/apiCalls';

//> Icons
import { TbArrowsExchange2 } from 'react-icons/tb'

export default function MarketSnapshot({ selectedMarketId, marketInfo }) {


   const [marketSnaphot, setmarketSnaphot] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [chartInterval, setChartInterval] = useState("1")

   useEffect(() => {
      const fetchMarketData = async () => {
         try {
            setIsLoading(true);
            const { data } = await getMarketSnapshot(selectedMarketId, chartInterval);
            setmarketSnaphot(data);
            setIsLoading(false);
         } catch (error) {
            console.log(error);
            setIsLoading(false);
         }
      };
      fetchMarketData();
   }, [selectedMarketId, chartInterval]);


   const data = marketSnaphot.map((market) => {
      const date = new Date(market.timestamp);

      return {
         timestamp: market.timestamp,
         date,
         Price: market.price,
         Ask: market.ask,
         Bid: -market.bid,
         Ask_Spread: market.spread_ask,
         Bid_Spread: -market.spread_bid,
         Liquidity: market.liquidity
      };
   });

   const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);

   const returns = sortedData.slice(1).map((data, index) => ({
      date: data.date,
      Return: (data.Price / sortedData[index].Price - 1)
   }));
   const meanReturn = returns.reduce((sum, dailyReturn) => sum + dailyReturn.Return, 0) / returns.length;
   const squaredDifferences = returns.map((dailyReturn) => Math.pow(dailyReturn.Return - meanReturn, 2));
   const averageSquaredDifference = squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / squaredDifferences.length;
   const volatility = Math.sqrt(averageSquaredDifference);



   const priceSum = sortedData.reduce((total, currentValue) => total + currentValue.Price, 0);
   const priceAvg = (priceSum / sortedData.length).toFixed(8)

   const liquiditySum = sortedData.reduce((total, currentValue) => total + currentValue.Liquidity, 0);
   const liquidityAvg = (liquiditySum / sortedData.length).toFixed(8)

   const askSum = sortedData.reduce((total, currentValue) => total + currentValue.Ask, 0);
   const askAvg = (askSum / sortedData.length).toFixed(8)

   const askSpreadSum = sortedData.reduce((total, currentValue) => total + currentValue.Ask_Spread, 0);
   const askSpreadAvg = (askSpreadSum / sortedData.length).toFixed(8)

   const bidSum = sortedData.reduce((total, currentValue) => total + currentValue.Bid, 0);
   const bidAvg = Math.abs(bidSum / sortedData.length).toFixed(8)

   const bidSpreadSum = sortedData.reduce((total, currentValue) => total + currentValue.Bid_Spread, 0);
   const bidSpreadAvg = Math.abs(bidSpreadSum / sortedData.length).toFixed(8)

   return (
      <>
         {marketSnaphot && marketSnaphot.length > 0 ? (
            <>
               <div className='snapshot_markets'>
                  {marketInfo.base_asset} <TbArrowsExchange2 /> {marketInfo.quote_asset}
                  <div className="snapshot_exchange"> {marketInfo.exchange}</div>
               </div>

               <div className="btns-graph">
                  <div className='btns-graph-group'>
                     <button className={chartInterval === "1" ? 'btn-graph active' : 'btn-graph'} onClick={() => setChartInterval("1")}>1H</button>
                     <button className={chartInterval === "2" ? 'btn-graph active' : 'btn-graph'} onClick={() => setChartInterval("2")}>24H</button>
                     <button className={chartInterval === "3" ? 'btn-graph active' : 'btn-graph'} onClick={() => setChartInterval("3")}>7D</button>
                  </div>
               </div>



               {isLoading ? (
                  <ScaleLoader height='50px' width='5px' color="#8884d8" />
               ) : (
                  <Row className="align-items-center">
                     <Col>
                        <ResponsiveContainer width="100%" height={250}>
                           <ComposedChart
                              width={500}
                              height={200}
                              data={data}
                           >
                              <XAxis dataKey="date" tick={false} />
                              <YAxis tick={false}>
                                 <Label
                                    value="Spread %"
                                    position="center"
                                    angle={-90}
                                    style={{ textAnchor: 'middle' }}
                                 />
                              </YAxis>
                              <Tooltip
                                 formatter={(value) => {
                                    let formattedValue = Math.abs(value).toFixed(4);
                                    return `${formattedValue}%`;
                                 }}
                                 labelStyle={{ color: "black", textDecoration: "underline" }}
                                 labelFormatter={(label) => {
                                    const formattedLabel = new Date(label);
                                    return formattedLabel.toLocaleString("en-US", {
                                       month: "long",
                                       day: "numeric",
                                       hour: "numeric",
                                       minute: "numeric",
                                       timeZoneName: "short"
                                    });
                                 }}

                              />
                              <Area type="monotone" dataKey="Ask_Spread" stroke="#82ca9d" fill="#82ca9d" />
                              <Area type="monotone" dataKey="Bid_Spread" stroke="#8884d8" fill="#8884d8" />
                           </ComposedChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={250}>
                           <ComposedChart
                              width={500}
                              height={200}
                              data={data}
                           >
                              <XAxis tick={false} dataKey="date" />
                              <YAxis tick={false}>
                                 <Label
                                    value="Liquidity"
                                    position="center"
                                    angle={-90}
                                    style={{ textAnchor: 'middle' }}
                                 />
                              </YAxis>
                              <Tooltip
                                 formatter={(value) => {
                                    return `$${value}`;
                                 }}
                                 labelStyle={{ color: "black", textDecoration: "underline" }}
                                 labelFormatter={(label) => {
                                    const formattedLabel = new Date(label);
                                    return formattedLabel.toLocaleString("en-US", {
                                       month: "long",
                                       day: "numeric",
                                       hour: "numeric",
                                       minute: "numeric",
                                       timeZoneName: "short"
                                    });
                                 }}
                              />
                              <Bar type="monotone" dataKey="Liquidity" stroke="#82ca9d" fill="#82ca9d" />
                           </ComposedChart>
                        </ResponsiveContainer>


                     </Col>

                     <Col>
                        <ResponsiveContainer width="100%" height={250}>
                           <ComposedChart
                              width={500}
                              height={200}
                              data={data}
                           >
                              <XAxis tick={false} dataKey="date" />
                              <YAxis tick={false}>
                                 <Label
                                    value="Mid Price $"
                                    position="center"
                                    angle={-90}
                                    style={{ textAnchor: 'middle' }}
                                 />
                              </YAxis>
                              <Tooltip
                                 formatter={(value) => {
                                    let formattedValue = Math.abs(value).toFixed(10);
                                    return `$${formattedValue}`;
                                 }}
                                 labelStyle={{ color: "black", textDecoration: "underline" }}
                                 labelFormatter={(label) => {
                                    const formattedLabel = new Date(label);
                                    return formattedLabel.toLocaleString("en-US", {
                                       month: "long",
                                       day: "numeric",
                                       hour: "numeric",
                                       minute: "numeric",
                                       timeZoneName: "short"
                                    });
                                 }}
                              />
                              <Area type="monotone" dataKey="Ask" stroke="#5B8D6D" fill="#5B8D6D" />
                              <Line type="monotone" dataKey="Price" stroke="#000000" fill='none' />
                              <Area type="monotone" dataKey="Bid" stroke="#514F81" fill="#514F81" />
                           </ComposedChart>
                        </ResponsiveContainer>


                        <ResponsiveContainer width="100%" height={250}>
                           <ComposedChart
                              width={500}
                              height={200}
                              data={returns}
                           >
                              <XAxis tick={false} dataKey="date" />
                              <YAxis tick={false}>
                                 <Label
                                    value="Return %"
                                    position="center"
                                    angle={-90}
                                    style={{ textAnchor: 'middle' }}
                                 />
                              </YAxis>
                              <Tooltip
                                   formatter={(value) => {
                                    return `${value} %`;
                                 }}
                                 labelStyle={{ color: "black", textDecoration: "underline" }}
                                 labelFormatter={(label) => {
                                    const formattedLabel = new Date(label);
                                    return formattedLabel.toLocaleString("en-US", {
                                       month: "long",
                                       day: "numeric",
                                       hour: "numeric",
                                       minute: "numeric",
                                       timeZoneName: "short"
                                    });
                                 }}
                              />
                              <Bar type="monotone" dataKey="Return" stroke="#5B8D6D" fill="#5B8D6D" />
                           </ComposedChart>
                        </ResponsiveContainer>
                     </Col>
                     <Col>
                        <div className="snapshot_avg">
                           <h4 style={{ color: "black" }}>Average Statistics</h4>
                           <ul className="snapshot_avg_stats">
                              <li><span style={{ fontWeight: '600' }}>Price:</span> ${priceAvg}</li>
                              <li><span style={{ fontWeight: '600', color: 'green' }}>Ask:</span> ${askAvg} </li>
                              <li><span style={{ fontWeight: '600', color: '#514F81' }}>Bid:</span> ${bidAvg} </li>
                              <li><span style={{ fontWeight: '600', color: '#82ca9d' }}>Ask Spread: </span> {askSpreadAvg}%</li>
                              <li><span style={{ fontWeight: '600', color: '#8884d8' }}>Bid Spread: </span> {bidSpreadAvg}%</li>
                              <li><span style={{ fontWeight: '600' }}>Liquidity:</span> ${liquidityAvg}</li>
                              <li><span style={{ fontWeight: '600' }}>Volatility:</span> {volatility}</li>
                           </ul>
                        </div>
                     </Col>
                  </Row>
               )}
            </>
         ) : (
            <GridLoader size='10px' margin='1px' color="#8884d8" />
         )
         }
      </>
   );

};