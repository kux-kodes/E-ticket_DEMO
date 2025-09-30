import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, AlertCircle } from 'lucide-react';
import Logo from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { showError, showSuccess } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [signUpMethod, setSignUpMethod] = useState<'id' | 'email'>('id');
  const [formData, setFormData] = useState({
    // ID + Email flow
    id_number: '',
    id_email: '',
    id_password: '',
    id_confirmPassword: '',
    
    // Email only flow
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
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const nextStep = () => {
    if (signUpMethod === 'email' && step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }
    if (signUpMethod === 'id' && step === 1) {
      if (!formData.id_number) {
        setError("ID number is required.");
        return;
      }
      if (!formData.id_email) {
        setError("Email is required.");
        return;
      }
      if (formData.id_password !== formData.id_confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (formData.id_password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleIdSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { id_email, id_password, id_number, first_name, last_name, phone_number, license_number, vehicle_registration } = formData;

    try {
      // First create the user without email confirmation
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: id_email,
        password: id_password,
        options: {
          data: {
            first_name,
            last_name,
            phone_number,
            id_number,
            license_number,
            vehicle_registration,
            role: 'citizen',
            signup_method: 'id',
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If user was created successfully, sign them in immediately
      if (authData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: id_email,
          password: id_password,
        });

        if (signInError) {
          throw signInError;
        }

        showSuccess('Registration successful! Welcome to DRIVA.');
        navigate('/citizen-dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, first_name, last_name, phone_number, license_number, vehicle_registration } = formData;

    try {
      // First create the user without email confirmation
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
            phone_number,
            license_number,
            vehicle_registration,
            role: 'citizen',
            signup_method: 'email',
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If user was created successfully, sign them in immediately
      if (authData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (signInError) {
          throw signInError;
        }

        showSuccess('Registration successful! Welcome to DRIVA.');
        navigate('/citizen-dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <CardDescription className="text-foreground/80 text-lg">
            Join DRIVA today
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <Tabs value={signUpMethod} onValueChange={(value) => setSignUpMethod(value as 'id' | 'email')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="id" className="text-sm">
                <User className="h-4 w-4 mr-2" />
                ID & Email
              </TabsTrigger>
              <TabsTrigger value="email" className="text-sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Only
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <TabsContent value="id" className="space-y-4">
              <Progress value={progress} className="mb-6" />
              <CardDescription className="text-foreground/80 mb-4 text-center">
                Step {step} of 3: {step === 1 ? 'ID & Account' : step === 2 ? 'Personal Details' : 'Driver Information'}
              </CardDescription>
              
              <form onSubmit={handleIdSignUp}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="id-step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="id_number">ID Number</Label>
                        <Input 
                          id="id_number" 
                          value={formData.id_number} 
                          onChange={handleChange} 
                          placeholder="Enter your ID number"
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_email">Email Address</Label>
                        <Input 
                          id="id_email" 
                          type="email" 
                          value={formData.id_email} 
                          onChange={handleChange} 
                          placeholder="Enter your email"
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_password">Password</Label>
                        <Input 
                          id="id_password" 
                          type="password" 
                          value={formData.id_password} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_confirmPassword">Confirm Password</Label>
                        <Input 
                          id="id_confirmPassword" 
                          type="password" 
                          value={formData.id_confirmPassword} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="id-step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input 
                          id="first_name" 
                          value={formData.first_name} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input 
                          id="last_name" 
                          value={formData.last_name} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input 
                          id="phone_number" 
                          type="tel" 
                          value={formData.phone_number} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="id-step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="license_number">Driver's License Number</Label>
                        <Input 
                          id="license_number" 
                          placeholder="Enter your license number"
                          value={formData.license_number} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_registration">Vehicle Registration</Label>
                        <Input 
                          id="vehicle_registration" 
                          placeholder="e.g., N12345W" 
                          value={formData.vehicle_registration} 
                          onChange={handleChange} 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                      Back
                    </Button>
                  )}
                  {step < 3 && (
                    <Button type="button" onClick={nextStep} className="ml-auto" disabled={loading}>
                      Next
                    </Button>
                  )}
                  {step === 3 && (
                    <Button type="submit" disabled={loading} className="ml-auto">
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Progress value={progress} className="mb-6" />
              <CardDescription className="text-foreground/80 mb-4 text-center">
                Step {step} of 3: {step === 1 ? 'Account Credentials' : step === 2 ? 'Personal Details' : 'Driver Information'}
              </CardDescription>
              
              <form onSubmit={handleEmailSignUp}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="email-step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          placeholder="Enter your email"
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="email-step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input 
                          id="first_name" 
                          value={formData.first_name} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input 
                          id="last_name" 
                          value={formData.last_name} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input 
                          id="phone_number" 
                          type="tel" 
                          value={formData.phone_number} 
                          onChange={handleChange} 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="email-step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="license_number">Driver's License Number</Label>
                        <Input 
                          id="license_number" 
                          placeholder="Enter your license number"
                          value={formData.license_number} 
                          onChange={handleChange} 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_registration">Vehicle Registration</Label>
                        <Input 
                          id="vehicle_registration" 
                          placeholder="e.g., N12345W" 
                          value={formData.vehicle_registration} 
                          onChange={handleChange} 
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                      Back
                    </Button>
                  )}
                  {step < 3 && (
                    <Button type="button" onClick={nextStep} className="ml-auto" disabled={loading}>
                      Next
                    </Button>
                  )}
                  {step === 3 && (
                    <Button type="submit" disabled={loading} className="ml-auto">
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-foreground/70">
            Already have an account?{' '}
            <a 
              href="/sign-in" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;