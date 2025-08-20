import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Calendar, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

// Mock data for demonstration. In a real app, this would be fetched from an API.
const myFinesData = [
  { id: '#8435', violation: 'Speeding', amount: 750.00, date: '2024-07-30', status: 'Disputed' },
  { id: '#8433', violation: 'Illegal U-Turn', amount: 400.00, date: '2024-07-28', status: 'Outstanding' },
  { id: '#8430', violation: 'Speeding', amount: 900.00, date: '2024-07-15', status: 'Overdue' },
  { id: '#8421', violation: 'Illegal Parking', amount: 250.00, date: '2024-07-10', status: 'Paid' },
  { id: '#8415', violation: 'Running a red light', amount: 1000.00, date: '2024-07-05', status: 'Paid' },
];

const Payment = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const fine = myFinesData.find(f => f.id === `#${fineId}`);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    // For this demo, we'll just navigate to a success page.
    navigate('/payment-success');
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
            <h1 className="text-3xl font-bold text-foreground">Secure Payment</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/my-fines')}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to My Fines
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Fine Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-foreground/70">Fine ID</p>
                <p className="font-medium">{fine.id}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Violation</p>
                <p className="font-medium">{fine.violation}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Date Issued</p>
                <p className="font-medium">{fine.date}</p>
              </div>
              <div className="border-t border-border/50 pt-4 mt-4">
                <p className="text-lg text-foreground/70">Total Amount</p>
                <p className="text-3xl font-bold text-primary">N$ {fine.amount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your card details to pay.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePayment}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                      <Input id="expiryDate" placeholder="MM/YY" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                      <Input id="cvc" placeholder="123" className="pl-10" required />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground">
                  Pay N$ {fine.amount.toFixed(2)}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Payment;