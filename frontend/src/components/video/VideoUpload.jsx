import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import { videoService } from '../../services/video.service';

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile || !formData.thumbnail) {
      toast.error('Please select both video and thumbnail');
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Simulated progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await videoService.uploadVideo(formDataToSend);
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success('Video uploaded successfully!');
      navigate(`/video/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>Upload Video</Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <input
              accept="video/*"
              type="file"
              id="video-upload"
              hidden
              onChange={(e) => handleFileChange(e, 'videoFile')}
            />
            <label htmlFor="video-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Select Video File
              </Button>
            </label>
            {formData.videoFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {formData.videoFile.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              type="file"
              id="thumbnail-upload"
              hidden
              onChange={(e) => handleFileChange(e, 'thumbnail')}
            />
            <label htmlFor="thumbnail-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Select Thumbnail
              </Button>
            </label>
            {formData.thumbnail && (
              <Box
                component="img"
                src={URL.createObjectURL(formData.thumbnail)}
                sx={{ width: '100%', height: 200, objectFit: 'cover', mt: 1 }}
              />
            )}
          </Box>

          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading... {progress}%
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={uploading}
            sx={{ mt: 3 }}
          >
            Upload Video
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default VideoUpload;
