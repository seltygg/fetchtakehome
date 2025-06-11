import { useState } from 'react';
import { TextField, Button, Typography, Alert, Paper, Stack, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PetsIcon from '@mui/icons-material/Pets';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
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
      if (onSuccess) onSuccess();
    } catch {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 4 }}>
      <Stack alignItems="center" spacing={1} mb={2}>
        <PetsIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">Welcome to Fetch Dogs</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Enter your name and email to start finding your new best friend!
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
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Typography variant="body2" align="center" mt={2}>
          Don&apos;t have an account?{' '}
          <a href="/signup" style={{ color: '#1976d2', textDecoration: 'underline' }}>Sign up</a>
        </Typography>
      </Box>
    </Paper>
  );
} 