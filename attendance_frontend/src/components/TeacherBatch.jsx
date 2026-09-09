import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Box,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAuth } from "../context/auth";
import ModalForm from "./ModalForm";
import Toastify from "./Toastify";
import BatchTable from "./BatchTable";

const TeacherBatch = () => {
  const { batchId } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [open, setOpen] = useState(false);
  const [batchTeacher, setBatchTeacher] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);

  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTeacher("");
    setOpen(false);
  };

  async function add() {
    if (!teacher) return;
    try {
      let headersList = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        "http://localhost:8000/admin/teacher/" + teacher + "/" + batchId,
        {
          method: "put",
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Teacher assigned successfully");
        handleOpenToast();
        fetchBatchTeacher();
        handleClose();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to assign teacher");
        handleOpenToast();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
    }
  }

  const handleChange = (event) => {
    setTeacher(event.target.value);
  };

  async function fetchTeacher() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch("http://localhost:8000/admin/teacher/", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setTeachers(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchBatchTeacher() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        "http://localhost:8000/admin/teacher/batch/" + batchId,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.success) {
        setBatchTeacher(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchTeacher();
    fetchBatchTeacher();
  }, [batchId]);

  function assignTeacher() {
    add();
  }

  function handleUnassign(e, teacherId) {
    async function unassign() {
      try {
        let headersList = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token()}`,
        };

        let response = await fetch(
          `http://localhost:8000/admin/teacher/${teacherId}/${batchId}`,
          {
            method: "PATCH",
            headers: headersList,
          }
        );
        let json = await response.json();
        if (json.success) {
          fetchBatchTeacher();
          setSeverity("success");
          setToastMessage(json.message || "Teacher unassigned");
          handleOpenToast();
        } else {
          setSeverity("error");
          setToastMessage(json.message || "Failed to unassign");
          handleOpenToast();
        }
      } catch (err) {
        setSeverity("error");
        setToastMessage("Something went wrong");
        handleOpenToast();
      }
    }

    unassign();
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Assigned Instructors ({batchTeacher.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Teachers who have permissions to mark attendance for this batch
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
          sx={{
            py: 1,
            px: 2.5,
            borderRadius: "10px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
          }}
        >
          Assign Teacher
        </Button>
      </Box>

      <BatchTable
        columns={["Name", "Email", "Actions"]}
        rows={batchTeacher}
        handleUnassign={handleUnassign}
      />

      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={assignTeacher}
        title="Assign Instructor to Batch"
      >
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
            Select Teacher *
          </Typography>
          <FormControl fullWidth>
            <Select
              value={teacher}
              onChange={handleChange}
              displayEmpty
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="" disabled>
                <em>Select a teacher from the list</em>
              </MenuItem>
              {teachers?.map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.name} ({v.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </ModalForm>

      <Toastify
        open={openToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
      />
    </Box>
  );
};

export default TeacherBatch;
