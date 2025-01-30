import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TextField, Button, InputAdornment, Typography, Box } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
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
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#0a0a0a'
    }}>
      <Box sx={{
        background: 'linear-gradient(163deg, #00ff75 0%, #3700ff 100%)',
        borderRadius: '22px',
        padding: '2px',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0px 0px 30px 1px rgba(0, 255, 117, 0.30)'
        }
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '2em',
          backgroundColor: '#171717',
          borderRadius: '20px',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(0.98)',
            borderRadius: '20px'
          }
        }}>
          <Typography variant="h4" sx={{ 
            textAlign: 'center', 
            color: '#00ffc8', 
            mb: 4,
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,255,200,0.3)'
          }}>
            Welcome Back
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  color: '#00ffc8',
                  background: '#171717',
                  boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: '#00ffc8' }} />
                  </InputAdornment>
                ),
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              fullWidth
              placeholder="Password"
              type="password"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  color: '#00ffc8',
                  background: '#171717',
                  boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#00ffc8' }} />
                  </InputAdornment>
                ),
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button
              fullWidth
              type="submit"
              sx={{
                background: 'linear-gradient(163deg, #00ff75 0%, #3700ff 100%)',
                color: '#000',
                borderRadius: '5px',
                py: 1.5,
                mt: 2,
                transition: '0.4s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(163deg, #00642f 0%, #13034b 100%)',
                  color: '#00ffc8'
                }
              }}
            >
              Login
            </Button>

            <Button
              fullWidth
              sx={{
                color: '#00ffc8',
                mt: 2,
                border: '1px solid #00ffc8',
                borderRadius: '5px',
                py: 1.5,
                transition: '0.4s ease-in-out',
                '&:hover': {
                  background: 'rgba(0, 255, 200, 0.1)'
                }
              }}
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;