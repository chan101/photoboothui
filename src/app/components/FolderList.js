import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FolderList({ folders, handleFolderClick, theme, pathname, handleParentFolderClick, handleDeleteFolder, enableDeleteFolder}) {

    const folderIconSize = enableDeleteFolder?150:200;
    return (<>
            {pathname !== "/" && <ImageListItem
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
                    borderRadius: 2,
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
                <FolderIcon sx={{ fontSize: 200, color: theme.palette.primary.main, marginBottom: 1 }} />
                <Typography variant="body2" sx={{ position: "absolute", fontSize:15,fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
                    Parent Folder
                </Typography>

            </Box>
        </ImageListItem>}
        {folders.map((folder) => (
            <ImageListItem
                key={folder.name}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    onClick={() => handleFolderClick(folder.name)} 
                    sx={{
                        borderRadius: 2,
                        width: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexDirection: 'column',
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200] }
                    }}
                >   {enableDeleteFolder && <DeleteIcon sx={{ fontSize: 35, color: "red", position: "absolute", top:'5%', right:'5%'}} onClick={()=>handleDeleteFolder(folder.name)}/>}
                    <FolderIcon sx={{ fontSize: folderIconSize, color: theme.palette.primary.main, marginBottom: 1 }} />
                    <Typography variant="body2" sx={{ position: "absolute", fontSize: 15 ,fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
                        {folder.name}
                    </Typography>
                </Box>
            </ImageListItem>
        ))}
    </>
    );
}