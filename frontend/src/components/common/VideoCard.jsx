import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { formatViews, formatDuration } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const isYouTubeVideo = video.videoFile?.includes('youtube.com');
  
  const handleClick = (e) => {
    if (isYouTubeVideo) {
      e.preventDefault();
      window.open(video.videoFile, '_blank');
    }
  };

  return (
    <Card 
      component={Link} 
      to={isYouTubeVideo ? '#' : `/video/${video._id}`}
      onClick={handleClick}
      sx={{ 
        textDecoration: 'none',
        '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={video.thumbnail}
        alt={video.title}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {video.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {video.owner.fullName}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {formatViews(video.views)} views
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
