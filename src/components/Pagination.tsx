import { Pagination as MuiPagination, Box, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from 'react';
import PaginationItem from '@mui/material/PaginationItem';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const [inputValue, setInputValue] = useState(page.toString());
  const [showInput, setShowInput] = useState<null | 'start-ellipsis' | 'end-ellipsis'>(null);

  // Sync input with page prop
  React.useEffect(() => {
    setInputValue(page.toString());
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/[^\d]/g, ''));
  };

  const handleInputSubmit = () => {
    const num = Number(inputValue);
    if (num >= 1 && num <= pageCount && num !== page) {
      onChange(num);
    }
    setShowInput(null);
    setInputValue(page.toString());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setShowInput(null);
      setInputValue(page.toString());
    }
  };

  const renderItem = (item: any) => {
    if ((item.type === 'start-ellipsis' || item.type === 'end-ellipsis')) {
      if (showInput === item.type) {
        return (
          <Box display="flex" alignItems="center" component="span">
            <TextField
              size="small"
              value={inputValue}
              autoFocus
              onChange={handleInputChange}
              onBlur={handleInputSubmit}
              onKeyDown={handleInputKeyDown}
              variant="standard"
              sx={{
                width: 40,
                mx: 0,
                '& .MuiInputBase-input': {
                  p: 0,
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  bgcolor: 'transparent',
                },
                '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                  borderBottom: 'none',
                },
                background: 'none',
                boxShadow: 'none',
              }}
              inputProps={{
                min: 1,
                max: pageCount,
                'aria-label': 'Go to page',
                style: { textAlign: 'center' },
              }}
            />
            <IconButton size="small" onClick={handleInputSubmit} aria-label="Go to page">
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
      return (
        <Box
          component="span"
          sx={{ cursor: 'pointer', px: 1, userSelect: 'none' }}
          onClick={() => setShowInput(item.type)}
          aria-label="Jump to page"
        >
          ...
        </Box>
      );
    }
    return undefined;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
      <MuiPagination
        count={pageCount}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        shape="rounded"
        boundaryCount={0}
        siblingCount={1}
        showFirstButton
        showLastButton
        renderItem={item => {
          const custom = renderItem(item);
          if (custom) return custom;
          // fallback to default
          return <PaginationItem {...item} />;
        }}
      />
    </Box>
  );
} 