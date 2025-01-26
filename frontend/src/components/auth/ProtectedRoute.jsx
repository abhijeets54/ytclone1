import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return children;
};

export default ProtectedRoute;
