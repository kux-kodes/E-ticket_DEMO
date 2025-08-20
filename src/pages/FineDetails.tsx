import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Car, AlertTriangle, DollarSign, Calendar, MapPin, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { myFinesData } from '@/lib/mockData';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const FineDetails = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const fine = myFinesData.find(f => f.id === `#${fineId}`);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outstanding':
        return <Badge variant="secondary">Outstanding</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'disputed':
        return <Badge variant="outline">Disputed</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!fine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Fine not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Fine Details</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-foreground">Fine {fine.id}</CardTitle>
                <CardDescription className="text-foreground/70">Issued on {fine.date}</CardDescription>
              </div>
              {getStatusBadge(fine.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Violation</Label>
                <p className="text-lg font-semibold">{fine.violation}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Amount</Label>
                <p className="text-lg font-semibold">N$ {fine.amount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm text-foreground/70">Description</Label>
              <p>{fine.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><User className="w-4 h-4 mr-2" />Offender</Label>
                <p>{fine.offender}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><Car className="w-4 h-4 mr-2" />License Plate</Label>
                <p>{fine.licensePlate}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><MapPin className="w-4 h-4 mr-2" />Location</Label>
                <p>{fine.location}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><Shield className="w-4 h-4 mr-2" />Issuing Officer</Label>
                <p>{fine.officer} (Badge #{fine.officerBadge})</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><Calendar className="w-4 h-4 mr-2" />Due Date</Label>
                    <p>{fine.dueDate}</p>
                </div>
                {fine.status.toLowerCase() === 'paid' && fine.paymentDate && (
                    <div className="space-y-1">
                        <Label className="text-sm text-foreground/70 flex items-center"><Calendar className="w-4 h-4 mr-2" />Payment Date</Label>
                        <p>{fine.paymentDate}</p>
                    </div>
                )}
            </div>

            {(fine.status.toLowerCase() === 'outstanding' || fine.status.toLowerCase() === 'overdue') && (
              <div className="pt-4 flex gap-4">
                <Button onClick={() => navigate(`/payment/${fine.id.replace('#', '')}`)}>Pay Now</Button>
                <Button variant="outline" onClick={() => navigate(`/dispute-fine/${fine.id.replace('#', '')}`)}>Dispute Fine</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default FineDetails;