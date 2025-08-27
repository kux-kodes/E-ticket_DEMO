import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, File as FileIcon, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const DisputeFine = () => {
  const navigate = useNavigate();
  const { fineId } = useParams();
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fineId || !reason) {
      showError("Please provide a reason for your dispute.");
      return;
    }
    setIsSubmitting(true);
    const toastId = showLoading('Submitting your dispute...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to submit a dispute.");

      // 1. Upload files to storage
      const evidenceUrls: string[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(file => {
          const filePath = `${user.id}/${fineId}/${uuidv4()}-${file.name}`;
          return supabase.storage.from('dispute_evidence').upload(filePath, file);
        });

        const uploadResults = await Promise.all(uploadPromises);
        
        for (const result of uploadResults) {
          if (result.error) throw result.error;
          const { data: { publicUrl } } = supabase.storage.from('dispute_evidence').getPublicUrl(result.data.path);
          evidenceUrls.push(publicUrl);
        }
      }

      // 2. Insert dispute record into the database
      const { error: insertError } = await supabase.from('disputes').insert({
        fine_id: fineId,
        user_id: user.id,
        reason: reason,
        evidence_urls: evidenceUrls,
        status: 'pending',
      });
      if (insertError) throw insertError;

      // 3. Update the fine status to 'disputed'
      const { error: updateError } = await supabase
        .from('fines')
        .update({ status: 'disputed' })
        .eq('id', fineId);
      if (updateError) throw updateError;

      dismissToast(toastId);
      showSuccess('Your dispute has been submitted successfully.');
      navigate('/my-fines');

    } catch (error: any) {
      dismissToast(toastId);
      showError(`Submission failed: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardTitle className="text-xl text-foreground">Dispute Fine #{fineId?.substring(0, 8).toUpperCase()}</CardTitle>
            <CardDescription className="text-foreground/70">Please provide a reason and any supporting evidence for your dispute.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Dispute</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Explain why you are disputing this fine..." 
                  rows={5} 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence">Upload Evidence</Label>
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="dropzone-file" 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors ${isDragging ? 'border-primary' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-foreground/60" />
                      <p className="mb-2 text-sm text-foreground/70"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-foreground/60">PNG, JPG, PDF (MAX. 5MB)</p>
                    </div>
                    <Input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf"
                      disabled={isSubmitting}
                    />
                  </label>
                </div> 
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">Attached Files:</h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/70 border border-border/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileIcon className="h-5 w-5 text-foreground/70 flex-shrink-0" />
                          <span className="text-sm text-foreground truncate" title={file.name}>{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => !isSubmitting && removeFile(file.name)} disabled={isSubmitting}>
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DisputeFine;