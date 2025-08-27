import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, ShieldCheck, Gavel, Siren } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';
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
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useSession();
  const [stats, setStats] = useState({
    outstandingCount: 0,
    outstandingTotal: 0,
    paidCount: 0,
    disputedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizenData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [outstandingRes, paidRes, disputedRes] = await Promise.all([
          supabase.from('fines').select('amount', { count: 'exact' }).eq('user_id', user.id).in('status', ['outstanding', 'overdue']),
          supabase.from('fines').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'paid'),
          supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
        ]);

        if (outstandingRes.error || paidRes.error || disputedRes.error) {
          throw new Error('Failed to fetch citizen data.');
        }

        const totalOutstanding = outstandingRes.data?.reduce((sum, fine) => sum + fine.amount, 0) || 0;
        setStats({
          outstandingCount: outstandingRes.count || 0,
          outstandingTotal: totalOutstanding,
          paidCount: paidRes.count || 0,
          disputedCount: disputedRes.count || 0,
        });
      } catch (error) {
        showError("Could not load your dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizenData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Citizen Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be returned to the homepage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome, {profile?.first_name || 'Citizen'}!</h2>
          <p className="text-foreground/70">Here's a summary of your traffic fines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-2"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-5 w-2/3" /></CardContent>
            </Card>
          )) : (
            <>
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center justify-between">Outstanding Fines <FileText className="h-6 w-6 text-destructive" /></CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.outstandingCount}</p>
                  <p className="text-foreground/70">Totaling N$ {stats.outstandingTotal.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center justify-between">Paid Fines <ShieldCheck className="h-6 w-6 text-green-500" /></CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.paidCount}</p>
                  <p className="text-foreground/70">All settled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center justify-between">Disputed Fines <Gavel className="h-6 w-6 text-yellow-500" /></CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.disputedCount}</p>
                  <p className="text-foreground/70">Under review</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Manage Your Fines</CardTitle></CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">View, pay, or dispute your traffic fines.</p>
              <Button onClick={() => navigate('/my-fines')}>
                View My Fines <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Emergency Contacts</CardTitle></CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">Quickly access emergency service numbers.</p>
              <Button variant="outline" onClick={() => navigate('/emergency')}>
                <Siren className="mr-2 h-4 w-4" /> View Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;