import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Hook to get dynamic column count based on screen size
 * Uses Material-UI breakpoints for responsive design
 * 
 * Breakpoints:
 * - xs (< 600px): 1 column
 * - sm (600px - 960px): 2 columns
 * - md (960px - 1264px): 3 columns
 * - lg (1264px+): 4 columns
 */
export const useDynamicCols = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  if (isXs) return 1;
  if (isSm) return 2;
  if (isMd) return 3;
  if (isLg) return 4;
  
  // Default fallback
  return 3;
};
