import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Settings, LogOut, FilePlus, AlertTriangle, Clock, Download } from 'lucide-react';
import Logo from "@/components/Logo";
import NampolLogo from "@/components/NampolLogo";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Notifications } from "@/components/Notifications";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinesTrendChart from "@/components/FinesTrendChart";
import ViolationsPieChart from "@/components/ViolationsPieChart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { jsPDF } from "jspdf";
import { showError } from "@/utils/toast";

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

  const handleDownloadPdf = () => {
    // NOTE: This is a placeholder for a more complex PDF generation logic.
    // A full implementation would capture chart images and format data into tables.
    try {
      const doc = new jsPDF();
      doc.text("DRIVA - Traffic Enforcement Report", 20, 20);
      doc.text(`Time Range: ${timeRange}`, 20, 30);
      doc.text("This is a placeholder for the full report.", 20, 40);
      doc.save("driva-report.pdf");
    } catch (error) {
      showError("Failed to generate PDF report.");
      console.error(error);
    }
  };

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
            <NampolLogo />
            <h1 className="text-3xl font-bold text-foreground">Traffic Enforcement Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Notifications />
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}><Settings className="h-5 w-5" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><LogOut className="h-5 w-5" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate('/')}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back, Officer!</h2>
            <p className="text-foreground/70">Here is a summary of traffic enforcement activity.</p>
          </div>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select District" /></SelectTrigger>
              <SelectContent><SelectItem value="khomas">Khomas</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Cards */}
          <Card><CardHeader><CardTitle>Fines Collected</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">N$12,450</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/paid-fines')}>View Fines</Button></CardFooter></Card>
          <Card><CardHeader><CardTitle>New Fines Issued</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">+82</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/new-fines')}>View Fines</Button></CardFooter></Card>
          <Card><CardHeader><CardTitle>Pending Disputes</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">14</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/pending-disputes')}>View Disputes</Button></CardFooter></Card>
          <Card><CardHeader><CardTitle>Outstanding Fines</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">1,253</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/outstanding-fines')}>View Fines</Button></CardFooter></Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">Analytics Overview</CardTitle>
                <CardDescription className="text-foreground/70">View trends and breakdowns of traffic fines.</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Select time range" /></SelectTrigger>
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
            <CardHeader><CardTitle className="text-xl text-foreground">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:shadow-neumorphic-inset cursor-pointer" onClick={() => navigate(item.path)}>
                    <div className="shadow-neumorphic-inset p-2 rounded-full mt-0.5"><div className="bg-primary w-2 h-2 rounded-full"></div></div>
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