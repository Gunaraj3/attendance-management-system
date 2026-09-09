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
import CloseIcon from "@mui/icons-material/Close";

const ModalForm = ({ handleClose, open, children, handleSubmit, title = "Add New Entry" }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, borderTop: "1px solid #F1F5F9", gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save & Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;
