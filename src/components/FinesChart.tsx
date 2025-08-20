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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 103, 121, 0.1)" />
          <XAxis dataKey="name" stroke="#5a6779" />
          <YAxis stroke="#5a6779" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--foreground))'
            }}
            cursor={{ fill: 'rgba(74, 144, 226, 0.2)' }}
          />
          <Legend />
          <Bar dataKey="fines" fill="#4a90e2" name="Fines Issued" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinesChart;