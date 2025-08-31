import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ViolationsPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#bcdc49', '#06404c', '#88a32b', '#042f38', '#d3e888'];

const ViolationsPieChart = ({ data }: ViolationsPieChartProps) => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViolationsPieChart;