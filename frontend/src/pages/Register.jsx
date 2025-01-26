import { Box, Container, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
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
          Create VibeTube Account
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default Register;
