import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function DashboardRedirect() {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'citizen') {
    return <Navigate to="/citizen/dashboard" replace />;
  }

  if (user?.role === 'university') {
    return <Navigate to="/university/dashboard" replace />;
  }

  if (user?.role === 'industry') {
    return <Navigate to="/industry/dashboard" replace />;
  }

  if (user?.role === 'government') {
    return <Navigate to="/government/dashboard" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard/placeholder" replace />;
}