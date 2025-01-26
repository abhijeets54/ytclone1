import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Avatar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import api from '../../utils/axios.config';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    avatar: null,
    coverImage: null
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setAvatarPreview(reader.result);
        else setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await api.post('/users/register', formDataToSend);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Register for VibeTube</Typography>
        <form onSubmit={handleSubmit}>
          Username<TextField
            fullWidth
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          Email
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          Full Name
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          Password (Please use a strong password)
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          /> 

          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="avatar-upload"
              hidden
              onChange={(e) => handleFileChange(e, 'avatar')}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Avatar
              </Button>
            </label>
            {avatarPreview && (
              <Avatar
                src={avatarPreview}
                sx={{ width: 100, height: 100, mt: 2, mx: 'auto' }}
              />
            )}
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="cover-upload"
              hidden
              onChange={(e) => handleFileChange(e, 'coverImage')}
            />
            <label htmlFor="cover-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Cover Image
              </Button>
            </label>
            {coverPreview && (
              <Box
                component="img"
                src={coverPreview}
                sx={{ width: '100%', height: 150, objectFit: 'cover', mt: 2 }}
              />
            )}
          </Box>

          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
