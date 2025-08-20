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
import { ArrowLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';

const pendingDisputesData = [
  { id: '#8435', offender: 'Jim Halpert', violation: 'Speeding', amount: 750.00, date: '2024-07-30' },
  { id: '#8420', offender: 'Andy Bernard', violation: 'Illegal Parking', amount: 250.00, date: '2024-07-29' },
  { id: '#8411', offender: 'Stanley Hudson', violation: 'Running a red light', amount: 1000.00, date: '2024-07-28' },
  { id: '#8401', offender: 'Phyllis Vance', violation: 'Failure to signal', amount: 200.00, date: '2024-07-27' },
];

const PendingDisputes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#06404c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-white">Pending Disputes</h1>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:text-[#bcdc49] hover:bg-white/10"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-[#06404c]">All Pending Disputes</CardTitle>
            <CardDescription className="text-[#06404c]/70">Review and resolve outstanding fine disputes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-[#06404c]">Fine ID</TableHead>
                  <TableHead className="font-bold text-[#06404c]">Offender</TableHead>
                  <TableHead className="font-bold text-[#06404c]">Violation Type</TableHead>
                  <TableHead className="font-bold text-[#06404c]">Date Submitted</TableHead>
                  <TableHead className="font-bold text-[#06404c] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDisputesData.map((dispute) => (
                  <TableRow key={dispute.id} className="hover:bg-[#bcdc49]/10">
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