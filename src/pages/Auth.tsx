import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { useTheme } from 'next-themes';

const Auth = () => {
  const navigate = useNavigate();
  const { session, profile } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    if (session && profile) {
      switch (profile.role) {
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
  }, [session, profile, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-background shadow-neumorphic rounded-full flex items-center justify-center mx-auto mb-6">
            <Logo size="large" />
          </div>
          <CardTitle className="text-3xl text-foreground mb-2">Welcome to DRIVA</CardTitle>
          <CardDescription className="text-foreground/80 text-lg">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={theme === 'dark' ? 'dark' : 'light'}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;