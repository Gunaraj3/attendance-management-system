import React from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Toastify = ({
  open,
  message,
  handleClose,
  severity = "info",
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={handleClose}
      autoHideDuration={4500}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        sx={{
          borderRadius: "12px",
          fontWeight: 600,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          pr: 1,
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toastify;
