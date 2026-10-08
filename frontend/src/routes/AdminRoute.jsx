import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import useAuth from '../hooks/useAuth';

function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
