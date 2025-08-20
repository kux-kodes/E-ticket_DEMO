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
import { ArrowLeft, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const pendingDisputesData = [
  { id: '#8435', offender: 'Jim Halpert', violation: 'Speeding', amount: 750.00, date: '2024-07-30' },
  { id: '#8420', offender: 'Andy Bernard', violation: 'Illegal Parking', amount: 250.00, date: '2024-07-29' },
  { id: '#8411', offender: 'Stanley Hudson', violation: 'Running a red light', amount: 1000.00, date: '2024-07-28' },
  { id: '#8401', offender: 'Phyllis Vance', violation: 'Failure to signal', amount: 200.00, date: '2024-07-27' },
];

const PendingDisputes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDisputes = pendingDisputesData.filter(dispute =>
    dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.offender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.violation.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <TableHead className="font-bold text-foreground">Fine ID</TableHead>
                  <TableHead className="font-bold text-foreground">Offender</TableHead>
                  <TableHead className="font-bold text-foreground">Violation Type</TableHead>
                  <TableHead className="font-bold text-foreground">Date Submitted</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute) => (
                  <TableRow key={dispute.id} className="hover:shadow-neumorphic-inset">
                    <TableCell className="font-medium">{dispute.id}</TableCell>
                    <TableCell>{dispute.offender}</TableCell>
                    <TableCell>{dispute.violation}</TableCell>
                    <TableCell>{dispute.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    </TableCell>
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

export default PendingDisputes;