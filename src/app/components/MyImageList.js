
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Typography from '@mui/material/Typography';

export default function MyImageList({ itemData, selectMode, selected, toggleSelect, theme, handleFullscreenImage }) {
    return (
        <>
            {itemData.map((item) => (
                <ImageListItem
                    key={item.title}
                    sx={{ position: 'relative', cursor: selectMode ? 'pointer' : 'default' }}
                    onClick={() => {
                        if (selectMode) { toggleSelect(item.img) }
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

                    <Box
                        onClick={() => {
                            if (!selectMode) { handleFullscreenImage(item.img) }
                        }}
                        sx={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            backgroundColor: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                        {item.type === 'img' &&
                            <img
                                src={item.url}
                                alt={item.title}
                                sizes='(max-width: 10px) 100vw, 10px'
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        }
                        {item.type === 'vid' &&
                            <video
                                src={item.img}
                                alt={item.title}
                                controls
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        }
                        {item.type === 'unknown' &&
                            <Box
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
                                <InsertDriveFileIcon sx={{ fontSize: 100, color: theme.palette.secondary.main, marginBottom: 1 }} />
                                <Typography variant="body2" sx={{ fontSize: 7, fontWeight: 500, marginBottom: 0.5, color: theme.palette.text.primary }}>
                                    {item.title}
                                </Typography>
                            </Box>
                        }
                    </Box>
                </ImageListItem>
            ))}
        </>
    );
}
