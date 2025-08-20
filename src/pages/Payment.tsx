import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Calendar, Lock } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError, showLoading, dismissToast, showSuccess } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type FineSummary = {
  ids: string[];
  totalAmount: number;
  description: string;
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fineId: singleFineId } = useParams();

  const [summary, setSummary] = useState<FineSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFineDetails = async () => {
      setLoading(true);
      const fromState = location.state as { fineIds: string[], totalAmount: number };

      if (fromState?.fineIds?.length > 0) {
        setSummary({
          ids: fromState.fineIds,
          totalAmount: fromState.totalAmount,
          description: `${fromState.fineIds.length} fine(s) selected`,
        });
      } else if (singleFineId) {
        const { data, error } = await supabase
          .from('fines')
          .select('id, violation_type, amount')
          .eq('id', singleFineId)
          .single();
        
        if (error || !data) {
          showError('Failed to load fine details.');
          setSummary(null);
        } else {
          setSummary({
            ids: [data.id],
            totalAmount: data.amount,
            description: data.violation_type,
          });
        }
      } else {
        showError('No fine selected for payment.');
        navigate('/my-fines');
      }
      setLoading(false);
    };
    fetchFineDetails();
  }, [singleFineId, location.state, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || summary.ids.length === 0) return;

    const toastId = showLoading('Processing payment...');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      showError('You must be logged in to pay fines.');
      dismissToast(toastId);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('pay-fines', {
        body: JSON.stringify({
          fineIds: summary.ids,
          userId: user.id,
          paymentMethod: 'Credit Card', // Mocked for now
        }),
      });

      if (error) throw error;

      dismissToast(toastId);
      showSuccess('Payment successful!');
      navigate('/payment-success');
    } catch (error: any) {
      dismissToast(toastId);
      showError(`Payment failed: ${error.message}`);
    }
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
            <Button variant="ghost" onClick={() => navigate('/my-fines')}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to My Fines
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Payment Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-2/3" />
                  <div className="border-t pt-4 mt-4"><Skeleton className="h-10 w-1/2" /></div>
                </div>
              ) : !summary ? (
                <p>No fine details available.</p>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Details</p>
                    <p className="font-medium">{summary.description}</p>
                  </div>
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <p className="text-lg text-foreground/70">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">N$ {summary.totalAmount.toFixed(2)}</p>
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading || !summary}>
                  {summary ? `Pay N$ ${summary.totalAmount.toFixed(2)}` : 'Loading...'}
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