import React from 'react';
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
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const newFinesData = [
  { id: '#8433', offender: 'Michael Scott', violation: 'Illegal U-Turn', amount: 400.00, date: '2024-07-30', status: 'Outstanding' },
  { id: '#8434', offender: 'Dwight Schrute', violation: 'Failure to yield', amount: 600.00, date: '2024-07-30', status: 'Outstanding' },
  { id: '#8435', offender: 'Jim Halpert', violation: 'Speeding', amount: 750.00, date: '2024-07-30', status: 'Disputed' },
  { id: '#8436', offender: 'Pam Beesly', violation: 'Parking in a no-parking zone', amount: 200.00, date: '2024-07-29', status: 'Outstanding' },
  { id: '#8437', offender: 'Angela Martin', violation: 'Driving too slow', amount: 150.00, date: '2024-07-29', status: 'Overdue' },
  { id: '#8438', offender: 'Kevin Malone', violation: 'Broken taillight', amount: 250.00, date: '2024-07-28', status: 'Outstanding' },
];

const NewFines = () => {
  const navigate = useNavigate();

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
            <CardTitle className="text-xl text-foreground">All Newly Issued Fines</CardTitle>
            <CardDescription className="text-foreground/70">A record of all recently issued fines.</CardDescription>
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
                {newFinesData.map((fine) => (
                  <TableRow key={fine.id} className="hover:shadow-neumorphic-inset">
                    <TableCell className="font-medium">{fine.id}</TableCell>
                    <TableCell>{fine.offender}</TableCell>
                    <TableCell>{fine.violation}</TableCell>
                    <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                    <TableCell>{fine.date}</TableCell>
                    <TableCell>{getStatusBadge(fine.status)}</TableCell>
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

export default NewFines;