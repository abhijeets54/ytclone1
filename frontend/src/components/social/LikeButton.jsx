import { IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { likeService } from '../../services/like.service';

const LikeButton = ({ videoId, initialLikes = 0, initialIsLiked = false, onLikeUpdate }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like videos');
      navigate('/login');
      return;
    }

    try {
      const response = await likeService.toggleVideoLike(videoId);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
      if (onLikeUpdate) {
        onLikeUpdate(response.data);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  return (
    <IconButton onClick={handleLike} color={isLiked ? "primary" : "default"}>
      <ThumbUpIcon />
      <Typography variant="body2" sx={{ ml: 1 }}>
        {likes}
      </Typography>
    </IconButton>
  );
};

export default LikeButton;
