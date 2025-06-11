import { Box, Select, MenuItem, ToggleButtonGroup, ToggleButton, InputLabel, FormControl } from '@mui/material';

interface SortControlsProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onFieldChange: (field: string) => void;
  onDirectionChange: (dir: 'asc' | 'desc') => void;
}

const SORT_FIELDS = [
  { value: 'breed', label: 'Breed' },
  { value: 'name', label: 'Name' },
  { value: 'age', label: 'Age' },
];

export default function SortControls({ sortField, sortDirection, onFieldChange, onDirectionChange }: SortControlsProps) {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl>
        <InputLabel id="sort-field-label">Sort By</InputLabel>
        <Select
          labelId="sort-field-label"
          value={sortField}
          label="Sort By"
          onChange={e => onFieldChange(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {SORT_FIELDS.map(f => (
            <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        value={sortDirection}
        exclusive
        onChange={(_, dir) => dir && onDirectionChange(dir)}
        aria-label="Sort Direction"
      >
        <ToggleButton value="asc" aria-label="Ascending">Asc</ToggleButton>
        <ToggleButton value="desc" aria-label="Descending">Desc</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
} 