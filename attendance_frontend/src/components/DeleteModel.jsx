import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/auth";
// import Table from "../../components/Table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteModel = ({
  handleDeleteClose,
  open,
  children,
  handleDeleteSubmit,
}) => {
  return (
    <div>
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>Are you Sure you want to delete?</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleDeleteClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSubmit}
            sx={{ color: "red", border: "1px solid red" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteModel;
