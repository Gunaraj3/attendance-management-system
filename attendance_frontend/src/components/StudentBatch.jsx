import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAuth } from "../context/auth";
import ModalForm from "./ModalForm";
import Toastify from "./Toastify";
import BatchTable from "./BatchTable";

const StudentBatch = () => {
  const { batchId } = useParams();
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState("");
  const [open, setOpen] = useState(false);
  const [batchStudent, setBatchStudent] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);

  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setStudent("");
    setOpen(false);
  };

  async function add() {
    if (!student) return;
    try {
      let headersList = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        "http://localhost:8000/admin/student/" + student + "/" + batchId,
        {
          method: "put",
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Student enrolled successfully");
        handleOpenToast();
        fetchBatchStudent();
        handleClose();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to enroll student");
        handleOpenToast();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
    }
  }

  const handleChange = (event) => {
    setStudent(event.target.value);
  };

  async function fetchStudent() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch("http://localhost:8000/admin/student/", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setStudents(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchBatchStudent() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        "http://localhost:8000/admin/student/batch/" + batchId,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.success) {
        setBatchStudent(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchStudent();
    fetchBatchStudent();
  }, [batchId]);

  function assignStudent() {
    add();
  }

  function handleUnassign(e, studentId) {
    async function unassign() {
      try {
        let headersList = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token()}`,
        };

        let response = await fetch(
          `http://localhost:8000/admin/student/${studentId}/${batchId}`,
          {
            method: "PATCH",
            headers: headersList,
          }
        );
        let json = await response.json();
        if (json.success) {
          fetchBatchStudent();
          setSeverity("success");
          setToastMessage(json.message || "Student unassigned from batch");
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
            Enrolled Students ({batchStudent.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Students registered in this classroom batch
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
            background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
          }}
        >
          Assign Student
        </Button>
      </Box>

      <BatchTable
        columns={["Name", "Email", "Actions"]}
        rows={batchStudent}
        handleUnassign={handleUnassign}
        student={true}
      />

      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={assignStudent}
        title="Enroll Student into Batch"
      >
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
            Select Student *
          </Typography>
          <FormControl fullWidth>
            <Select
              value={student}
              onChange={handleChange}
              displayEmpty
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="" disabled>
                <em>Select a registered student</em>
              </MenuItem>
              {students?.map((v) => (
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

export default StudentBatch;
