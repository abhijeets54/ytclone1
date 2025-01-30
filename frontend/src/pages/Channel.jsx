import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import ChannelHeader from '../components/channel/ChannelHeader';
import VideoCard from '../components/common/VideoCard';
import { userService } from '../services/user.service';
import { videoService } from '../services/video.service';

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Current URL:", window.location.pathname);
  console.log("Username from params:", username);
  console.log("Type of username:", typeof username);

  useEffect(() => {
    // Validate username before making API calls
    if (!username) {
      setError('Invalid channel URL');
      setLoading(false);
      return;
    }

    fetchChannelData();
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log the username being used
      console.log('Fetching channel data for username:', username);

      const [channelResponse, videosResponse] = await Promise.all([
        userService.getChannelProfile(username),
        videoService.getChannelVideos(username)
      ]);

      if (!channelResponse.data) {
        throw new Error('Channel not found');
      }

      setChannel(channelResponse.data);
      setVideos(videosResponse.data || []);
    } catch (error) {
      console.error('Error fetching channel data:', error);
      setError(error.response?.data?.message || 'Error loading channel');
      // Redirect to 404 page if channel not found
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async () => {
    await fetchChannelData();
  };

  if (loading) {
    return (
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        Loading...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        {error}
      </Box>
    );
  }

  if (!channel) {
    return (
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        Channel not found
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8 }}>
      <ChannelHeader 
        channel={channel} 
        onSubscriptionChange={handleSubscriptionChange}
      />

      <Box sx={{ px: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab label="Videos" />
          <Tab label="About" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            {videos.map(video => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                <VideoCard video={video} />
              </Grid>
            ))}
            {videos.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  No videos found
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <p>{channel.about || 'No channel description available.'}</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Channel;