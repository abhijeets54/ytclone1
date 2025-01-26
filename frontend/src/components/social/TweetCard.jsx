import { Card, CardContent, CardHeader, Avatar, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/helpers';

const TweetCard = ({ tweet, onDelete }) => {
  const { user } = useSelector(state => state.auth);
  const isOwner = user?._id === tweet.owner._id;

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={tweet.owner.avatar} alt={tweet.owner.fullName}>
            {tweet.owner.fullName[0]}
          </Avatar>
        }
        action={
          isOwner && (
            <IconButton onClick={() => onDelete(tweet._id)}>
              <DeleteIcon />
            </IconButton>
          )
        }
        title={tweet.owner.fullName}
        subheader={formatDate(tweet.createdAt)}
      />
      <CardContent>
        <Typography variant="body1">
          {tweet.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
