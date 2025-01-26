import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import VideoCard from '../common/VideoCard';
import { videoService } from '../../services/video.service';
import LoadingSpinner from '../common/LoadingSpinner';

const ChannelVideos = ({ username }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [username]);

  const fetchVideos = async () => {
    try {
      const response = await videoService.getChannelVideos(username);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {videos.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No videos uploaded yet
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {videos.map(video => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ChannelVideos;
