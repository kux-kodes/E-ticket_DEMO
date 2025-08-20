import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Calendar, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type Fine = {
  id: string;
  violation_type: string;
  amount: number;
  fine_date: string;
};

const Payment = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const [fine, setFine] = useState<Fine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFine = async () => {
      if (!fineId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('fines')
        .select('id, violation_type, amount, fine_date')
        .eq('id', fineId)
        .single();

      if (error || !data) {
        showError('Failed to load fine details.');
        setFine(null);
      } else {
        setFine(data);
      }
      setLoading(false);
    };
    fetchFine();
  }, [fineId]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    // For this demo, we'll just navigate to a success page.
    navigate('/payment-success');
  };

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
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-10 w-1/2" />
                  </div>
                </div>
              ) : !fine ? (
                <p>Fine not found.</p>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Fine ID</p>
                    <p className="font-medium">{fine.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Violation</p>
                    <p className="font-medium">{fine.violation_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Date Issued</p>
                    <p className="font-medium">{new Date(fine.fine_date).toLocaleDateString()}</p>
                  </div>
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <p className="text-lg text-foreground/70">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">N$ {fine.amount.toFixed(2)}</p>
                  </div>
                </>
              )}
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading || !fine}>
                  {fine ? `Pay N$ ${fine.amount.toFixed(2)}` : 'Loading...'}
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