import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Car, AlertTriangle, DollarSign, Calendar, MapPin, Shield, Download, FileText, Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type DisputeDetails = {
  reason: string;
  evidence_urls: string[] | null;
  fines: {
    id: string;
    fine_date: string;
    violation_type: string;
    amount: number;
    location: string;
    license_plate: string;
    profiles: {
      first_name: string;
      last_name: string;
    }[] | null;
    officer: {
      first_name: string;
      last_name: string;
      badge_number: string;
    }[] | null;
  }[] | null;
};

const DisputeReview = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const [dispute, setDispute] = useState<DisputeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [officerNotes, setOfficerNotes] = useState('');

  useEffect(() => {
    const fetchDisputeDetails = async () => {
      if (!fineId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          reason,
          evidence_urls,
          fines (
            id,
            fine_date,
            violation_type,
            amount,
            location,
            license_plate,
            profiles (
              first_name,
              last_name
            ),
            officer:officer_id (
              first_name,
              last_name,
              badge_number
            )
          )
        `)
        .eq('fine_id', fineId)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        console.error('Error fetching dispute details:', error);
        showError('Failed to load dispute details or it has been resolved.');
        setDispute(null);
      } else {
        setDispute(data as unknown as DisputeDetails);
      }
      setLoading(false);
    };
    fetchDisputeDetails();
  }, [fineId]);

  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    const toastId = showLoading('Processing decision...');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      showError('You must be logged in to perform this action.');
      dismissToast(toastId);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('resolve-dispute', {
        body: JSON.stringify({
          fineId: fineId,
          decision: decision,
          notes: officerNotes,
          officerId: user.id,
        }),
      });

      if (error) throw error;

      dismissToast(toastId);
      showSuccess(`Dispute has been successfully ${decision.toLowerCase()}.`);
      navigate('/pending-disputes');
    } catch (error: any) {
      dismissToast(toastId);
      showError(`Failed to process decision: ${error.message}`);
    }
  };

  const fine = dispute?.fines?.[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Review Dispute</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/pending-disputes')}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Disputes
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          <>
            <Skeleton className="lg:col-span-1 h-96" />
            <Skeleton className="lg:col-span-2 h-96" />
          </>
        ) : !dispute || !fine ? (
          <div className="lg:col-span-3 text-center py-16">
            <CardTitle>Dispute Not Found</CardTitle>
            <CardDescription>This dispute may have already been resolved or does not exist.</CardDescription>
          </div>
        ) : (
          <>
            {/* Fine Details Column */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Fine #{fine.id.substring(0, 8).toUpperCase()}</CardTitle>
                  <CardDescription className="text-foreground/70">Issued on {new Date(fine.fine_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Violation</Label>
                    <p className="font-semibold">{fine.violation_type}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Amount</Label>
                    <p className="font-semibold">N$ {fine.amount.toFixed(2)}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Label className="text-sm text-foreground/70 flex items-center"><User className="w-4 h-4 mr-2" />Offender</Label>
                    <p>{fine.profiles?.[0] ? `${fine.profiles[0].first_name} ${fine.profiles[0].last_name}` : 'N/A'}</p>
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
                    <p>{fine.officer?.[0] ? `${fine.officer[0].first_name} ${fine.officer[0].last_name} (#${fine.officer[0].badge_number})` : 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dispute Details & Actions Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Dispute Details</CardTitle>
                  <CardDescription className="text-foreground/70">Review the citizen's claim and evidence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="disputeReason" className="font-semibold">Citizen's Reason</Label>
                    <p id="disputeReason" className="text-foreground/90 mt-2 p-3 bg-secondary/50 rounded-md border border-border/50">{dispute.reason}</p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Submitted Evidence</Label>
                    {dispute.evidence_urls && dispute.evidence_urls.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {dispute.evidence_urls.map((url, index) => (
                          <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/70 border border-border/50">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-5 w-5 text-foreground/70 flex-shrink-0" />
                              <span className="text-sm text-foreground truncate">Evidence File {index + 1}</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/70 mt-2">No evidence was submitted.</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="officerNotes" className="font-semibold">Officer Notes (Optional)</Label>
                    <Textarea id="officerNotes" placeholder="Add your notes regarding the decision..." className="mt-2" value={officerNotes} onChange={(e) => setOfficerNotes(e.target.value)} />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button variant="destructive" onClick={() => handleDecision('Rejected')}>
                      <X className="mr-2 h-4 w-4" />
                      Reject Dispute
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleDecision('Approved')}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve Dispute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default DisputeReview;