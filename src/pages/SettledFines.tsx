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
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type PaidFine = {
  id: string;
  violation_type: string;
  amount: number;
  fine_date: string;
  profiles: {
    first_name: string;
    last_name: string;
  }[] | null;
};

// Static data for settled tickets
const staticSettledTickets: PaidFine[] = [
  {
    id: 'st-001-2023',
    violation_type: 'Speeding',
    amount: 1000,
    fine_date: '2023-05-15',
    profiles: [{ first_name: 'John', last_name: 'Doe' }]
  },
  {
    id: 'st-002-2023',
    violation_type: 'Parking Violation',
    amount: 500,
    fine_date: '2023-06-22',
    profiles: [{ first_name: 'Jane', last_name: 'Smith' }]
  },
  {
    id: 'st-003-2023',
    violation_type: 'Red Light Violation',
    amount: 1500,
    fine_date: '2023-07-30',
    profiles: [{ first_name: 'Robert', last_name: 'Johnson' }]
  }
];

const PaidFines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [fines, setFines] = useState<PaidFine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidFines = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('fines')
        .select(`
          id,
          violation_type,
          amount,
          fine_date,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('status', 'paid');

      if (error) {
        console.error('Error fetching paid fines:', error);
        showError('Failed to fetch paid fines. Showing sample data.');
        // Use static data if there's an error fetching from the database
        setFines(staticSettledTickets);
      } else {
        // If we have data from the database, use it, otherwise use static data
        setFines(data && data.length > 0 ? data as PaidFine[] : staticSettledTickets);
      }
      setLoading(false);
    };

    fetchPaidFines();
  }, []);

  const filteredFines = fines.filter(fine => {
    const offenderName = fine.profiles && fine.profiles.length > 0 ? `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : '';
    return (
      fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.violation_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Paid Fines</h1>
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
                <CardTitle className="text-xl text-foreground">All Paid Fines</CardTitle>
                <CardDescription className="text-foreground/70">A complete record of all settled fines.</CardDescription>
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
                  <TableHead className="font-bold text-foreground">Reference Number</TableHead>
                  <TableHead className="font-bold text-foreground">Driver</TableHead>
                  <TableHead className="font-bold text-foreground">Violation Type</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount (N$)</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Date Issued</TableHead>
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
                      <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFines.length > 0 ? (
                  filteredFines.map((fine) => (
                    <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                      <TableCell className="font-medium">{fine.id.substring(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{fine.profiles && fine.profiles.length > 0 ? `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : 'N/A'}</TableCell>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{new Date(fine.fine_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No paid fines found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PaidFines;