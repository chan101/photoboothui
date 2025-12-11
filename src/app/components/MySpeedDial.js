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
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';

import SpeedDial from '@mui/material/SpeedDial';

export default function MySpeedDial (props){

      // conditional actions based on selectMode
  const actions = props.selectMode
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
      { icon: <FolderDeleteIcon />, name: 'DeleteFolder', label:'Delete Empty Folder' },
      { icon: <UploadIcon />, name: 'Upload', label: 'Upload' },
    ];

    return(
              <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'fixed', bottom: '15%', right: '8%' }}
        icon={<SpeedDialIcon />}
        onClose={props.handleClose}
        onOpen={props.handleOpen}
        open={props.speedDialOpen}
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
                props.handleSelectModeToggle();
              }
              if (action.name === 'CreateFolder') {
                props.handleCreateFolderOpen();
              }
              if (action.name === 'Upload') {
                props.handleUploadClick();
              }
              if (action.name === 'SelectAll') {
                props.selectAll();
              }
              if (action.name === 'UnselectAll') {
                props.unselectAll();
              }
              if (action.name === 'Download') {
                await props.downloadSelected();
              }
              if (action.name === 'Close') {
                props.closeSelectMode();
              }
              if (action.name === 'Delete') {
                props.deleteSelected();
              }
              if (action.name === 'DeleteFolder'){
                props.deleteFolder(prev => !prev);
              }

            }}
          />
        ))}
      </SpeedDial>
    );
}