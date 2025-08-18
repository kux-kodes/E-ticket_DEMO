"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface FineStats {
  issued: number;
  paid: number;
  disputed: number;
  overdue: number;
}

interface DailyStats {
  date: string;
  issued: number;
  paid: number;
}

export default function PoliceDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<FineStats>({
    issued: 0,
    paid: 0,
    disputed: 0,
    overdue: 0,
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [recentFines, setRecentFines] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && profile?.role === 'officer') {
      fetchStats();
    }
  }, [user, profile]);

  const fetchStats = async () => {
    // Get fines issued by this officer
    const { data: issuedFines } = await supabase
      .from('fines')
      .select('*')
      .eq('officer_id', user?.id);

    if (issuedFines) {
      setStats({
        issued: issuedFines.length,
        paid: issuedFines.filter(f => f.status === 'paid').length,
        disputed: issuedFines.filter(f => f.status === 'disputed').length,
        overdue: issuedFines.filter(f => f.status === 'overdue').length,
      });
    }

    // Get daily stats for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const dailyData = await Promise.all(
      last7Days.map(async (date) => {
        const { data } = await supabase
          .from('fines')
          .select('*')
          .eq('officer_id', user?.id)
          .gte('created_at', `${date}T00:00:00`)
          .lt('created_at', `${date}T23:59:59`);

        const paid = await supabase
          .from('fines')
          .select('*')
          .eq('officer_id', user?.id)
          .eq('status', 'paid')
          .gte('updated_at', `${date}T00:00:00`)
          .lt('updated_at', `${date}T23:59:59`);

        return {
          date: format(new Date(date), 'MMM dd'),
          issued: data?.length || 0,
          paid: paid.data?.length || 0,
        };
      })
    );

    setDailyStats(dailyData);

    // Get recent fines
    const { data: recent } = await supabase
      .from('fines')
      .select('*')
      .eq('officer_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentFines(recent || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#c6e5df] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#06404c]"></div>
      </div>
    );
  }

  if (profile?.role !== 'officer') {
    return (
      <div className="min-h-screen bg-[#c6e5df] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#06404c]">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to police officers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#c6e5df]">
      <header className="bg-[#06404c] text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Police Dashboard</h1>
            <p className="text-sm text-[#9fd3ce]">Officer: {profile?.first_name} {profile?.last_name}</p>
          </div>
          <div className="space-x-2">
            <Button
              className="bg-[#bcdc49] text-[#06404c] hover:bg-[#bcdc49]/90"
              onClick={() => router.push('/police/issue')}
            >
              Issue Fine
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.issued}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.disputed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issued" fill="#06404c" name="Issued" />
                <Bar dataKey="paid" fill="#bcdc49" name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Fines */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Fines Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">License Plate</th>
                    <th className="text-left p-2">Violation</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFines.map((fine) => (
                    <tr key={fine.id} className="border-b">
                      <td className="p-2">{fine.license_plate}</td>
                      <td className="p-2">{fine.violation_type}</td>
                      <td className="p-2">R {fine.amount.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={
                          fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                          fine.status === 'disputed' ? 'bg-yellow-100 text-yellow-800' :
                          fine.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {fine.status}
                        </Badge>
                      </td>
                      <td className="p-2">{format(new Date(fine.created_at), 'MMM dd')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}