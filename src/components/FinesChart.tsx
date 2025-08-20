import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Mon', fines: 65 },
  { name: 'Tue', fines: 59 },
  { name: 'Wed', fines: 80 },
  { name: 'Thu', fines: 81 },
  { name: 'Fri', fines: 56 },
  { name: 'Sat', fines: 95 },
  { name: 'Sun', fines: 78 },
];

const FinesChart = () => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 64, 76, 0.1)" />
          <XAxis dataKey="name" stroke="#06404c" />
          <YAxis stroke="#06404c" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#bcdc49',
              color: '#06404c'
            }}
            cursor={{ fill: 'rgba(188, 220, 73, 0.2)' }}
          />
          <Legend />
          <Bar dataKey="fines" fill="#06404c" name="Fines Issued" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinesChart;