// components/ProtectedRoute.tsx
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, profile, loading, logout } = useSession();
  const location = useLocation();
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!session) return;

    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      // Clear existing timers
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      setShowInactivityWarning(false);

      // Set new timers
      warningTimer = setTimeout(() => {
        // Show warning after 25 minutes
        setShowInactivityWarning(true);
      }, 25 * 60 * 1000); // 25 minutes

      inactivityTimer = setTimeout(() => {
        // Log out after 30 minutes of inactivity
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Events that reset the inactivity timer
    const events = ['mousedown', 'keypress', 'mousemove', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimers);
    });

    // Initialize timers
    resetTimers();

    // Cleanup function
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimers);
      });
    };
  }, [session, logout]);

  // Handle browser/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear session storage when browser/tab is closed
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.user.data');
      sessionStorage.removeItem('supabase.profile.data');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!session || !profile) {
    // Clear any residual session data
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.user.data');
    sessionStorage.removeItem('supabase.profile.data');
    
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // User is logged in but doesn't have the right role.
    // Redirect them to their own dashboard to prevent access.
    switch (profile.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'officer':
      case 'department_admin':
        return <Navigate to="/dashboard" replace />;
      case 'citizen':
        return <Navigate to="/citizen-dashboard" replace />;
      default:
        // If role is unknown, send to home page
        return <Navigate to="/" replace />;
    }
  }

  return (
    <>
      {showInactivityWarning && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-md shadow-lg z-50">
          <p>You will be logged out due to inactivity in 5 minutes.</p>
          <button 
            onClick={() => setShowInactivityWarning(false)}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
