import { Autocomplete, TextField } from '@mui/material';

interface BreedFilterProps {
  breeds: string[];
  selectedBreeds: string[];
  onChange: (breeds: string[]) => void;
}

export default function BreedFilter({ breeds, selectedBreeds, onChange }: BreedFilterProps) {
  return (
    <Autocomplete
      multiple
      options={breeds}
      value={selectedBreeds}
      onChange={(_, value) => onChange(value)}
      renderInput={(params) => <TextField {...params} label="Filter by Breed" placeholder="Select breeds" fullWidth />}
      fullWidth
      sx={{ minWidth: 0, width: '100%' }}
    />
  );
} 