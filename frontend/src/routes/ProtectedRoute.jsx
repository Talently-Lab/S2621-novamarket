import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
