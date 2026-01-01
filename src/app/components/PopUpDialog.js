import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';


export default function PopUpDialog(props){
    return (
        <Dialog open={props.popUpQuestion} onClose={props.setPopUpQuestion(false)} maxWidth="sm" fullWidth>
                        <DialogContent sx={{ pt: 2 }}>
                          <Typography
                          > Are you sure you delete the Files or Folder? </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={()=>{return false}}>No</Button>
                          <Button
                            onClick={()=>{return true}}
                            variant="contained"
                          >Yes</Button>
                        </DialogActions>
                      </Dialog>
    );
}