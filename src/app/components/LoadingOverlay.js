import { Box, CircularProgress, Backdrop, Typography } from "@mui/material";

export default function LoadingOverlay({ open, text = "Loading..." }) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 10,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.35)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          width: 260,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.4s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "scale(0.95)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        <CircularProgress thickness={5} size={50} />

        <Typography
          variant="body1"
          sx={{ marginTop: 2, fontWeight: 500, letterSpacing: 0.5 }}
        >
          {text}
        </Typography>
      </Box>
    </Backdrop>
  );
}
