import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { login } from '../../redux/slices/authSlice';
import { authService } from '../../services/auth.service';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      dispatch(login(response.data));
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Login to VibeTube</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
