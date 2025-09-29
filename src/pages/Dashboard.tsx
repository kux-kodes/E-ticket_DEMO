import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Settings, LogOut, Download, Shield } from 'lucide-react';
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { jsPDF } from "jspdf";
import { showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/contexts/SessionContext";

type Profile = {
  id: string;
  role: string;
  first_name?: string; 
  last_name?: string;
  [key: string]: string | undefined;
};

// Static data for dashboard statistics
const staticStats = {
  finesCollected: 5,
  settledFines: 3, // Total of all tickets
  pendingDisputes: 1, // 1 pending dispute
  outstandingFines: 1, // 1 outstanding fine
};

// Static trend data for the chart
const staticTrendData = [
  { name: 'Day 1', fines: 2 },
  { name: 'Day 2', fines: 1 },
  { name: 'Day 3', fines: 0 },
  { name: 'Day 4', fines: 1 },
  { name: 'Day 5', fines: 0 },
  { name: 'Day 6', fines: 1 },
  { name: 'Day 7', fines: 0 },
];

// Static violation data for the pie chart
const staticViolationData = [
  { name: 'Speeding', value: 2 },
  { name: 'Parking Violation', value: 1 },
  { name: 'Red Light Violation', value: 1 },
  { name: 'Illegal Parking', value: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useSession();
  const [timeRange, setTimeRange] = useState(7);
  const [stats, setStats] = useState({ finesCollected: 0, settledFines: 0, pendingDisputes: 0, outstandingFines: 0 });
  const [trendChartData, setTrendChartData] = useState<{ name: string; fines: number }[]>([]);
  const [pieChartData, setPieChartData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [
          paidFinesRes,
          settledFinesRes,
          pendingDisputesRes,
          outstandingFinesRes,
          trendRes,
          pieRes
        ] = await Promise.all([
          supabase.from('fines').select('amount').eq('status', 'paid'),
          supabase.from('fines').select('*', { count: 'exact', head: true }).gte('fine_date', sevenDaysAgo),
          supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('fines').select('*', { count: 'exact', head: true }).in('status', ['outstanding', 'overdue']),
          supabase.rpc('get_fines_trend', { days_limit: timeRange }),
          supabase.rpc('get_violations_summary')
        ]);

        if (paidFinesRes.error || settledFinesRes.error || pendingDisputesRes.error || outstandingFinesRes.error || trendRes.error || pieRes.error) {
          throw new Error('Failed to fetch dashboard data. Showing sample data.');
        }

        const totalCollected = paidFinesRes.data?.reduce((sum, fine) => sum + fine.amount, 0) || 0;
        
        // Use database data if available, otherwise use static data
        setStats({
          finesCollected: totalCollected > 0 ? totalCollected : staticStats.finesCollected,
          settledFines: settledFinesRes.count || staticStats.settledFines,
          pendingDisputes: pendingDisputesRes.count || staticStats.pendingDisputes,
          outstandingFines: outstandingFinesRes.count || staticStats.outstandingFines,
        });
        
        setTrendChartData(trendRes.data?.length > 0 ? trendRes.data : staticTrendData);
        setPieChartData(pieRes.data?.length > 0 ? pieRes.data : staticViolationData);

      } catch (error) {
        showError("Could not load dashboard data. Showing sample data.");
        console.error(error);
        // Use static data when there's an error
        setStats(staticStats);
        setTrendChartData(staticTrendData);
        setPieChartData(staticViolationData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.text("DRIVA - Traffic Enforcement Report", 20, 20);
      doc.text(`Time Range: Last ${timeRange} days`, 20, 30);
      doc.text(`Total Fines Collected: N$${stats.finesCollected.toLocaleString()}`, 20, 40);
      doc.text(`New Fines: ${stats.settledFines}`, 20, 50);
      doc.text(`Pending Disputes: ${stats.pendingDisputes}`, 20, 60);
      doc.text(`Outstanding Fines: ${stats.outstandingFines}`, 20, 70);
      doc.text("This report includes sample data for demonstration.", 20, 80);
      doc.save("driva-report.pdf");
    } catch (error) {
      showError("Failed to generate PDF report.");
      console.error(error);
    }
  };

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
            {profile?.role === 'admin' && <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}><Shield className="h-5 w-5" /></Button>}
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}><Settings className="h-5 w-5" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><LogOut className="h-5 w-5" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back, {`${profile?.first_name} ${profile?.last_name}`.trim() || 'Officer'}!</h2>
            <p className="text-foreground/70">Here is a summary of traffic enforcement activity.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>) : (
            <>
              <Card><CardHeader><CardTitle>Total Fines (7d)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.finesCollected.toLocaleString()}</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/paid-fines')}>View Fines</Button></CardFooter></Card>
              <Card><CardHeader><CardTitle>Settled Fines (7d)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.settledFines}</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate("/settled-fines")}>View All Fines</Button></CardFooter></Card>
              <Card><CardHeader><CardTitle>Pending Disputes</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.pendingDisputes}</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/pending-disputes')}>View Disputes</Button></CardFooter></Card>
              <Card><CardHeader><CardTitle>Outstanding Fines</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.outstandingFines}</div></CardContent><CardFooter><Button className="w-full" onClick={() => navigate('/outstanding-fines')}>View Fines</Button></CardFooter></Card>
            </>
          )}
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">Analytics Overview</CardTitle>
                <CardDescription className="text-foreground/70">View trends and breakdowns of traffic fines.</CardDescription>
              </div>
              <Select value={String(timeRange)} onValueChange={(val) => setTimeRange(Number(val))}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Select time range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-6">
              {loading ? (
                <>
                  <div className="lg:col-span-3"><Skeleton className="h-80 w-full" /></div>
                  <div className="lg:col-span-2"><Skeleton className="h-80 w-full" /></div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Fines Trend</h3>
                    <FinesTrendChart data={trendChartData} />
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Top Violations</h3>
                    <ViolationsPieChart data={pieChartData}/>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;