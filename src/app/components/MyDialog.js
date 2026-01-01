import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function MyDialog(props){
    return (
              <Dialog open={props.createFolderOpen} onClose={props.handleCreateFolderClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ pt: 2 }}>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Folder Name"
                    value={props.folderName}
                    onChange={(e) => props.setFolderName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        props.handleCreateFolder();
                      }
                    }}
                    placeholder="Enter folder name"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={props.handleCreateFolderClose}>Cancel</Button>
                  <Button
                    onClick={props.handleCreateFolder}
                    variant="contained"
                    disabled={!props.folderName.trim() || props.isCreatingFolder || props.folderName.includes("/")
                      || props.folderName.includes(" ") || props.folderName.includes("\\")
                    }
                  >
                    {props.isCreatingFolder ? 'Creating...' : 'OK'}
                  </Button>
                </DialogActions>
              </Dialog>
    );
}