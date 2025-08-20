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
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';

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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-2xl font-bold text-foreground">Paid Fines</h1>
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
            <CardTitle className="text-xl text-foreground">All Paid Fines</CardTitle>
            <CardDescription>A complete record of all settled fines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fine ID</TableHead>
                  <TableHead>Offender</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead className="text-right">Amount (N$)</TableHead>
                  <TableHead className="text-right">Date Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidFinesData.map((fine) => (
                  <TableRow key={fine.id}>
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