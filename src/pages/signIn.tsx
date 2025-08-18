import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06404c] to-[#0a5a6a] p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-[#bcdc49] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl font-bold text-[#06404c]">D</span>
          </div>
          <CardTitle className="text-3xl text-[#06404c] mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-[#06404c]/80 text-lg">
            Sign in to your DRIVA account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
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
              <Label htmlFor="password" className="text-[#06404c] font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#bcdc49] focus:ring-[#bcdc49] border-[#06404c]/20 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#06404c]/70">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#bcdc49] hover:text-[#bcdc49]/80 font-medium transition-colors">
                Forgot password?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col px-8 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#06404c] hover:bg-[#06404c]/90 text-white text-lg font-medium shadow-lg transition-all hover:shadow-xl"
            >
              Sign In
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-[#06404c]/70">
                Don't have an account?{' '}
                <a href="/sign-up" className="text-[#bcdc49] hover:text-[#bcdc49]/80 font-medium transition-colors">
                  Sign up here
                </a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;