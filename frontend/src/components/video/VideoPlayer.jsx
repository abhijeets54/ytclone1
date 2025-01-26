import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography, Avatar, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import api from '../../utils/axios.config';
import VideoComments from './VideoComments';
import { useSelector, useDispatch } from 'react-redux';
import { toggleVideoLike } from '../../redux/slices/videoSlice';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/videos/${videoId}`);
        setVideo(response.data.data);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleLike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      dispatch(toggleVideoLike(videoId));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
      <ReactPlayer
        url={video.videoFile}
        controls
        width="100%"
        height="600px"
      />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">{video.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar src={video.owner.avatar} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">{video.owner.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {video.views} views
            </Typography>
          </Box>
          <Button 
            startIcon={<ThumbUpIcon />}
            onClick={handleLike}
            sx={{ ml: 'auto' }}
          >
            Like
          </Button>
        </Box>
        <Typography sx={{ mt: 2 }}>{video.description}</Typography>
      </Box>
      <VideoComments videoId={videoId} />
    </Box>
  );
};

export default VideoPlayer;
