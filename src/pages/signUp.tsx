import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, CreditCard, Calendar, Car } from 'lucide-react';
import Logo from "@/components/Logo";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    // Step 2
    cardType: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    // Step 3
    licensePlate: '',
    vehicleMake: '',
    vehicleModel: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, cardType: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up data:', formData);
    // TODO: Add actual sign-up logic
    navigate('/dashboard');
  };

  const steps = ["Personal Info", "Payment Method", "Vehicle Details"];

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-background shadow-neumorphic rounded-full flex items-center justify-center mx-auto mb-6">
            <Logo size="large" />
          </div>
          <CardTitle className="text-3xl text-foreground mb-2">Create Account</CardTitle>
          <CardDescription className="text-foreground/80 text-lg">
            Join DRIVA today
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s, index) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > index + 1 ? 'bg-primary border-primary' : step === index + 1 ? 'border-primary' : 'border-border'}`}>
                    <span className={`${step > index + 1 ? 'text-primary-foreground' : step === index + 1 ? 'text-primary' : 'text-foreground/50'}`}>{index + 1}</span>
                  </div>
                  <p className={`text-xs mt-1 ${step === index + 1 ? 'text-primary font-semibold' : 'text-foreground/60'}`}>{s}</p>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > index + 1 ? 'bg-primary' : 'bg-border'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Card Type</Label>
                    <RadioGroup defaultValue="visa" value={formData.cardType} onValueChange={handleRadioChange} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visa" id="visa" />
                        <Label htmlFor="visa">Visa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mastercard" id="mastercard" />
                        <Label htmlFor="mastercard">Mastercard</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-10" value={formData.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                        <Input id="expiryDate" placeholder="MM/YY" className="pl-10" value={formData.expiryDate} onChange={(e) => handleChange('expiryDate', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                        <Input id="cvc" placeholder="123" className="pl-10" value={formData.cvc} onChange={(e) => handleChange('cvc', e.target.value)} required />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                      <Input id="licensePlate" placeholder="N 12345 WHK" className="pl-10" value={formData.licensePlate} onChange={(e) => handleChange('licensePlate', e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make</Label>
                    <Input id="vehicleMake" placeholder="e.g., Toyota" value={formData.vehicleMake} onChange={(e) => handleChange('vehicleMake', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input id="vehicleModel" placeholder="e.g., Hilux" value={formData.vehicleModel} onChange={(e) => handleChange('vehicleModel', e.target.value)} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col px-6 pb-6">
            <div className="w-full flex gap-4">
              {step > 1 && <Button type="button" variant="outline" onClick={prevStep} className="w-full">Back</Button>}
              {step < 3 && <Button type="button" onClick={nextStep} className="w-full">Next</Button>}
              {step === 3 && <Button type="submit" className="w-full">Create Account</Button>}
            </div>
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

export default SignUp;