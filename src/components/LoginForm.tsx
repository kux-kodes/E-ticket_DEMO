import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // In a real app, you would handle authentication here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06404c] to-[#0a5a6a] p-4">
      <Card className="w-full max-w-md border-[#06404c]">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[#bcdc49] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#06404c]">D</span>
          </div>
          <CardTitle className="text-2xl text-[#06404c]">Welcome Back</CardTitle>
          <CardDescription className="text-[#06404c]/80">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#06404c]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#06404c]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#06404c]/30 focus:border-[#bcdc49] focus:ring-[#bcdc49]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#06404c]">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#06404c]/30 focus:border-[#bcdc49] focus:ring-[#bcdc49]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#06404c]/60 hover:text-[#06404c]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-[#06404c] hover:bg-[#06404c]/90 text-white">
              Sign In
            </Button>
            <div className="mt-4 text-center text-sm text-[#06404c]/70">
              <a href="#" className="text-[#bcdc49] hover:text-[#bcdc49]/80">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;