import { useSession } from '@/contexts/SessionContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, profile, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return null; // The main App component handles the initial loading screen
  }

  if (!session || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
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

  return <Outlet />;
};

export default ProtectedRoute;