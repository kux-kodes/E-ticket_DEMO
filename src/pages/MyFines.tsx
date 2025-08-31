import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
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
  const [selectedFines, setSelectedFines] = useState<string[]>([]);

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
        .eq('user_id', user.id)
        .order('fine_date', { ascending: false });

      if (error) {
        showError('Failed to fetch your fines.');
      } else {
        setFines(data as Fine[]);
      }
      setLoading(false);
    };

    fetchFines();
  }, []);

  const unpaidFines = useMemo(() => fines.filter(f => ['outstanding', 'overdue'].includes(f.status.toLowerCase())), [fines]);
  const paidFines = useMemo(() => fines.filter(f => !['outstanding', 'overdue'].includes(f.status.toLowerCase())), [fines]);

  const filteredUnpaidFines = unpaidFines.filter(fine =>
    fine.violation_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fine.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = useMemo(() => {
    return unpaidFines
      .filter(fine => selectedFines.includes(fine.id))
      .reduce((sum, fine) => sum + fine.amount, 0);
  }, [selectedFines, unpaidFines]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFines(filteredUnpaidFines.map(f => f.id));
    } else {
      setSelectedFines([]);
    }
  };

  const handleSelectFine = (fineId: string, checked: boolean) => {
    if (checked) {
      setSelectedFines(prev => [...prev, fineId]);
    } else {
      setSelectedFines(prev => prev.filter(id => id !== fineId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outstanding': return <Badge variant="secondary">Outstanding</Badge>;
      case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
      case 'disputed': return <Badge variant="outline">Disputed</Badge>;
      case 'paid': return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'waived': return <Badge className="bg-blue-500 text-white">Waived</Badge>;
      default: return <Badge>{status}</Badge>;
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
            <Button variant="ghost" onClick={() => navigate('/citizen-dashboard')}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">Outstanding Fines</CardTitle>
                <CardDescription className="text-foreground/70">Select fines to pay them in a single transaction.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                <Input type="search" placeholder="Search fines..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedFines.length > 0 && selectedFines.length === filteredUnpaidFines.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Violation</TableHead>
                  <TableHead className="text-right">Amount (N$)</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                ) : filteredUnpaidFines.length > 0 ? (
                  filteredUnpaidFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell><Checkbox checked={selectedFines.includes(fine.id)} onCheckedChange={(checked) => handleSelectFine(fine.id, !!checked)} /></TableCell>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(fine.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/fine-details/${fine.id}`)}><Eye className="mr-2 h-4 w-4" />View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="text-center">No outstanding fines found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {filteredUnpaidFines.length > 0 && (
            <CardFooter className="flex justify-end items-center gap-4 pt-4 border-t">
              <div className="text-lg font-semibold">
                Total: <span className="text-primary">N$ {totalAmount.toFixed(2)}</span>
              </div>
              <Button
                disabled={selectedFines.length === 0}
                onClick={() => navigate('/payment', { state: { fineIds: selectedFines, totalAmount } })}
              >
                Pay Selected ({selectedFines.length})
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Fines History</CardTitle>
            <CardDescription className="text-foreground/70">A record of your paid, disputed, or waived fines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Violation</TableHead>
                  <TableHead className="text-right">Amount (N$)</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                ) : paidFines.length > 0 ? (
                  paidFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(fine.fine_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/fine-details/${fine.id}`)}><Eye className="mr-2 h-4 w-4" />View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center">No paid fines found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MyFines;