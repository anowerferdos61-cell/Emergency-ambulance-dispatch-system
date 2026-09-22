import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'driver') return <Navigate to="/driver/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Prevent drivers from accessing user patient dashboard
  if (!requiredRole && user.role === 'driver') {
    return <Navigate to="/driver/dashboard" replace />;
  }

  return children;
};
