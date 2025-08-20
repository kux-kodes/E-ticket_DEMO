import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const DisputeFine = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Dispute Fine</h1>
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
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Dispute Fine #{fineId}</CardTitle>
            <CardDescription className="text-foreground/70">Please provide a reason and any supporting evidence for your dispute.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Dispute</Label>
              <Textarea id="reason" placeholder="Explain why you are disputing this fine..." rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evidence">Upload Evidence</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-foreground/60" />
                    <p className="mb-2 text-sm text-foreground/70"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-foreground/60">PNG, JPG, PDF (MAX. 5MB)</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div> 
            </div>
            <Button className="w-full bg-primary text-primary-foreground">Submit Dispute</Button>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default DisputeFine;