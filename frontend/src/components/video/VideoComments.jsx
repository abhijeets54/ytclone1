import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import api from '../../utils/axios.config';
import toast from 'react-hot-toast';

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${videoId}`);
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingComment?.content.trim()) return;

    try {
      await api.patch(`/comments/c/${commentId}`, {
        content: editingComment.content
      });
      setEditingComment(null);
      fetchComments();
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/c/${commentId}`);
      fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>

      {user && (
        <Box component="form" onSubmit={handleAddComment} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 1 }}
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </Box>
      )}

      <List>
        {comments.map(comment => (
          <ListItem
            key={comment._id}
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <Avatar
              src={comment.owner.avatar}
              sx={{ mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">
                {comment.owner.fullName}
              </Typography>
              
              {editingComment?.id === comment._id ? (
                <Box>
                  <TextField
                    fullWidth
                    value={editingComment.content}
                    onChange={(e) => setEditingComment({
                      ...editingComment,
                      content: e.target.value
                    })}
                    multiline
                    sx={{ mt: 1 }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setEditingComment(null)}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2">
                  {comment.content}
                </Typography>
              )}
            </Box>

            {user?._id === comment.owner._id && (
              <Box>
                <IconButton
                  size="small"
                  onClick={() => setEditingComment({
                    id: comment._id,
                    content: comment.content
                  })}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default VideoComments;
