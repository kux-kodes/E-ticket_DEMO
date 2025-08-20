import React, { useState } from 'react';
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
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const paidFinesData = [
  { id: '#8432', offender: 'John Doe', violation: 'Speeding', amount: 500.00, date: '2024-07-29' },
  { id: '#8421', offender: 'Jane Smith', violation: 'Illegal Parking', amount: 250.00, date: '2024-07-29' },
  { id: '#8415', offender: 'Peter Jones', violation: 'Running a red light', amount: 1000.00, date: '2024-07-28' },
  { id: '#8410', offender: 'Mary Williams', violation: 'Expired license disk', amount: 300.00, date: '2024-07-28' },
  { id: '#8405', offender: 'David Brown', violation: 'Speeding', amount: 750.00, date: '2024-07-27' },
  { id: '#8399', offender: 'Linda Davis', violation: 'Using phone while driving', amount: 1200.00, date: '2024-07-27' },
];

const PaidFines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFines = paidFinesData.filter(fine =>
    fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fine.offender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fine.violation.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <TableHead className="font-bold text-foreground">Fine ID</TableHead>
                  <TableHead className="font-bold text-foreground">Offender</TableHead>
                  <TableHead className="font-bold text-foreground">Violation Type</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount (N$)</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Date Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFines.map((fine) => (
                  <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                    <TableCell className="font-medium">{fine.id}</TableCell>
                    <TableCell>{fine.offender}</TableCell>
                    <TableCell>{fine.violation}</TableCell>
                    <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{fine.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default PaidFines;