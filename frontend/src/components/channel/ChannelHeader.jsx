import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Stack
} from '@mui/material';
import api from '../../utils/axios.config';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ChannelHeader = ({ channel, onSubscriptionChange }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const isOwnChannel = user?._id === channel._id;

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/subscriptions/c/${channel._id}`);
      onSubscriptionChange();
      toast.success(channel.isSubscribed ? 'Unsubscribed' : 'Subscribed');
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={channel.coverImage}
          alt="channel cover"
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 1
          }}
        />
        <Avatar
          src={channel.avatar}
          sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            bottom: -60,
            left: 32,
            border: '4px solid #121212'
          }}
        />
      </Box>

      <Box sx={{ mt: 8, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">{channel.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            @{channel.username}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              {channel.subscribersCount} subscribers
            </Typography>
            <Typography variant="body2">
              {channel.videosCount} videos
            </Typography>
          </Stack>
        </Box>

        {!isOwnChannel && (
          <Button
            variant={channel.isSubscribed ? "outlined" : "contained"}
            onClick={handleSubscribe}
            disabled={loading}
          >
            {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ChannelHeader;
