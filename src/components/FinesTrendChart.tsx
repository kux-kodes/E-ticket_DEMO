import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinesTrendChartProps {
  data: { name: string; fines: number }[];
}

const FinesTrendChart = ({ data }: FinesTrendChartProps) => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              borderRadius: 'var(--radius)',
            }}
            cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
          />
          <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
          <Line type="monotone" dataKey="fines" stroke="hsl(var(--primary))" strokeWidth={3} name="Fines Issued" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinesTrendChart;