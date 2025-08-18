import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up data:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06404c] to-[#0a5a6a] p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-[#bcdc49] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl font-bold text-[#06404c]">D</span>
          </div>
          <CardTitle className="text-3xl text-[#06404c] mb-2">Create Account</CardTitle>
          <CardDescription className="text-[#06404c]/80 text-lg">
            Join DRIVA today
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#06404c] font-medium">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#06404c] font-medium">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#06404c] font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#06404c] font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#06404c] font-medium">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#06404c] font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[#06404c]/60 hover:text-[#06404c] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#06404c] font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-[#06404c]/60 hover:text-[#06404c] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col px-8 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#06404c] hover:bg-[#06404c]/90 text-white text-lg font-medium shadow-lg transition-all hover:shadow-xl"
            >
              Create Account
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-[#06404c]/70">
                Already have an account?{' '}
                <a href="/" className="text-[#bcdc49] hover:text-[#bcdc49]/80 font-medium transition-colors">
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