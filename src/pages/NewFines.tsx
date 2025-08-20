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
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type NewFine = {
  id: string;
  violation_type: string;
  amount: number;
  fine_date: string;
  status: string;
  profiles: {
    first_name: string;
    last_name: string;
  }[] | null;
};

const NewFines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [fines, setFines] = useState<NewFine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewFines = async () => {
      setLoading(true);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('fines')
        .select(`
          id,
          violation_type,
          amount,
          fine_date,
          status,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .gte('fine_date', sevenDaysAgo)
        .order('fine_date', { ascending: false });

      if (error) {
        console.error('Error fetching new fines:', error);
        showError('Failed to fetch new fines.');
      } else {
        setFines(data as NewFine[]);
      }
      setLoading(false);
    };

    fetchNewFines();
  }, []);

  const filteredFines = fines.filter(fine => {
    const offenderName = fine.profiles && fine.profiles.length > 0 ? `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : '';
    return (
      fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.violation_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outstanding':
        return <Badge variant="secondary">Outstanding</Badge>;
      case 'disputed':
        return <Badge variant="outline">Disputed</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
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
            <h1 className="text-3xl font-bold text-foreground">Newly Issued Fines</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
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
                <CardTitle className="text-xl text-foreground">Fines Issued in Last 7 Days</CardTitle>
                <CardDescription className="text-foreground/70">A record of all recently issued fines.</CardDescription>
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
                  <TableHead className="font-bold text-foreground">Offender</TableHead>
                  <TableHead className="font-bold text-foreground">Violation Type</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount (N$)</TableHead>
                  <TableHead className="font-bold text-foreground">Date Issued</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFines.length > 0 ? (
                  filteredFines.map((fine) => (
                    <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                      <TableCell className="font-medium">{fine.id.substring(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{fine.profiles && fine.profiles.length > 0 ? `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : 'N/A'}</TableCell>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(fine.fine_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No new fines found in the last 7 days.</TableCell>
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

export default NewFines;