"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Fine {
  id: string;
  license_plate: string;
  violation_type: string;
  amount: number;
  due_date: string;
  location: string;
}

export default function DisputePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fineIds = searchParams.get('fines')?.split(',') || [];
  
  const [fines, setFines] = useState<Fine[]>([]);
  const [reason, setReason] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidenceFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitDispute = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for your dispute');
      return;
    }

    setLoading(true);
    
    try {
      // Upload evidence files to Supabase Storage
      const evidenceUrls: string[] = [];
      
      for (const file of evidenceFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('dispute-evidence')
          .upload(fileName, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('dispute-evidence')
          .getPublicUrl(fileName);
        
        evidenceUrls.push(publicUrl);
      }

      // Create dispute records
      for (const fine of fines) {
        const { error } = await supabase
          .from('disputes')
          .insert({
            user_id: user?.id,
            fine_id: fine.id,
            reason: reason,
            evidence_urls: evidenceUrls,
            status: 'pending'
          });

        if (error) throw error;

        // Update fine status
        await supabase
          .from('fines')
          .update({ status: 'disputed' })
          .eq('id', fine.id);
      }

      toast.success('Dispute submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to submit dispute. Please try again.');
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
          <h1 className="text-xl font-bold">Dispute Fine</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fines to Dispute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fines.map((fine) => (
                <div key={fine.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{fine.violation_type}</p>
                      <p className="text-sm text-gray-600">{fine.license_plate}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {fine.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R {fine.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Due: {format(new Date(fine.due_date), 'MMM dd')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispute Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Please explain why you believe this fine was issued incorrectly..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-sm text-gray-600 mt-1">{reason.length}/500 characters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Upload Files</Label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Accepted formats: PDF, JPG, PNG (max 5MB each)
                </p>
              </div>
              
              {evidenceFiles.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Uploaded files:</p>
                  <ul className="text-sm text-gray-600">
                    {evidenceFiles.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <Upload className="w-3 h-3 mr-1" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] font-bold"
          onClick={handleSubmitDispute}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Dispute'}
        </Button>
      </main>
    </div>
  );
}