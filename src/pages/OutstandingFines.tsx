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

const outstandingFinesData = [
  { id: '#8433', offender: 'Michael Scott', violation: 'Illegal U-Turn', amount: 400.00, dueDate: '2024-08-15', status: 'Outstanding' },
  { id: '#8434', offender: 'Dwight Schrute', violation: 'Failure to yield', amount: 600.00, dueDate: '2024-08-15', status: 'Outstanding' },
  { id: '#8437', offender: 'Angela Martin', violation: 'Driving too slow', amount: 150.00, dueDate: '2024-07-20', status: 'Overdue' },
  { id: '#8438', offender: 'Kevin Malone', violation: 'Broken taillight', amount: 250.00, dueDate: '2024-08-12', status: 'Outstanding' },
  { id: '#8430', offender: 'Oscar Martinez', violation: 'Speeding', amount: 900.00, dueDate: '2024-07-15', status: 'Overdue' },
];

const OutstandingFines = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outstanding':
        return <Badge variant="secondary">Outstanding</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-2xl font-bold text-foreground">Outstanding Fines</h1>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">All Outstanding Fines</CardTitle>
            <CardDescription>A record of all unpaid and overdue fines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fine ID</TableHead>
                  <TableHead>Offender</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead className="text-right">Amount (N$)</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingFinesData.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell className="font-medium">{fine.id}</TableCell>
                    <TableCell>{fine.offender}</TableCell>
                    <TableCell>{fine.violation}</TableCell>
                    <TableCell className="text-right">{fine.amount.toFixed(2)}</TableCell>
                    <TableCell>{fine.dueDate}</TableCell>
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

export default OutstandingFines;