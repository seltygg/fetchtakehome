import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import type { Dog } from '../types';
import DogCard from './DogCard';

interface MatchModalProps {
  open: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
}

function MatchModal({ open, onClose, matchedDog }: MatchModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your Match!</DialogTitle>
      <DialogContent>
        {matchedDog ? <DogCard dog={matchedDog} isFavorite={false} onToggleFavorite={() => {}} /> : 'No match found.'}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MatchModal; 