import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Box } from '@mui/material';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/search', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default', // Optional: adds a background color
      }}
    >
      <LoginForm />
    </Box>
  );
} 