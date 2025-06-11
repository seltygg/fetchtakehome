import { useEffect, useState } from 'react';
import { getBreeds, searchDogs, getDogsByIds, matchDog } from '../api/dogs';
import type { Dog } from '../types';
import type { SearchDogsParams } from '../api/dogs';
import { Box, Typography, CircularProgress, Grid, Paper, Button, Alert, Stack, Divider, Container, List, ListItem, ListItemText, IconButton } from '@mui/material';
import BreedFilter from '../components/BreedFilter';
import SortControls from '../components/SortControls';
import Pagination from '../components/Pagination';
import DogCard from '../components/DogCard';
import FavoritesList from '../components/FavoritesList';
import MatchModal from '../components/MatchModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';
import PetsIcon from '@mui/icons-material/Pets';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';

const PAGE_SIZE = 12;

type SearchPageProps = { pageParam?: string };

export default function SearchPage({ pageParam }: SearchPageProps) {
  const initialPage = Math.max(1, Number(pageParam) || 1);
  const [page, setPage] = useState(initialPage);

  // Keep page in sync with prop
  useEffect(() => {
    const newPage = Math.max(1, Number(pageParam) || 1);
    setPage(newPage);
  }, [pageParam]);

  const [breeds, setBreeds] = useState<string[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(true);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortField, setSortField] = useState('breed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [favoritesPage, setFavoritesPageState] = useState(1);
  const FAVORITES_PER_PAGE = 5;
  const favoritesPageCount = Math.ceil(favoriteDogs.length / FAVORITES_PER_PAGE);
  const paginatedFavorites = favoriteDogs.slice((favoritesPage - 1) * FAVORITES_PER_PAGE, favoritesPage * FAVORITES_PER_PAGE);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // --- FAVORITES PAGINATION URL SYNC ---
  const [searchParams, setSearchParams] = useSearchParams();
  const getFavoritesPageParam = () => {
    const param = searchParams.get('favoritesPage');
    const num = Number(param);
    return Number.isFinite(num) && num > 0 ? num : 1;
  };

  // Clamp favoritesPage to valid range
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(favoriteDogs.length / FAVORITES_PER_PAGE));
    let paramPage = getFavoritesPageParam();
    if (favoriteDogs.length === 0) paramPage = 1;
    if (paramPage > maxPage) paramPage = maxPage;
    if (paramPage !== favoritesPage) setFavoritesPageState(paramPage);
  }, [searchParams, favoriteDogs.length]);

  // Update URL when favoritesPage changes
  const handleSetFavoritesPage = (newPage: number) => {
    const maxPage = Math.max(1, Math.ceil(favoriteDogs.length / FAVORITES_PER_PAGE));
    const clamped = Math.max(1, Math.min(newPage, maxPage));
    setFavoritesPageState(clamped);
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('favoritesPage', clamped.toString());
      return params;
    });
  };

  // Keep page in sync with route
  const handleSetPage = (newPage: number) => {
    if (newPage !== page) {
      navigate(`/search/${newPage}`);
    }
  };

  useEffect(() => {
    getBreeds().then(setBreeds).finally(() => setLoadingBreeds(false));
  }, []);

  useEffect(() => {
    setLoadingDogs(true);
    setError(null);
    const params: SearchDogsParams = {
      size: PAGE_SIZE,
      from: (page - 1) * PAGE_SIZE,
      sort: `${sortField}:${sortDirection}`,
    };
    if (selectedBreeds.length) params.breeds = selectedBreeds;
    searchDogs(params)
      .then(async (res) => {
        setTotal(res.total);
        if (res.resultIds.length) {
          const dogObjs = await getDogsByIds(res.resultIds);
          setDogs(dogObjs);
        } else {
          setDogs([]);
        }
      })
      .catch(() => setError('Failed to fetch dogs. Please try again.'))
      .finally(() => setLoadingDogs(false));
  }, [selectedBreeds, sortField, sortDirection, page]);

  useEffect(() => {
    // Update favoriteDogs when favorites change
    if (favorites.length === 0) {
      setFavoriteDogs([]);
      return;
    }
    getDogsByIds(favorites).then(setFavoriteDogs);
  }, [favorites]);

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  const handleToggleFavorite = (id: string) => {
    setFavorites(favs => {
      let newFavs;
      let msg;
      if (favs.includes(id)) {
        newFavs = favs.filter(f => f !== id);
        const removedCount = favs.length - newFavs.length;
        msg = `${removedCount} favorite${removedCount > 1 ? 's' : ''} removed!`;
      } else {
        newFavs = [...favs, id];
        const addedCount = newFavs.length - favs.length;
        msg = `${addedCount} favorite${addedCount > 1 ? 's' : ''} added!`;
      }
      setSnackbarMsg(msg);
      setSnackbarKey(prev => prev + 1);
      setSnackbarOpen(true);
      return newFavs;
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favs => {
      const newFavs = favs.filter(f => f !== id);
      const removedCount = favs.length - newFavs.length;
      const msg = `${removedCount} favorite${removedCount > 1 ? 's' : ''} removed!`;
      setSnackbarMsg(msg);
      setSnackbarKey(prev => prev + 1);
      setSnackbarOpen(true);
      return newFavs;
    });
  };

  const handleFindMatch = async () => {
    setLoadingMatch(true);
    setMatchError(null);
    try {
      const matchId = await matchDog(favorites);
      const [dog] = await getDogsByIds([matchId]);
      setMatchedDog(dog);
      setMatchOpen(true);
    } catch {
      setMatchedDog(null);
      setMatchError('Failed to find a match. Please try again.');
      setMatchOpen(true);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh',width: '100vw', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hero Header */}
      <Box sx={{
        width: '100vw',
        minHeight: 220,
        background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mb: 4,
        boxShadow: 2,
        position: 'relative',
      }}>
        <PetsIcon sx={{ fontSize: 60, color: '#fff', mb: 1 }} />
        <Typography variant="h3" color="#fff" fontWeight={700} align="center" gutterBottom>
          Find Your New Best Friend
        </Typography>
        <Typography variant="h6" color="#fff" align="center" sx={{ opacity: 0.9 }}>
          Browse, filter, and match with shelter dogs looking for a loving home.
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          sx={{ position: 'absolute', top: 16, right: 24, borderColor: '#fff', color: '#fff' }}
        >
          Logout
        </Button>
      </Box>
      <Container maxWidth="lg">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, boxShadow: 1 }}>
          <Grid container spacing={2} alignItems="center" >
            <Grid size={{ xs: 12, md: 6 }}>
              {loadingBreeds ? <CircularProgress /> : (
                <BreedFilter
                  breeds={breeds}
                  selectedBreeds={selectedBreeds}
                  onChange={breeds => { setSelectedBreeds(breeds); setPage(1); }}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SortControls
                sortField={sortField}
                sortDirection={sortDirection}
                onFieldChange={field => { setSortField(field); setPage(1); }}
                onDirectionChange={dir => { setSortDirection(dir); setPage(1); }}
              />
            </Grid>
          </Grid>
        </Paper>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3} mb={2} alignItems="stretch">
          {loadingDogs ? (
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Grid>
          ) : (
            dogs.map(dog => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dog.id} sx={{ display: 'flex' }}>
                <DogCard
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            ))
          )}
        </Grid>
        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={handleSetPage}
        />
        <Divider sx={{ my: 4 }} />
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, boxShadow: 1, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6" mb={2} display="flex" alignItems="center">
            Favorites
          </Typography>
          {favoriteDogs.length === 0 ? (
            <Typography color="text.secondary">No favorites selected.</Typography>
          ) : (
            <>
              <List>
                {paginatedFavorites.map(dog => (
                  <ListItem key={dog.id} secondaryAction={
                    <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveFavorite(dog.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <Avatar src={dog.img} alt={dog.name} sx={{ width: 40, height: 40, mr: 2 }} />
                    <ListItemText primary={dog.name} secondary={dog.breed} />
                  </ListItem>
                ))}
              </List>
              {favoritesPageCount > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    page={favoritesPage}
                    pageCount={favoritesPageCount}
                    onChange={handleSetFavoritesPage}
                  />
                </Box>
              )}
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFindMatch}
            disabled={favoriteDogs.length === 0 || loadingMatch}
            sx={{ mt: 2 }}
          >
            {loadingMatch ? <CircularProgress size={24} /> : 'Find My Match!'}
          </Button>
          {matchError && <Alert severity="error" sx={{ mt: 2 }}>{matchError}</Alert>}
        </Paper>
        <Snackbar
          key={snackbarKey}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
            {snackbarMsg}
          </MuiAlert>
        </Snackbar>
        <MatchModal
          open={matchOpen}
          onClose={() => setMatchOpen(false)}
          matchedDog={matchedDog}
        />
      </Container>
    </Box>
  );
} 