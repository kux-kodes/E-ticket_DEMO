import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// API Endpoint: /api/violations-distribution
// Query Params: days (number), region (string)
// Data Schema: { name: string; value: number }[]

const COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];

const ViolationsPieChart = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [days, setDays] = useState('30');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    // Mock data fetching
    const fetchData = async () => {
      // In a real application, you would fetch data from an API
      // const response = await fetch(`/api/violations-distribution?days=${days}&region=${region}`);
      // const result = await response.json();
      // setData(result);

      // Mock data for demonstration
      const mockData = [
        { name: 'Speeding', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Parking', value: Math.floor(Math.random() * 400) + 100 },
        { name: 'Red Light', value: Math.floor(Math.random() * 300) + 50 },
        { name: 'Expired License', value: Math.floor(Math.random() * 200) + 50 },
        { name: 'Other', value: Math.floor(Math.random() * 100) + 25 },
      ];
      setData(mockData);
    };

    fetchData();
  }, [days, region]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Violations Distribution</CardTitle>
        <div className="flex items-center space-x-4">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="khomas">Khomas</SelectItem>
              <SelectItem value="erongo">Erongo</SelectItem>
              <SelectItem value="oshana">Oshana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ViolationsPieChart;