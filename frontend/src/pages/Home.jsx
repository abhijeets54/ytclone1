import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import VideoCard from '../components/common/VideoCard';
import { videoService } from '../services/video.service';
import { sampleVideosService } from '../services/sampleVideos.service';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [userVideos, setUserVideos] = useState([]);
  const [sampleVideos, setSampleVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Fetch both user videos and sample videos concurrently
        const [userVidsResponse, sampleVids] = await Promise.all([
          videoService.getAllVideos(1).catch(() => ({ data: { videos: [] } })),
          sampleVideosService.getSampleVideos()
        ]);

        setUserVideos(userVidsResponse.data?.videos || []);
        setSampleVideos(sampleVids);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <Typography color="error">Error loading videos: {error}</Typography>
      </Box>
    );
  }

  const allVideos = [...userVideos, ...sampleVideos];

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Grid container spacing={3}>
        {allVideos.map(video => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
