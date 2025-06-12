import { Card, CardMedia, Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Dog } from '../types';
import { useEffect, useRef, useState } from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  quickView?: boolean;
  hideFavorite?: boolean;
}

export default function DogCard({ dog, isFavorite, onToggleFavorite, quickView = true, hideFavorite = false }: DogCardProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' }
      ], {
        duration: 300,
        easing: 'ease-in-out',
      });
    }
  }, [isFavorite]);

  // Handlers for hover/focus
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!quickView) {
    // Normal card with all details, no hover overlay
    return (
      <Card sx={{ width: 320, maxWidth: '100%', m: 'auto', boxShadow: 3, borderRadius: 3, p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', boxShadow: 2, background: '#f3f3f3', flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={dog.img}
            alt={dog.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700}>{dog.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Breed: {dog.breed}</Typography>
          <Typography variant="body2">Age: {dog.age}</Typography>
          <Typography variant="body2" color="text.secondary">Zip Code: {dog.zip_code}</Typography>
        </Box>
        {!hideFavorite && (
          <IconButton
            ref={iconRef}
            onClick={() => onToggleFavorite(dog.id)}
            color={isFavorite ? 'error' : 'default'}
            aria-label="favorite"
            sx={{ ml: 1 }}
          >
            <FavoriteIcon />
          </IconButton>
        )}
      </Card>
    );
  }
  // Quick view (hover overlay) mode
  return (
    <>
      <Card
        ref={cardRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        tabIndex={0}
        sx={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3,
          overflow: 'visible',
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            background: '#f3f3f3',
          }}
        >
          <CardMedia
            component="img"
            image={dog.img}
            alt={dog.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '50%',
            }}
          />
        </Box>
        {!hideFavorite && (
          <IconButton
            ref={iconRef}
            onClick={() => onToggleFavorite(dog.id)}
            color={isFavorite ? 'error' : 'default'}
            aria-label="favorite"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: 1,
              zIndex: 2,
              transition: 'color 0.2s',
              '&:hover': { color: 'error.main', background: 'rgba(255,255,255,0.9)' },
            }}
          >
            <FavoriteIcon />
          </IconButton>
        )}
      </Card>
      <Popper
        open={open}
        anchorEl={cardRef.current}
        placement="right"
        disablePortal={false}
        modifiers={[{ name: 'offset', options: { offset: [0, 0] } }]}
        style={{ zIndex: 1300 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            boxShadow: 8,
            mt: 2,
          }}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              mb: 2,
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              image={dog.img}
              alt={dog.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700}>{dog.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">Breed: {dog.breed}</Typography>
          <Typography variant="body1">Age: {dog.age}</Typography>
          <Typography variant="body2" color="text.secondary">Zip Code: {dog.zip_code}</Typography>
          {!hideFavorite && (
            <IconButton
              onClick={() => onToggleFavorite(dog.id)}
              color={isFavorite ? 'error' : 'default'}
              aria-label="favorite"
              sx={{ mt: 1 }}
            >
              <FavoriteIcon />
            </IconButton>
          )}
        </Paper>
      </Popper>
    </>
  );
} 