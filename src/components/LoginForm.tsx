import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CreditCard, FileText } from 'lucide-react';

const LoginForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [showPassport, setShowPassport] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { idNumber, passportNumber });
    // In a real app, you would handle authentication here
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
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2">
              <Label htmlFor="idNumber" className="text-[#06404c] font-medium">ID Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber" className="text-[#06404c] font-medium">Passport Number</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-[#06404c]/60" />
                <Input
                  id="passportNumber"
                  type={showPassport ? "text" : "password"}
                  placeholder="Enter your passport number"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="pl-12 h-12 border-[#06404c]/20 focus:border-[#bcdc49] focus:ring-[#bcdc49] text-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassport(!showPassport)}
                  className="absolute right-3 top-3.5 text-[#06404c]/60 hover:text-[#06404c] transition-colors"
                >
                  {showPassport ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
              <a href="#" className="text-[#bcdc49] hover:text-[#bcdc49]/80 font-medium transition-colors">
                Need help with your credentials?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;