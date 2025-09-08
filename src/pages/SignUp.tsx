import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { showError, showSuccess } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    license_number: '',
    vehicle_registration: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        showError("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        showError("Password must be at least 6 characters long.");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, first_name, last_name, phone_number, license_number, vehicle_registration } = formData;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone_number,
          license_number,
          vehicle_registration,
          role: 'citizen', // Default role for new sign-ups
        },
      },
    });

    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Registration successful! Please check your email to verify your account.');
      navigate('/auth');
    }
  };

  const progress = (step / 3) * 100;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-background shadow-neumorphic rounded-full flex items-center justify-center mx-auto mb-6">
            <Logo size="large" />
          </div>
          <CardTitle className="text-3xl text-foreground mb-2">Create Your Account</CardTitle>
          <CardDescription className="text-foreground/80">
            Step {step} of 3: {step === 1 ? 'Account Credentials' : step === 2 ? 'Personal Details' : 'Vehicle Information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-6" />
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={formData.last_name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} required />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="license_number">Driver's License Number</Label>
                    <Input id="license_number" value={formData.license_number} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_registration">Vehicle Registration</Label>
                    <Input id="vehicle_registration" placeholder="e.g., N12345W" value={formData.vehicle_registration} onChange={handleChange} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between mt-6">
              {step > 1 && <Button type="button" variant="outline" onClick={prevStep}>Back</Button>}
              {step < 3 && <Button type="button" onClick={nextStep} className="ml-auto">Next</Button>}
              {step === 3 && <Button type="submit" disabled={loading} className="ml-auto">{loading ? 'Submitting...' : 'Create Account'}</Button>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-foreground/70">
            Already have an account?{' '}
            <a href="/auth" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;