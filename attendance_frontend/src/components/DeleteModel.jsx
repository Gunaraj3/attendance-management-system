import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const DeleteModel = ({
  handleDeleteClose,
  open,
  children,
  handleDeleteSubmit,
  title = "Confirm Deletion",
  message = "Are you sure you want to proceed? This action cannot be undone.",
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleDeleteClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: 1.5,
          textAlign: "center",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton size="small" onClick={handleDeleteClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#FEE2E2",
          color: "#EF4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
      </Box>

      <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: "1.25rem", color: "text.primary" }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        {children}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 2, pt: 1 }}>
        <Button variant="outlined" color="inherit" onClick={handleDeleteClose} sx={{ px: 3 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleDeleteSubmit}
          sx={{ px: 3 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModel;
