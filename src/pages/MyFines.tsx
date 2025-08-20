import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type Fine = {
  id: string;
  violation_type: string;
  amount: number;
  fine_date: string;
  due_date: string;
  status: string;
};

const MyFines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError("You must be logged in to view your fines.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('fines')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching fines:', error);
        showError('Failed to fetch your fines.');
      } else {
        setFines(data as Fine[]);
      }
      setLoading(false);
    };

    fetchFines();
  }, []);

  const filteredFines = fines.filter(fine =>
    fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fine.violation_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fine.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outstanding':
        return <Badge variant="secondary">Outstanding</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'disputed':
        return <Badge variant="outline">Disputed</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'waived':
        return <Badge className="bg-blue-500 text-white">Waived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">My Fines</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/citizen-dashboard')}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">Your Fines History</CardTitle>
                <CardDescription className="text-foreground/70">A complete record of all your fines.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                <Input
                  type="search"
                  placeholder="Search fines..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-foreground">Fine ID</TableHead>
                  <TableHead className="font-bold text-foreground">Violation</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount (N$)</TableHead>
                  <TableHead className="font-bold text-foreground">Date Issued</TableHead>
                  <TableHead className="font-bold text-foreground">Due Date</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFines.length > 0 ? (
                  filteredFines.map((fine) => (
                    <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                      <TableCell className="font-medium">{fine.id.substring(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(fine.fine_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(fine.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                      <TableCell className="text-right">
                        {(fine.status.toLowerCase() === 'outstanding' || fine.status.toLowerCase() === 'overdue') ? (
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/payment/${fine.id}`)}>Pay Now</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dispute-fine/${fine.id}`)}>Dispute</Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => navigate(`/fine-details/${fine.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No fines found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default MyFines;