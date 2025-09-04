import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import Logo from "@/components/Logo";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const namibianRegions = [
  "Khomas", "Erongo", "Hardap", "Karas", "Kavango East", "Kavango West", 
  "Kunene", "Ohangwena", "Omaheke", "Omusati", "Oshana", "Oshikoto", 
  "Otjozondjupa", "Zambezi"
];

const DepartmentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    district: '',
    address: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: '',
    contact_phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegionChange = (value: string) => {
    setFormData(prev => ({ ...prev, region: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = showLoading('Submitting registration...');

    try {
      const { error } = await supabase.functions.invoke('register-department', {
        body: JSON.stringify(formData),
      });

      if (error) throw error;

      dismissToast(toastId);
      showSuccess('Registration submitted!');
      navigate('/department-registration-success');
    } catch (error: unknown) {
      dismissToast(toastId);
      showError(`Registration failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-background shadow-neumorphic rounded-full flex items-center justify-center mx-auto mb-6">
            <Logo size="large" />
          </div>
          <CardTitle className="text-3xl text-foreground mb-2">Department Registration</CardTitle>
          <CardDescription className="text-foreground/80 text-lg">
            Register your department to start using the DRIVA system.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input id="name" placeholder="e.g., Khomas Regional Traffic Department" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select onValueChange={handleRegionChange} value={formData.region} required>
                  <SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger>
                  <SelectContent>
                    {namibianRegions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="e.g., Windhoek" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Department Address</Label>
              <Textarea id="address" placeholder="Enter the physical address of the department" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_first_name">Head Officer's First Name</Label>
                <Input id="contact_first_name" value={formData.contact_first_name} onChange={(e) => handleChange('contact_first_name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_last_name">Head Officer's Last Name</Label>
                <Input id="contact_last_name" value={formData.contact_last_name} onChange={(e) => handleChange('contact_last_name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Head Officer's Email</Label>
                <Input id="contact_email" type="email" value={formData.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Head Officer's Phone</Label>
                <Input id="contact_phone" type="tel" value={formData.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col px-6 pb-6">
            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground text-lg font-medium">
              Submit Registration
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-foreground/70">
                Already have an account?{' '}
                <a href="/sign-in" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DepartmentRegistration;