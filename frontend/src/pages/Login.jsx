import { Box, Container, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Welcome to VibeTube
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;
