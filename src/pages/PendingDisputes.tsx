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
import { ArrowLeft, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type Dispute = {
  fine_id: string;
  submitted_at: string;
  fines: {
    violation_type: string;
    profiles: {
      first_name: string;
      last_name: string;
    }[] | null;
  }[] | null;
};

// Static data for a pending dispute
const staticPendingDispute: Dispute[] = [
  {
    fine_id: 'disp-001-2023',
    submitted_at: '2023-10-15T14:30:00Z',
    fines: [
      {
        violation_type: 'Speeding in School Zone',
        profiles: [{ first_name: 'Sarah', last_name: 'Wilson' }]
      }
    ]
  }
];

const PendingDisputes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          fine_id,
          submitted_at,
          fines (
            violation_type,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching disputes:', error);
        showError('Failed to fetch pending disputes. Showing sample data.');
        // Use static data if there's an error fetching from the database
        setDisputes(staticPendingDispute);
      } else if (data) {
        // If we have data from the database, use it, otherwise use static data
        setDisputes(data.length > 0 ? data as Dispute[] : staticPendingDispute);
      } else {
        // If no data returned, use static data
        setDisputes(staticPendingDispute);
      }
      setLoading(false);
    };

    fetchDisputes();
  }, []);

  const filteredDisputes = disputes.filter(dispute => {
    const offenderName = dispute.fines?.[0]?.profiles?.[0] ? `${dispute.fines[0].profiles[0].first_name} ${dispute.fines[0].profiles[0].last_name}` : 'Unknown';
    const violation = dispute.fines?.[0]?.violation_type || '';
    return (
      dispute.fine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Pending Disputes</h1>
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
                <CardTitle className="text-xl text-foreground">All Pending Disputes</CardTitle>
                <CardDescription className="text-foreground/70">Review and resolve outstanding fine disputes.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                <Input
                  type="search"
                  placeholder="Search disputes..."
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
                  <TableHead className="font-bold text-foreground">Date Submitted</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredDisputes.length > 0 ? (
                  filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.fine_id} className="hover:shadow-neumorphic-inset">
                      <TableCell className="font-medium">{dispute.fine_id.substring(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{dispute.fines?.[0]?.profiles?.[0] ? `${dispute.fines[0].profiles[0].first_name} ${dispute.fines[0].profiles[0].last_name}` : 'N/A'}</TableCell>
                      <TableCell>{dispute.fines?.[0]?.violation_type || 'N/A'}</TableCell>
                      <TableCell>{new Date(dispute.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/dispute-review/${dispute.fine_id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No pending disputes found.</TableCell>
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

export default PendingDisputes;