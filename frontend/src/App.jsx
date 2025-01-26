import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import Channel from './pages/Channel';
import Search from './pages/Search';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';
import { authService } from './services/auth.service';
import { login } from './redux/slices/authSlice';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // If no token, skip authentication check
          setInitializing(false);
          return;
        }
        const response = await authService.getCurrentUser();
        dispatch(login(response.data));
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitializing(false);
    }, 5000); // 5 seconds maximum loading time

    return () => clearTimeout(timeout);
  }, []);


  if (initializing) {
    return <LoadingSpinner />;
  }

  return (
<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={
          <ErrorBoundary fallback={<div>Error loading video</div>}>
            <VideoDetail />
          </ErrorBoundary>
        } />
        <Route path="/search" element={<Search />} />
        <Route path="/channel/:username" element={
          <ErrorBoundary fallback={<div>Channel not found</div>}>
            <Channel />
          </ErrorBoundary>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginForm />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/" replace /> : <RegisterForm />
        } />

        {/* Protected Routes */}
        <Route path="/channel/@me" element={
          <ProtectedRoute>
            <Channel />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Box>
  );
};

export default App;
