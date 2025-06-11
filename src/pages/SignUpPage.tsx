import { useState } from 'react';
import { TextField, Button, Typography, Alert, Paper, Stack, Box, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(name, email);
      navigate('/search');
    } catch {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh',width: '100vw', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 4 }}>
        <Stack alignItems="center" spacing={1} mb={2}>
          <PetsIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight={700} color="primary.main">Sign Up for Fetch Dogs</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter your name and email to create your account and start finding your new best friend!
          </Typography>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.2, fontWeight: 600, fontSize: '1rem' }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Box>
        <Typography variant="body2" align="center" mt={2}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" color="primary.main">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
} 