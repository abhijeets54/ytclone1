import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ open, onClose, width = 240 }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Subscriptions', icon: <SubscriptionsIcon />, path: '/subscriptions', auth: true },
    { text: 'Library', icon: <VideoLibraryIcon />, path: '/library', auth: true },
    { text: 'History', icon: <HistoryIcon />, path: '/history', auth: true },
  ];

  const handleNavigation = (path, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
    if (onClose) onClose();
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100vh - 64px)'
        }
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path, item.auth)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
