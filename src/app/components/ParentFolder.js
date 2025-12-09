import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';

export default function ParentFolder({ handleParentFolderClick, theme }) {

    return (
        <ImageListItem
            key="parent-folder"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                onClick={() => handleParentFolderClick()}
                sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    backgroundColor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                    cursor: 'pointer',
                    flexDirection: 'column',
                    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200] }
                }}
            >
                <FolderIcon sx={{ fontSize: 48, color: theme.palette.primary.main, marginBottom: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
                    Parent Folder
                </Typography>

            </Box>
        </ImageListItem>
    );
}