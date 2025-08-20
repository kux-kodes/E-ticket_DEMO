import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Car, AlertTriangle, DollarSign, Calendar, MapPin, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

type FineDetailsData = {
  id: string;
  fine_date: string;
  due_date: string;
  status: string;
  violation_type: string;
  amount: number;
  description: string;
  license_plate: string;
  location: string;
  payment_date?: string; // This might not be on the fine table directly
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
  officer: {
    first_name: string;
    last_name: string;
    badge_number: string;
  } | null;
};

const FineDetails = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const [fine, setFine] = useState<FineDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFineDetails = async () => {
      if (!fineId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('fines')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          ),
          officer:officer_id (
            first_name,
            last_name,
            badge_number
          )
        `)
        .eq('id', fineId)
        .single();

      if (error || !data) {
        console.error('Error fetching fine details:', error);
        showError('Failed to load fine details.');
        setFine(null);
      } else {
        setFine(data as FineDetailsData);
      }
      setLoading(false);
    };
    fetchFineDetails();
  }, [fineId]);

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
      case 'waived':
        return <Badge className="bg-blue-500 text-white">Waived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
          {loading ? (
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          ) : !fine ? (
            <CardContent className="p-6 text-center">
              <CardTitle>Fine Not Found</CardTitle>
              <CardDescription>The requested fine could not be found.</CardDescription>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-foreground">Fine #{fine.id.substring(0, 8).toUpperCase()}</CardTitle>
                    <CardDescription className="text-foreground/70">Issued on {new Date(fine.fine_date).toLocaleDateString()}</CardDescription>
                  </div>
                  {getStatusBadge(fine.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Violation</Label>
                    <p className="text-lg font-semibold">{fine.violation_type}</p>
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
                    <p>{fine.profiles ? `${fine.profiles.first_name} ${fine.profiles.last_name}` : 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><Car className="w-4 h-4 mr-2" />License Plate</Label>
                    <p>{fine.license_plate}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><MapPin className="w-4 h-4 mr-2" />Location</Label>
                    <p>{fine.location}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><Shield className="w-4 h-4 mr-2" />Issuing Officer</Label>
                    <p>{fine.officer ? `${fine.officer.first_name} ${fine.officer.last_name} (#${fine.officer.badge_number})` : 'N/A'}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <Label className="text-sm text-foreground/70 flex items-center"><Calendar className="w-4 h-4 mr-2" />Due Date</Label>
                        <p>{new Date(fine.due_date).toLocaleDateString()}</p>
                    </div>
                    {fine.status.toLowerCase() === 'paid' && fine.payment_date && (
                        <div className="space-y-1">
                            <Label className="text-sm text-foreground/70 flex items-center"><Calendar className="w-4 h-4 mr-2" />Payment Date</Label>
                            <p>{new Date(fine.payment_date).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>

                {(fine.status.toLowerCase() === 'outstanding' || fine.status.toLowerCase() === 'overdue') && (
                  <div className="pt-4 flex gap-4">
                    <Button onClick={() => navigate(`/payment/${fine.id}`)}>Pay Now</Button>
                    <Button variant="outline" onClick={() => navigate(`/dispute-fine/${fine.id}`)}>Dispute Fine</Button>
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default FineDetails;