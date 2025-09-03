
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  role: string;
  [key: string]: any;
};

type SessionContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to clear all session data
  const clearSessionData = () => {
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.user.data');
    sessionStorage.removeItem('supabase.profile.data');
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    clearSessionData();
  };

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
        
        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('supabase.auth.token', JSON.stringify(session));
        if (profileData) {
          sessionStorage.setItem('supabase.profile.data', JSON.stringify(profileData));
        }
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
        
        // Store in sessionStorage
        sessionStorage.setItem('supabase.auth.token', JSON.stringify(session));
        if (profileData) {
          sessionStorage.setItem('supabase.profile.data', JSON.stringify(profileData));
        }
      } else {
        // Clear session data if user logs out
        clearSessionData();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
