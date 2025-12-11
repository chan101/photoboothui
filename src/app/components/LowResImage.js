import React from 'react';
import useResizer from './useResizer'; // Adjust path
import CircularProgress from '@mui/material/CircularProgress'; // Assuming you have a simple loading component

const LOW_RES_DISPLAY_SIZE = 200; // The target size for the displayed image

const LowResImage = ({ highResSrc, alt }) => {
  // Use the hook to get the scaled Data URL
  const lowResDataUrl = useResizer(highResSrc, LOW_RES_DISPLAY_SIZE);

  if (!lowResDataUrl) {
    // Show a loading indicator (Skeleton, Spinner, etc.) while processing
    return <CircularProgress />;
  }

  return (
    <img
      src={lowResDataUrl}
      alt={alt}
      // Set the final display size
      style={{
        width: `${LOW_RES_DISPLAY_SIZE}px`,
        height: `${LOW_RES_DISPLAY_SIZE}px`,
        objectFit: 'cover',
      }}
    />
  );
};

export default LowResImage;