import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, ShieldCheck, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const CitizenDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Citizen Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/')}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome, John Doe!</h2>
          <p className="text-foreground/70">Here's a summary of your traffic fines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Outstanding Fines</CardTitle>
                <FileText className="h-6 w-6 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
              <p className="text-foreground/70">Totaling N$ 1,250.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Paid Fines</CardTitle>
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
              <p className="text-foreground/70">All settled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Disputed Fines</CardTitle>
                <Gavel className="h-6 w-6 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1</p>
              <p className="text-foreground/70">Under review</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Your Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70 mb-4">View a detailed list of all your fines, pay outstanding amounts, or submit a dispute if you believe there has been an error.</p>
            <Button onClick={() => navigate('/my-fines')}>
              View My Fines <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default CitizenDashboard;