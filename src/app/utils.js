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

  if (isXs) return 2;
  if (isSm) return 3;
  if (isMd) return 4;
  if (isLg) return 5;
  
  // Default fallback
  return 3;
};

/**
 * Download selected images by fetching them as blobs and triggering browser downloads
 * @param {Set} selected - Set of image URLs to download
 */
export const downloadSelectedImages = async (selected) => {
  if (selected.size === 0) return;
  
  for (const url of Array.from(selected)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      const parts = url.split('/');
      const last = parts[parts.length - 1].split('?')[0] || 'image.jpg';
      a.download = last;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to download', url, err);
    }
  }
};

/**
 * Create a new folder via API
 * @param {string} folderName - Name of the folder to create
 * @returns {Promise<Object|null>} New folder object or null if failed
 */
export const createFolderAPI = async (folderName) => {
  try {
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: folderName }),
    });

    if (response.status === 200) {
      const newFolder = {
        name: folderName,
        date: new Date().toISOString().split('T')[0],
      };
      return newFolder;
    }
    // eslint-disable-next-line no-console
    console.error('Failed to create folder');
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating folder:', err);
    return null;
  }
};

/**
 * Upload multiple files via FormData to the upload API
 * @param {FileList} files - Files to upload
 * @returns {Promise<boolean>} True if upload succeeded, false otherwise
 */
export const uploadFiles = async (files) => {
  if (!files || files.length === 0) return false;

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // eslint-disable-next-line no-console
      console.log('Files uploaded successfully');
      return true;
    }
    // eslint-disable-next-line no-console
    console.error('Failed to upload files');
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error uploading files:', err);
    return false;
  }
};

/**
 * Fetch folders and images from API based on folder context
 * 
 * @param {string} folderContext - The folder path (e.g., '/photos', '/photos/trip1')
 * @returns {Promise<{folders: Array, images: Array}>} - Object containing folders and images arrays
 */
export const fetchFolderAndImageData = async (folderContext) => {
  try {
    // Fetch folders list
    const foldersResponse = await fetch(`/api/folders${folderContext}`);
    let folders = [];
    if (foldersResponse.ok) {
      const foldersData = await foldersResponse.json();
      folders = Array.isArray(foldersData) ? foldersData : [];
    } else {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch folders');
    }

    // Fetch images list
    const imagesResponse = await fetch(`/api/images${folderContext}`);
    let images = [];
    if (imagesResponse.ok) {
      const imagesData = await imagesResponse.json();
      images = Array.isArray(imagesData) ? imagesData : [];
    } else {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch images');
    }

    return { folders, images };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching folder and image data:', err);
    return { folders: [], images: [] };
  }
};
