"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Fine {
  id: string;
  license_plate: string;
  violation_type: string;
  amount: number;
  due_date: string;
}

export default function PaymentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fineIds = searchParams.get('fines')?.split(',') || [];
  
  const [fines, setFines] = useState<Fine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fineIds.length > 0) {
      fetchFines();
    }
  }, [fineIds]);

  const fetchFines = async () => {
    const { data, error } = await supabase
      .from('fines')
      .select('*')
      .in('id', fineIds);

    if (!error && data) {
      setFines(data);
    }
  };

  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create payment records
      for (const fine of fines) {
        const { error } = await supabase
          .from('payments')
          .insert({
            user_id: user?.id,
            fine_id: fine.id,
            amount: fine.amount,
            payment_method: paymentMethod,
            payment_status: 'completed',
            transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });

        if (error) throw error;

        // Update fine status
        await supabase
          .from('fines')
          .update({ status: 'paid' })
          .eq('id', fine.id);
      }

      toast.success('Payment successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#c6e5df]">
      <header className="bg-[#06404c] text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-white">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Payment</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fines.map((fine) => (
                <div key={fine.id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{fine.violation_type}</p>
                    <p className="text-sm text-gray-600">{fine.license_plate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R {fine.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Due: {format(new Date(fine.due_date), 'MMM dd')}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total Amount</span>
                <span>R {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center space-x-2 cursor-pointer">
                    <Smartphone className="w-5 h-5" />
                    <span>Mobile Wallet</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="pos" id="pos" />
                  <Label htmlFor="pos" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="w-5 h-5" />
                    <span>Pay at POS</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {paymentMethod === 'card' && (
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Cardholder Name</Label>
                <Input
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] font-bold"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay R ${totalAmount.toFixed(2)}`}
        </Button>
      </main>
    </div>
  );
}