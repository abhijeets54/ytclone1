import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import ChannelHeader from '../components/channel/ChannelHeader';
import VideoCard from '../components/common/VideoCard';
import { userService } from '../services/user.service';
import { videoService } from '../services/video.service';

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannelData();
  }, [username]);

  const fetchChannelData = async () => {
    try {
      const [channelResponse, videosResponse] = await Promise.all([
        userService.getChannelProfile(username),
        videoService.getChannelVideos(username)
      ]);
      setChannel(channelResponse.data);
      setVideos(videosResponse.data);
    } catch (error) {
      console.error('Error fetching channel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async () => {
    await fetchChannelData();
  };

  if (loading) return <div>Loading...</div>;
  if (!channel) return <div>Channel not found</div>;

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
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <p>Channel description and details coming soon...</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Channel;
