import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist._id}`);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
      }}
    >
      <Box sx={{ position: 'relative' }} onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={playlist.videos[0]?.thumbnail || '/default-playlist.jpg'}
          alt={playlist.name}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <PlaylistPlayIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2">
            {playlist.videos.length} videos
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" noWrap>
            {playlist.name}
          </Typography>
          {onDelete && (
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(playlist._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {playlist.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
