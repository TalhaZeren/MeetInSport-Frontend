import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

const PublicRoute = () => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    // Redirect based on their role
    const dashboardRoute = role === 'Coach' ? '/coaches/dashboard' : '/student/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;