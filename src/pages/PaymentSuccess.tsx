import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Payment Confirmation</h1>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/70">
              Your payment has been processed successfully. A receipt has been sent to your registered email address.
            </p>
            <Button 
              onClick={() => navigate('/my-fines')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to My Fines
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PaymentSuccess;