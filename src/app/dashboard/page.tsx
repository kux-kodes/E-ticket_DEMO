"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Fine {
  id: string;
  license_plate: string;
  violation_type: string;
  amount: number;
  due_date: string;
  status: string;
  days_left: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fines, setFines] = useState<Fine[]>([]);
  const [selectedFines, setSelectedFines] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    outstanding: 0,
    overdue: 0,
    paid: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchFines();
    }
  }, [user]);

  const fetchFines = async () => {
    const { data, error } = await supabase
      .from('fines')
      .select('*')
      .eq('user_id', user?.id)
      .order('due_date', { ascending: true });

    if (!error && data) {
      const processedFines = data.map(fine => ({
        ...fine,
        days_left: Math.ceil((new Date(fine.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      }));
      
      setFines(processedFines);
      
      const stats = {
        total: data.length,
        outstanding: data.filter(f => f.status === 'outstanding').length,
        overdue: data.filter(f => f.status === 'overdue').length,
        paid: data.filter(f => f.status === 'paid').length,
      };
      setStats(stats);
    }
  };

  const handleFineSelection = (fineId: string) => {
    setSelectedFines(prev =>
      prev.includes(fineId)
        ? prev.filter(id => id !== fineId)
        : [...prev, fineId]
    );
  };

  const getStatusColor = (status: string, daysLeft: number) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'overdue') return 'bg-red-100 text-red-800';
    if (daysLeft <= 3) return 'bg-red-100 text-red-800';
    if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const totalSelectedAmount = selectedFines.reduce((sum, fineId) => {
    const fine = fines.find(f => f.id === fineId);
    return sum + (fine?.amount || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#c6e5df] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#06404c]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#c6e5df]">
      {/* Header */}
      <header className="bg-[#06404c] text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#bcdc49] rounded-full flex items-center justify-center">
              <span className="text-[#06404c] font-bold text-sm">D</span>
            </div>
            <h1 className="text-xl font-bold">DRIVA</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#9fd3ce] rounded-full">
              <AlertTriangle className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#9fd3ce] rounded-full">
              <span className="text-sm">Profile</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.outstanding}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
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
        </div>

        {/* Fines Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Traffic Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFines(fines.map(f => f.id));
                          } else {
                            setSelectedFines([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-2">License Plate</th>
                    <th className="text-left p-2">Violation</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Due Date</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine) => (
                    <tr key={fine.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedFines.includes(fine.id)}
                          onChange={() => handleFineSelection(fine.id)}
                        />
                      </td>
                      <td className="p-2">{fine.license_plate}</td>
                      <td className="p-2">{fine.violation_type}</td>
                      <td className="p-2">R {fine.amount.toFixed(2)}</td>
                      <td className="p-2">{format(new Date(fine.due_date), 'MMM dd, yyyy')}</td>
                      <td className="p-2">
                        <Badge className={cn(getStatusColor(fine.status, fine.days_left))}>
                          {fine.status === 'outstanding' && fine.days_left <= 0 ? 'Overdue' : fine.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {selectedFines.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected: {selectedFines.length} fines</p>
                <p className="text-lg font-bold">Total: R {totalSelectedAmount.toFixed(2)}</p>
              </div>
              <div className="space-x-2">
                <Button
                  className="bg-[#06404c] hover:bg-[#06404c]/90"
                  onClick={() => router.push(`/payments?fines=${selectedFines.join(',')}`)}
                >
                  Pay Selected
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dispute?fines=${selectedFines.join(',')}`)}
                >
                  Dispute Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}