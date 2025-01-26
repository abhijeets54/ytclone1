import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const VideoDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;
  const shouldShowMore = description.length > maxLength;

  const displayText = expanded ? description : description.slice(0, maxLength) + '...';

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {displayText}
      </Typography>
      {shouldShowMore && (
        <Button 
          onClick={() => setExpanded(!expanded)} 
          sx={{ mt: 1, p: 0 }}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </Box>
  );
};

export default VideoDescription;
