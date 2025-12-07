'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Checkbox from '@mui/material/Checkbox';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CloseIcon from '@mui/icons-material/Close';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useDynamicCols } from './utils';

export default function ControlledOpenSpeedDial() {
  // Get dynamic column count based on screen size
  const cols = useDynamicCols();

  const [speedDialOpen, setspeedDialOpenOpen] = React.useState(false);
  const handleOpen = () => setspeedDialOpenOpen(true);
  const handleClose = () => setspeedDialOpenOpen(false);

  const [selectMode, setSelectMode] = React.useState(false);
  const handleSelectModeToggle = () => {
    setSelectMode(!selectMode);
  }

  // selection state: store selected image urls
  const [selected, setSelected] = React.useState(new Set());
  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  // download selected images (fetch each as blob and trigger download)
  const downloadSelected = async () => {
    if (selected.size === 0) return; // nothing to download
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
        // Log and continue with other downloads
        // eslint-disable-next-line no-console
        console.error('Failed to download', url, err);
      }
    }
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

      <ImageList sx={{ width: '100%', height: '100%' }} cols={cols}>

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

          {selectMode && <Checkbox
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
          />}
          <img
            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
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
    </Box>
  );
}


const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
    {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
    {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
    {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  }
];