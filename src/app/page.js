'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Checkbox from '@mui/material/Checkbox';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CloseIcon from '@mui/icons-material/Close';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation';
import { useDynamicCols, downloadSelectedImages, createFolderAPI, uploadFiles, fetchFolderAndImageData } from './utils';
import ErrorSnackbar from './components/ErrorSnackbar';

export default function ControlledOpenSpeedDial() {
  const theme = useTheme();
  const router = useRouter();
  const [pathname, setPathname] = React.useState('/');
  // Get dynamic column count based on screen size
  const cols = useDynamicCols();

  const [speedDialOpen, setspeedDialOpenOpen] = React.useState(false);
  const [folders, setFolders] = React.useState([]);
  const [itemData, setItemData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const handleOpen = () => setspeedDialOpenOpen(true);
  const handleClose = () => setspeedDialOpenOpen(false);

  const [selectMode, setSelectMode] = React.useState(false);
  const handleSelectModeToggle = () => {
    setSelectMode(!selectMode);
  }

  // Create folder dialog state
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState('');
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);


  const [openError, setOpenError] = React.useState(false);
  const [messageError, setMessageError] = React.useState('');
  const throwErrorSnackbar = (errorMsg) => {
    setOpenError(true);
    setMessageError(errorMsg);
  }


  const handleCreateFolderOpen = () => {
    setCreateFolderOpen(true);
    setFolderName('');
  };

  const handleCreateFolderClose = () => {
    setCreateFolderOpen(false);
    setFolderName('');
  };

  const handleCreateFolder = async () => {

    const folderContext = pathname;
    if (!folderName.trim()) return;
    
    setIsCreatingFolder(true);
    try {
      const newFolder = await createFolderAPI(folderName,folderContext,throwErrorSnackbar);
      if (newFolder) {
        folders.push(newFolder);
        setFolderName('');
        setCreateFolderOpen(false);
        setSelected(new Set(selected));
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to create folder');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error creating folder:', err);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // File upload state
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const success = await uploadFiles(files,pathname);
      if (success) {
        // eslint-disable-next-line no-console
        console.log('Files uploaded successfully');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to upload files');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', err);
    } finally {
      setIsUploading(false);
    }
  };

    // selection state: store selected image urls
  const [selected, setSelected] = React.useState(new Set());

  // Fetch folders and images on page load or when pathname changes
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get the folder context from pathname
        // If pathname is '/', use '/photos', otherwise use the pathname
        const folderContext = pathname;

        // Use utility function to fetch both folders and images
        const { folders: foldersData, images: imagesData } = await fetchFolderAndImageData(folderContext);
        setFolders(foldersData);
        setItemData(imagesData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', err);
        setFolders([]);
        setItemData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  // download selected images
  const downloadSelected = () => {
    downloadSelectedImages(selected);
  };

  // bulk select/unselect
  const selectAll = () => {
    setSelected(new Set(itemData.map((item) => item.img)));
  };
  const unselectAll = () => {
    setSelected(new Set());
  };

  // close select mode
  const closeSelectMode = () => {
    setSelectMode(false);
  };

  // handle folder click to navigate
  const handleFolderClick = (folderName) => {
    setPathname((prev) => {
      const newPath = prev === '/' ? `/${folderName}` : `${prev}/${folderName}`;
      return newPath;
  });
}

  // handle parent folder click to navigate
  const handleParentFolderClick = () => {
    setPathname((prev) => {
      prev.split('/');
      const parts = prev === '/' ? [] : prev.split('/').filter(part => part);
      parts.pop(); // remove last part
      const newPath = parts.length === 0 ? '/' : `/${parts.join('/')}`;
      return newPath;
  });
}

  // conditional actions based on selectMode
  const actions = selectMode
    ? [
        { icon: <DoneAllIcon />, name: 'SelectAll', label: 'Select All' },
        { icon: <RemoveDoneIcon />, name: 'UnselectAll', label: 'Unselect All' },
        { icon: <DownloadIcon />, name: 'Download', label: 'Download' },
        { icon: <DeleteForeverIcon />, name: 'Delete', label: 'Delete' },
        { icon: <CloseIcon />, name: 'Close', label: 'Close' },
      ]
    : [
        { icon: <ChecklistIcon />, name: 'Select', label: 'Select' },
        { icon: <CreateNewFolderIcon />, name: 'CreateFolder', label: 'Create Folder' },
        { icon: <UploadIcon />, name: 'Upload', label: 'Upload' },
      ];

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', transform: 'translateZ(0px)', flexGrow: 1 }}>
<ErrorSnackbar
  open={openError}
  onClose={() => setOpenError(false)}
  message={messageError}
/>
      <ImageList sx={{ width: '100%', height: '100%' }} cols={cols}>
        {pathname !== '/' && <ImageListItem 
          key="parent-folder"
          onClick={() => handleParentFolderClick()}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
            cursor: 'pointer',
            '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200] }
          }}
        >
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FolderIcon sx={{ fontSize: 48, color: theme.palette.primary.main, marginBottom: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
              .. (Parent Folder)
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              
            </Typography>
          </Box>
        </ImageListItem>}
      {folders.map((folder) => (
        <ImageListItem 
          key={folder.name}
          onClick={() => handleFolderClick(folder.name)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
            cursor: 'pointer',
            '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200] }
          }}
        >
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FolderIcon sx={{ fontSize: 48, color: theme.palette.primary.main, marginBottom: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
              {folder.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {new Date(folder.date).toLocaleDateString()}
            </Typography>
          </Box>
        </ImageListItem>
      ))}

      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          sx={{ position: 'relative', cursor: selectMode ? 'pointer' : 'default' }}
          onClick={() => {
            if (selectMode) {
              toggleSelect(item.img);
            }
          }}
        >

          {selectMode && (
            <Checkbox
              size="small"
              checked={selected.has(item.img)}
              onChange={() => toggleSelect(item.img)}
              inputProps={{ 'aria-label': `Select ${item.title}` }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                bgcolor: 'rgba(255,255,255,0.75)',
                borderRadius: '50%'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <Box sx={{ width: '100%', aspectRatio: '1 / 1', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
            />
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
      
      
      
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'fixed', bottom: '15%', right: '8%' }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={speedDialOpen}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.label,
              },
            }}
            onClick={async () => {
              if (action.name === 'Select') {
                handleSelectModeToggle();
              }
              if (action.name === 'CreateFolder') {
                handleCreateFolderOpen();
              }
              if (action.name === 'Upload') {
                handleUploadClick();
              }
              if (action.name === 'SelectAll') {
                selectAll();
              }
              if (action.name === 'UnselectAll') {
                unselectAll();
              }
              if (action.name === 'Download') {
                await downloadSelected();
              }
              if (action.name === 'Close') {
                closeSelectMode();
              }
              handleClose();
            }}
          />
        ))}
      </SpeedDial>

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onClose={handleCreateFolderClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
            placeholder="Enter folder name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateFolderClose}>Cancel</Button>
          <Button 
            onClick={handleCreateFolder} 
            variant="contained" 
            disabled={!folderName.trim() || isCreatingFolder}
          >
            {isCreatingFolder ? 'Creating...' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}
