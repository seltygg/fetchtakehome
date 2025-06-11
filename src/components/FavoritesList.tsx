import { List, ListItem, ListItemText, IconButton, Button, Typography, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Dog } from '../types';

interface FavoritesListProps {
  favoriteDogs: Dog[];
  onRemove: (id: string) => void;
  onFindMatch: () => void;
  loadingMatch: boolean;
}

export default function FavoritesList({ favoriteDogs, onRemove, onFindMatch, loadingMatch }: FavoritesListProps) {
  return (
    <Box>
      <Typography variant="h6" mb={1}>Favorites</Typography>
      {favoriteDogs.length === 0 ? (
        <Typography color="text.secondary">No favorites selected.</Typography>
      ) : (
        <List>
          {favoriteDogs.map(dog => (
            <ListItem key={dog.id} secondaryAction={
              <IconButton edge="end" aria-label="remove" onClick={() => onRemove(dog.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={dog.name} secondary={dog.breed} />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onFindMatch}
        disabled={favoriteDogs.length === 0 || loadingMatch}
        sx={{ mt: 2 }}
      >
        {loadingMatch ? <CircularProgress size={24} /> : 'Find My Match!'}
      </Button>
    </Box>
  );
} 