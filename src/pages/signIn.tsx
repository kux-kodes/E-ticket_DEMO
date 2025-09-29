import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, AlertCircle, User } from 'lucide-react';
import Logo from "@/components/Logo";
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SignIn = () => { // Changed from signIn to SignIn
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMethod, setLoginMethod] = useState<'email' | 'id'>('email');
  const [formData, setFormData] = useState({
    email: '',
    idNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear any existing session data when signin page loads
  useEffect(() => {
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.user.data');
    sessionStorage.removeItem('supabase.profile.data');
    
    // Check if we were redirected here due to authentication issue
    if (location.state?.from) {
      setError('Please sign in to access that page');
    }
  }, [location]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let userEmail = formData.email;

      // If logging in with ID number, first look up the associated email
      if (loginMethod === 'id' && formData.idNumber) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id_number', formData.idNumber)
          .single();

        if (profileError || !profileData) {
          throw new Error('Invalid ID number or user not found');
        }
        
        userEmail = profileData.email;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (data.session) {
        // Store session in sessionStorage
        sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        sessionStorage.setItem('lastActivity', Date.now().toString());
        
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileData) {
          sessionStorage.setItem('supabase.profile.data', JSON.stringify(profileData));
          
          // Redirect based on role
          switch (profileData.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'officer':
            case 'department_admin':
              navigate('/dashboard');
              break;
            case 'citizen':
              navigate('/citizen-dashboard');
              break;
            default:
              navigate('/');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-background shadow-neumorphic rounded-full flex items-center justify-center mx-auto mb-6">
            <Logo size="large" />
          </div>
          <CardTitle className="text-3xl text-foreground mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-foreground/80 text-lg">
            Sign in to your DRIVA account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'id')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="text-sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="id" className="text-sm">
                <User className="h-4 w-4 mr-2" />
                ID Number
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="pl-10 h-12 text-base pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary text-primary-foreground text-lg font-medium mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="id" className="space-y-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* ID Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-foreground font-medium">
                    ID Number
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter your ID number"
                      value={formData.idNumber}
                      onChange={(e) => handleChange('idNumber', e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="pl-10 h-12 text-base pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary text-primary-foreground text-lg font-medium mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

       <CardFooter className="flex flex-col px-6 pb-6">
  <p className="text-sm text-foreground/70 text-center">
    Don't have an account?{' '}
    <a 
      href="/sign-up"  
      className="text-primary hover:text-primary/80 font-medium transition-colors"
    >
      Sign Up
    </a>
  </p>
   </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;

