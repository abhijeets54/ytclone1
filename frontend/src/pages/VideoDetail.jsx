import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSelector } from 'react-redux';
import { videoService } from '../services/video.service';
import { likeService } from '../services/like.service';
import VideoComments from '../components/video/VideoComments';
import { formatViews, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await videoService.getVideoById(videoId);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like videos');
      return;
    }

    try {
      await likeService.toggleVideoLike(videoId);
      fetchVideo();
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box
            component="video"
            controls
            sx={{ width: '100%', borderRadius: 2 }}
            src={video.videoFile}
          />
          <Typography variant="h5" sx={{ mt: 2 }}>
            {video.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {formatViews(video.views)} views • {formatDate(video.createdAt)}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={handleLike} color={video.isLiked ? "primary" : "default"}>
              <ThumbUpIcon />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {video.likes}
              </Typography>
            </IconButton>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <Avatar src={video.owner.avatar} sx={{ width: 48, height: 48 }} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1">
                {video.owner.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.owner.subscribersCount} subscribers
              </Typography>
            </Box>
            {user?._id !== video.owner._id && (
              <Button
                variant={video.owner.isSubscribed ? "outlined" : "contained"}
                sx={{ ml: 'auto' }}
                onClick={handleLike}
              >
                {video.owner.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            )}
          </Box>

          <Typography variant="body1" sx={{ mt: 3 }}>
            {video.description}
          </Typography>

          <VideoComments videoId={videoId} />
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Related videos section - To be implemented */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetail;
