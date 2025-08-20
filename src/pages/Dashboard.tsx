import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Settings, LogOut, FilePlus, AlertTriangle, Clock } from 'lucide-react';
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Notifications } from "@/components/Notifications";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinesTrendChart from "@/components/FinesTrendChart";
import ViolationsPieChart from "@/components/ViolationsPieChart";

// Mock data generation to simulate dynamic data fetching
const generateChartData = (timeRange: string) => {
  const pieData = [
    { name: 'Speeding', value: Math.floor(Math.random() * 100) + 350 },
    { name: 'Illegal Parking', value: Math.floor(Math.random() * 100) + 250 },
    { name: 'Red Light', value: Math.floor(Math.random() * 80) + 180 },
    { name: 'No License', value: Math.floor(Math.random() * 50) + 120 },
    { name: 'Other', value: Math.floor(Math.random() * 50) + 80 },
  ];

  let days = 7;
  if (timeRange === '30d') days = 30;
  if (timeRange === '90d') days = 90;

  const trendData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fines: Math.floor(Math.random() * 50) + 50,
    };
  });

  return { trendData, pieData };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [trendChartData, setTrendChartData] = useState<{ name: string; fines: number }[]>([]);
  const [pieChartData, setPieChartData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const { trendData, pieData } = generateChartData(timeRange);
    setTrendChartData(trendData);
    setPieChartData(pieData);
  }, [timeRange]);

  const recentActivity = [
    { title: "New fine issued to N12345W", time: "2 minutes ago", path: "/new-fines" },
    { title: "Payment received for fine #8432", time: "15 minutes ago", path: "/paid-fines" },
    { title: "New dispute filed for fine #8219", time: "1 hour ago", path: "/pending-disputes" },
    { title: "Fine #8430 is now overdue", time: "3 hours ago", path: "/outstanding-fines" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Traffic Enforcement Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Notifications />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back, Officer!</h2>
          <p className="text-foreground/70">Here is a summary of today's traffic enforcement activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Fines Collected (Today)</CardTitle>
              <div className="p-2 shadow-neumorphic-inset rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-foreground">N$12,450</div>
              <p className="text-sm text-foreground/70 mt-1">+15.2% from yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate('/paid-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground">New Fines Issued (Today)</CardTitle>
              <div className="p-2 shadow-neumorphic-inset rounded-lg">
                <FilePlus className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-foreground">+82</div>
              <p className="text-sm text-foreground/70 mt-1">+5% from yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate('/new-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Pending Disputes</CardTitle>
              <div className="p-2 shadow-neumorphic-inset rounded-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-foreground">14</div>
              <p className="text-sm text-foreground/70 mt-1">3 new since yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate('/pending-disputes')}
              >
                View All Disputes
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Total Outstanding Fines</CardTitle>
              <div className="p-2 shadow-neumorphic-inset rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-foreground">1,253</div>
              <p className="text-sm text-foreground/70 mt-1">Total value: N$250,600</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate('/outstanding-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">Analytics Overview</CardTitle>
                <CardDescription className="text-foreground/70">View trends and breakdowns of traffic fines.</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-6">
              <div className="lg:col-span-3">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Fines Trend</h3>
                <FinesTrendChart data={trendChartData} />
              </div>
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Top Violations</h3>
                <ViolationsPieChart data={pieChartData} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-foreground/70">Latest fines, payments, and disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:shadow-neumorphic-inset transition-shadow cursor-pointer"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="shadow-neumorphic-inset p-2 rounded-full mt-0.5">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground/60">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;