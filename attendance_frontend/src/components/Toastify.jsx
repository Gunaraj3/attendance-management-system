import React, { useState } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

const Toastify = ({
  open,
  message,
  handleClose,
  handleOpen,
  severity = "error",
}) => {
  return (
    <div>
      {" "}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <MuiAlert elevation={6} variant="filled" severity={severity}>
          {message}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Toastify;
