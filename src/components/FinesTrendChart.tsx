import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// API Endpoint: /api/fines-trend
// Query Params: days (number), region (string)
// Data Schema: { name: string; fines: number }[]

const FinesTrendChart = () => {
  const [data, setData] = useState<{ name: string; fines: number }[]>([]);
  const [days, setDays] = useState('30');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    // Mock data fetching
    const fetchData = async () => {
      // In a real application, you would fetch data from an API
      // const response = await fetch(`/api/fines-trend?days=${days}&region=${region}`);
      // const result = await response.json();
      // setData(result);

      // Mock data for demonstration
      const mockData = Array.from({ length: parseInt(days) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (parseInt(days) - i - 1));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fines: Math.floor(Math.random() * 100),
        };
      });
      setData(mockData);
    };

    fetchData();
  }, [days, region]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fines Trend</CardTitle>
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
      </CardContent>
    </Card>
  );
};

export default FinesTrendChart;