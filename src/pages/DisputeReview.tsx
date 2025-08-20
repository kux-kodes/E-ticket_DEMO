import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Car, AlertTriangle, DollarSign, Calendar, MapPin, Shield, Download, FileText, Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { myFinesData } from '@/lib/mockData';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '@/utils/toast';

const DisputeReview = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const fine = myFinesData.find(f => f.id === `#${fineId}`);

  const handleDecision = (decision: 'Approved' | 'Rejected') => {
    console.log(`Dispute for fine ${fine?.id} has been ${decision}.`);
    showSuccess(`Dispute has been successfully ${decision.toLowerCase()}.`);
    navigate('/pending-disputes');
  };

  if (!fine || fine.status.toLowerCase() !== 'disputed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dispute not found or already resolved.</p>
      </div>
    );
  }

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
        {/* Fine Details Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Fine {fine.id}</CardTitle>
              <CardDescription className="text-foreground/70">Issued on {fine.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Violation</Label>
                <p className="font-semibold">{fine.violation}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-foreground/70 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Amount</Label>
                <p className="font-semibold">N$ {fine.amount.toFixed(2)}</p>
              </div>
              <Separator />
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
                <p id="disputeReason" className="text-foreground/90 mt-2 p-3 bg-secondary/50 rounded-md border border-border/50">{fine.disputeReason}</p>
              </div>
              
              <div>
                <Label className="font-semibold">Submitted Evidence</Label>
                {fine.disputeEvidence && fine.disputeEvidence.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {fine.disputeEvidence.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/70 border border-border/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="h-5 w-5 text-foreground/70 flex-shrink-0" />
                          <span className="text-sm text-foreground truncate" title={file.name}>{file.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.url} download={file.name}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
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
                <Textarea id="officerNotes" placeholder="Add your notes regarding the decision..." className="mt-2" />
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
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default DisputeReview;