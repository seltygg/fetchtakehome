import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import type { AuthUser, AuthContextType } from './authTypes';
import { getBreeds } from '../api/dogs';
import { CircularProgress, Box } from '@mui/material';

// Move AuthUser and AuthContextType to a new file if needed for Fast Refresh compliance

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  // On app load, if user is not set, check if session cookie is valid (but not on login/signup pages)
  useEffect(() => {
    const path = window.location.pathname;
    if (!user && path !== '/login' && path !== '/signup') {
      getBreeds()
        .then(() => {
          setUser({ name: 'Session', email: 'session@fetch.com' });
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (name: string, email: string) => {
    await apiLogin(name, email);
    setUser({ name, email });
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    try {
      localStorage.removeItem('favorites');
    } catch {}
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 