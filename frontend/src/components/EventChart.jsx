/*======================================================================*/
/*								          EVENT CHART DATA			                  		*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EventChart ({ eventData }) {
  
  const [chartData, setChartData] = useState([]);
  setChartData(eventData)

  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="type" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="amount" stroke="#5B8D6D" fill="#5B8D6D" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};