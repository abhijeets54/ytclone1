import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  TextField,
  Avatar,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, cursor: 'pointer', color: 'red' }}
          onClick={() => navigate('/')}
        >
        <img src="/image.png" alt="Logo" style={{ width: '80px', height: '40px' }} />
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 2 }}>
          <TextField
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 600, mx: 'auto' }}
            InputProps={{
              endAdornment: (
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>

        {user ? (
          <>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/upload')}
              sx={{ mr: 2 }}
            >
              <VideoCallIcon />
            </IconButton>
            <IconButton onClick={handleMenu}>
              <Avatar src={user.avatar} alt={user.fullName} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                navigate(`/channel/${user.username}`);
                handleClose();
              }}>
                My Channel
              </MenuItem>
              <MenuItem onClick={() => {
                navigate('/dashboard');
                handleClose();
              }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
