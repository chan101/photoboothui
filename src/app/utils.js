import { useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';

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
  if (isMd) return 5;
  if (isLg) return 7;
  
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



export const deleteSelectedImages = async (selected, folderContext, setIsLoading, setRefresh, showSuccess, throwError, folderName) => {
  setIsLoading(true);
  if (selected !== 'folder' && selected.size === 0) return;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  let requests;
  if(selected === 'folder'){
    requests = {'folder':folderName};
  }
  else{
      let requests = [];
      for (const url of Array.from(selected)) {
      const imageName = url.split('/').pop();
      requests.push(imageName);
    }
  }

  try{
    const response = await fetch(`${baseUrl}${folderContext}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requests),
    });
    if (response.ok) {
      console.log('File/s deleted successfully');
      setIsLoading(false);
      setRefresh(prev => prev+1);
      showSuccess("File/s deleted successfully")
      return true;
    }
    
    console.error('Failed to delete images');
    throwError('Failed to delete images');
    setIsLoading(false);
    setRefresh(prev => prev+1);
    return false;
  }
  catch(err){
    console.error('Error deleting images:', err);
    throwError('Error deleting images');
    setIsLoading(false);
    setRefresh(prev => prev+1);
  }
}


export const createFolderAPI = async (folderName,folderContext,setIsLoading,showSuccess,throwError) => {
  setIsLoading(true);
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
      showSuccess(`${folderName} Folder created successfully.`);
      setIsLoading(false);
      return newFolder;
    }
    // eslint-disable-next-line no-console
    console.error('Failed to create folder');
    throwError('Failed to create folder');
    setIsLoading(false);
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating folder:', err);
    throwError(err.message);
    setIsLoading(false);
    return null;
  }
};

export const uploadFiles = async (files, folderContext, setProgress,showSuccess, throwError) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!files || files.length === 0) return false;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  try {
    const response = await axios.put(`${baseUrl}${folderContext}`, formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      },
    });

    showSuccess(`Files uploaded successfully.`);
    return response.status === 200;
  } catch (err) {
    console.error("Upload error:", err);
    throwError("Upload error");
    return false;
  }
};

export const fetchFolderAndImageData = async (folderContext, setIsLoading,showSuccess, throwError) => {
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  // Expose STATIC_RESOURCE_PATH to the browser via NEXT_PUBLIC_ prefix
  const staticResourcePath = process.env.NEXT_PUBLIC_STATIC_RESOURCE_PATH || baseUrl || '/images';
  try {
    setIsLoading(true);
    const url = `${baseUrl}${folderContext}`;
    const response = await fetch(url);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch entries from', url);
      setIsLoading(false);
      throwError("Request failed! some shit ain't working right.")
      return { folders: [], images: [] };
    }

    const entries = await response.json();

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
          const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm4v'].includes(ext);
          images.push({
            img: `${staticResourcePath}${folderContext}/${path}`,
            title: name,
            url: `${baseUrl}${path}`,
            type: isImage?'img':isVideo?'vid':'unknown',
          });
        }
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('Unexpected API response format:', entries);
      //throwError("unexpected error loading...");
      setIsLoading(false);
    }

    setIsLoading(false);
    return { folders, images };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching folder and image data:', err);
    setIsLoading(false);
    throwError("Uhhhhh......some shit ain't working right. Gotta check the f**king logs");
    return { folders: [], images: [] };
  }
  
};
