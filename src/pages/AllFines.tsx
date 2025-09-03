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
import { ArrowLeft, Search, Download, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Fine = {
  id: string;
  violation_type: string;
  amount: number;
  fine_date: string;
  due_date: string;
  status: 'paid' | 'disputed' | 'overdue';
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  }[] | null;
};

const FinesDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'disputed' | 'overdue'>('all');
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchAllFines();
  }, []);

  const fetchAllFines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fines')
      .select(`
        id,
        violation_type,
        amount,
        fine_date,
        due_date,
        status,
        profiles:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .order('fine_date', { ascending: false });

    if (error) {
      console.error('Error fetching fines:', error);
      showError('Failed to fetch fines.');
    } else {
      setFines(data as Fine[]);
    }
    setLoading(false);
  };

  const updateFineStatus = async (fineId: string, newStatus: Fine['status']) => {
    setUpdating(fineId);
    const { error } = await supabase
      .from('fines')
      .update({ status: newStatus })
      .eq('id', fineId);

    if (error) {
      console.error('Error updating fine status:', error);
      showError('Failed to update fine status.');
    } else {
      showSuccess('Fine status updated successfully.');
      // Update local state
      setFines(fines.map(fine => 
        fine.id === fineId ? { ...fine, status: newStatus } : fine
      ));
    }
    setUpdating(null);
  };

  const filteredFines = fines.filter(fine => {
    const offenderName = fine.profiles && fine.profiles.length > 0 ? 
      `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : '';
    
    const matchesSearch = (
      fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.violation_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fine.profiles && fine.profiles[0]?.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalFines = fines.length;
  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const settledFines = fines.filter(fine => fine.status === 'paid');
  const disputedFines = fines.filter(fine => fine.status === 'disputed');
  const outstandingFines = fines.filter(fine => fine.status === 'overdue');

  const settledAmount = settledFines.reduce((sum, fine) => sum + fine.amount, 0);
  const disputedAmount = disputedFines.reduce((sum, fine) => sum + fine.amount, 0);
  const outstandingAmount = outstandingFines.reduce((sum, fine) => sum + fine.amount, 0);

  const getStatusBadge = (status: Fine['status']) => {
    const statusConfig = {
      settled: { label: 'Settled', variant: 'default', className: 'bg-green-500' },
      disputed: { label: 'Disputed', variant: 'outline', className: 'border-orange-500 text-orange-500' },
      outstanding: { label: 'Outstanding', variant: 'destructive', className: 'bg-red-500' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const exportToCSV = () => {
    // Simple CSV export functionality
    const headers = ['ID', 'Driver', 'Violation Type', 'Amount', 'Date Issued', 'Due Date', 'Status'];
    const csvData = filteredFines.map(fine => {
      const driverName = fine.profiles && fine.profiles.length > 0 ? 
        `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : 'N/A';
      
      return [
        fine.id.substring(0, 8).toUpperCase(),
        driverName,
        fine.violation_type,
        fine.amount.toFixed(2),
        new Date(fine.fine_date).toLocaleDateString(),
        new Date(fine.due_date).toLocaleDateString(),
        fine.status
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fines_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Total Fines </h1>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFines}</div>
              <p className="text-xs text-muted-foreground">N${totalAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Settled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{settledFines.length}</div>
              <p className="text-xs text-muted-foreground">N${settledAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outstandingFines.length}</div>
              <p className="text-xs text-muted-foreground">N${outstandingAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{disputedFines.length}</div>
              <p className="text-xs text-muted-foreground">N${disputedAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-foreground">All Fines</CardTitle>
                <CardDescription className="text-foreground/70">
                  Manage all fines with different status types: settled, disputed, and outstanding.
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                  <Input
                    type="search"
                    placeholder="Search fines..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={exportToCSV}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-foreground">Reference</TableHead>
                  <TableHead className="font-bold text-foreground">Driver</TableHead>
                  <TableHead className="font-bold text-foreground">Violation Type</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount (N$)</TableHead>
                  <TableHead className="font-bold text-foreground">Issued</TableHead>
                  <TableHead className="font-bold text-foreground">Due Date</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Status</TableHead>
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
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFines.length > 0 ? (
                  filteredFines.map((fine) => (
                    <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                      <TableCell className="font-medium">{fine.id.substring(0, 8).toUpperCase()}</TableCell>
                      <TableCell>
                        {fine.profiles && fine.profiles.length > 0 ? (
                          <div>
                            <div>{`${fine.profiles[0].first_name} ${fine.profiles[0].last_name}`}</div>
                            <div className="text-xs text-muted-foreground">{fine.profiles[0].email}</div>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{fine.violation_type}</TableCell>
                      <TableCell className="text-right font-medium">{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(fine.fine_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(fine.due_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(fine.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => updateFineStatus(fine.id, 'paid')}
                              disabled={updating === fine.id}
                            >
                              Mark as Settled
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateFineStatus(fine.id, 'disputed')}
                              disabled={updating === fine.id}
                            >
                              Mark as Disputed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateFineStatus(fine.id, 'overdue')}
                              disabled={updating === fine.id}
                            >
                              Mark as Outstanding
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No fines found matching your criteria.
                    </TableCell>
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

export default FinesDashboard;