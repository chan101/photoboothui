import { Box, LinearProgress, Typography, Backdrop } from "@mui/material";

export default function UploadProgressOverlay({ open, progress }) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1,
        backdropFilter: "blur(3px)",
      }}
    >
      <Box
        sx={{
          width: "60%",
          maxWidth: 500,
          background: "rgba(0,0,0,0.6)",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, textAlign: "center", color: "#fff" }}>
          Uploading...
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
        <Typography sx={{ mt: 1, textAlign: "center", color: "#fff" }}>
          {progress}%
        </Typography>
      </Box>
    </Backdrop>
  );
}
