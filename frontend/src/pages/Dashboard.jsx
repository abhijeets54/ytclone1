import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs
} from '@mui/material';
import { useSelector } from 'react-redux';
import VideoCard from '../components/common/VideoCard';
import api from '../utils/axios.config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, videosResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/videos')
      ]);
      setStats(statsResponse.data.data);
      setVideos(videosResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Views</Typography>
            <Typography variant="h4">{stats?.totalViews || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Subscribers</Typography>
            <Typography variant="h4">{stats?.subscribersCount || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Videos</Typography>
            <Typography variant="h4">{stats?.videosCount || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Videos" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {videos.map(video => (
            <Grid item xs={12} sm={6} md={4} key={video._id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography>Analytics coming soon...</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
