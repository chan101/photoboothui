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
export const createFolderAPI = async (folderName,folderContext,throwError) => {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  try {
    const response = await fetch(`${baseUrl}${folderContext}\\${folderName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
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
    throwError('Failed to create folder');
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating folder:', err);
    throwError(err.message);
    return null;
  }
};

/**
 * Upload multiple files via FormData to the upload API
 * @param {FileList} files - Files to upload
 * @returns {Promise<boolean>} True if upload succeeded, false otherwise
 */
export const uploadFiles = async (files,folderContext) => {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!files || files.length === 0) return false;

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await fetch(`${baseUrl}${folderContext}`, {
      method: 'PUT',
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
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  // Expose STATIC_RESOURCE_PATH to the browser via NEXT_PUBLIC_ prefix
  const staticResourcePath = process.env.NEXT_PUBLIC_STATIC_RESOURCE_PATH || baseUrl || '/images';
  try {
    const url = `${baseUrl}${folderContext}`;
    const response = await fetch(url);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch entries from', url);
      return { folders: [], images: [] };
    }

    const entries = await response.json();

    // entries expected to be an array of { file: '/path', type: 'F'|'D' }
    const folders = [];
    const images = [];

    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        const path = typeof entry.file === 'string' ? entry.file : '';
        const name = path.replace(/^\//, '');

        if (entry.type === 'D') {
          folders.push({ name, date: entry.date || null });
        } else {
          const ext = (name.split('.').pop() || '').toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(ext);
          images.push({
            img: isImage ? `${staticResourcePath}${path}` : null,
            title: name,
            url: `${baseUrl}${path}`,
            type: ext,
          });
        }
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('Unexpected API response format:', entries);
    }

    return { folders, images };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching folder and image data:', err);
    return { folders: [], images: [] };
  }
};
