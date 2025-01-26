// src/pages/Upload.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { videoService } from '../services/video.service';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !thumbnail) {
      toast.error('Please select both video and thumbnail');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('thumbnail', thumbnail);
      formData.append('title', title);
      formData.append('description', description);

      const response = await videoService.uploadVideo(formData);
      toast.success('Video uploaded successfully!');
      navigate(`/video/${response.data._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>Upload Video</Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            required
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <input
              accept="video/*"
              type="file"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="video-file"
            />
            <label htmlFor="video-file">
              <Button variant="outlined" component="span" fullWidth>
                {videoFile ? videoFile.name : 'Select Video'}
              </Button>
            </label>
          </Box>

          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              style={{ display: 'none' }}
              id="thumbnail-file"
            />
            <label htmlFor="thumbnail-file">
              <Button variant="outlined" component="span" fullWidth>
                {thumbnail ? thumbnail.name : 'Select Thumbnail'}
              </Button>
            </label>
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Video'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Upload;
