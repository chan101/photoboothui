import { Box, Backdrop, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FullscreenImage({ open, onClose, src }) {
  return (
    <Backdrop
      open={open}
      onClick={onClose}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 10,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.35)",
      }}
    >
      {/* Prevent closing when clicking inside box */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "fadeIn 0.4s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "scale(0.95)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Fullscreen image */}
        <img
          src={src}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain", // keeps full image visible
          }}
        />
      </Box>
    </Backdrop>
  );
}
