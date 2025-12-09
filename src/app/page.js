'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CloseIcon from '@mui/icons-material/Close';
import ImageList from '@mui/material/ImageList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useDynamicCols, downloadSelectedImages,deleteSelectedImages, createFolderAPI, uploadFiles, fetchFolderAndImageData } from './utils';
import ErrorSnackbar from './components/ErrorSnackbar';
import MyImageList from './components/MyImageList';
import FolderList from './components/FolderList';
import UploadProgressOverlay from './components/UploadProgressOverlay';
import LoadingOverlay from './components/LoadingOverlay';
import SuccessSnackbar from './components/SuccessSnackbar';

export default function ControlledOpenSpeedDial() {
  const theme = useTheme();
  const [pathname, setPathname] = React.useState('/');
  // Get dynamic column count based on screen size
  const cols = useDynamicCols();

  const [speedDialOpen, setspeedDialOpenOpen] = React.useState(false);
  const [folders, setFolders] = React.useState([]);
  const [itemData, setItemData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refresh, setRefresh] = React.useState(0);

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
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = React.useState('');
  const showSuccessSnackbar = (successMsg) => {
    setOpenSuccess(true);
    setMessageSuccess(successMsg);
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
      const newFolder = await createFolderAPI(folderName, folderContext,setIsLoading, showSuccessSnackbar, throwErrorSnackbar);
      if (newFolder) {
        folders.push(newFolder);
        setFolderName('');
        setCreateFolderOpen(false);
        setSelected(new Set(selected));
      } else {
        console.error('Failed to create folder');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // File upload state
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const success = await uploadFiles(files, pathname, setProgress, showSuccessSnackbar, throwErrorSnackbar);
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
      try {
        // Get the folder context from pathname
        // If pathname is '/', use '/photos', otherwise use the pathname
        const folderContext = pathname;

        // Use utility function to fetch both folders and images
        const { folders: foldersData, images: imagesData } = await fetchFolderAndImageData(folderContext,setIsLoading, showSuccessSnackbar, throwErrorSnackbar);
        setFolders(foldersData);
        setItemData(imagesData);
        setSelected(new Set());
        setSelectMode(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', err);
        setFolders([]);
        setItemData([]);
        setSelected(new Set());
        setSelectMode(false);
      }
    };

    fetchData();
  }, [pathname, isUploading, refresh]);

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

    // delete selected images
  const deleteSelected = () => {
    deleteSelectedImages(selected, pathname, setIsLoading, setRefresh, showSuccessSnackbar, throwErrorSnackbar);
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
      { icon: <CloseIcon />, name: 'Close', label: 'Close Select Mode' },
    ]
    : [
      { icon: <ChecklistIcon />, name: 'Select', label: 'Select' },
      { icon: <CreateNewFolderIcon />, name: 'CreateFolder', label: 'Create Folder' },
      { icon: <UploadIcon />, name: 'Upload', label: 'Upload' },
    ];

  return (
    <Box sx={{ width: '100%', height: '100vh', flexGrow: 1 }}>
      <UploadProgressOverlay open={isUploading} progress={progress}/>
      <LoadingOverlay open={isLoading} />
      <ErrorSnackbar
        open={openError}
        onClose={() => setOpenError(false)}
        message={messageError}
      />
      <SuccessSnackbar
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        message={messageSuccess}
      />
      <ImageList cols={cols}>
        {<FolderList folders={folders} handleFolderClick={handleFolderClick} theme={theme} pathname={pathname} handleParentFolderClick={handleParentFolderClick}/>}
        <MyImageList itemData={itemData} selectMode={selectMode} selected={selected} toggleSelect={toggleSelect} theme={theme}/>
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
              if (action.name === 'Delete') {
                deleteSelected();
              }
              
            }}
          />
        ))}
      </SpeedDial>

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
