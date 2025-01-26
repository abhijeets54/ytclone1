import { Box, Paper, Typography, Grid } from '@mui/material';
import { formatViews } from '../../utils/helpers';

const ChannelStats = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4">{formatViews(stats.totalViews)}</Typography>
          <Typography variant="body2" color="text.secondary">Total Views</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4">{stats.subscribersCount}</Typography>
          <Typography variant="body2" color="text.secondary">Subscribers</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4">{stats.videosCount}</Typography>
          <Typography variant="body2" color="text.secondary">Videos</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChannelStats;
