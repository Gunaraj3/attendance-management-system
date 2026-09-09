import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Stack,
  InputAdornment,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ModalForm from "../../components/ModalForm";
import DisplayTable from "../../components/DisplayTable";
import Toastify from "../../components/Toastify";
import EditForm from "../../components/EditForm";
import DeleteModel from "../../components/DeleteModel";

const TeacherView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [teacher, setTeacher] = useState([]);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [nameErrors, setNameErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [noTeachers, setNoTeachers] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState("");
  const [deleTeOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEmail("");
    setName("");
    setPassword("");
    setEmailErrors([]);
    setPasswordErrors([]);
    setNameErrors([]);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsNameError(false);
    setOpen(false);
  };

  async function handleEditOpen(e, id) {
    try {
      let res = await fetch("http://localhost:8000/admin/teacher/" + id, {
        headers: {
          Authorization: `Bearer ${user.token()}`,
        },
      });
      let data = await res.json();
      if (data.success) {
        setEmail(data.result.email);
        setName(data.result.name);
        setEditTeacherId(id);
        setEdit(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEditClose() {
    setEmail("");
    setName("");
    setEmailErrors([]);
    setPasswordErrors([]);
    setNameErrors([]);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsNameError(false);
    setEdit(false);
  }

  async function handleEditSubmit() {
    let eErrors = [];
    let nErrors = [];
    if (!name.trim()) {
      nErrors.push("Name is required");
      setIsNameError(true);
    }
    if (!email.trim()) {
      eErrors.push("Email is required");
      setIsEmailError(true);
    }

    if (nErrors.length > 0 || eErrors.length > 0) {
      setNameErrors(nErrors);
      setEmailErrors(eErrors);
      return;
    }

    if (emailErrors.length !== 0 || nameErrors.length !== 0) return;

    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ data: { name, email } });
    try {
      let response = await fetch("http://localhost:8000/admin/teacher/" + editTeacherId, {
        method: "put",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Teacher updated successfully");
        handleOpenToast();
        handleEditClose();
        fetchTeacher();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to update teacher");
        handleOpenToast();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
    }
  }

  async function handleDeleteOpen(e, id) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  async function handleDeleteClose() {
    setDeleteOpen(false);
  }

  async function handleDeleteSubmit() {
    try {
      let response = await fetch("http://localhost:8000/admin/teacher/" + deleteId, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${user.token()}`,
        },
      });

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Teacher deleted successfully");
        handleOpenToast();
        handleDeleteClose();
        fetchTeacher();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to delete teacher");
        handleOpenToast();
        handleDeleteClose();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
      handleDeleteClose();
    }
  }

  async function fetchTeacher() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch("http://localhost:8000/admin/teacher", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setNoTeachers(data.result.length);
        setTeacher(data.result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchTeacher();
  }, []);

  function checkEmailFormat(event, errors) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(event.target.value)) {
      errors.push("Invalid Email format");
    }
  }

  function checkPasswordStrength(event, errors) {
    if (!/.*[a-z].*/.test(event.target.value)) errors.push("Must contain at least one lower case letter");
    if (!/.*[A-Z].*/.test(event.target.value)) errors.push("Must contain at least one upper case letter");
    if (!/.*\d.*/.test(event.target.value)) errors.push("Must contain at least one digit");
    if (!/.{8,}/.test(event.target.value)) errors.push("Must be at least 8 characters long");
  }

  function handleNameChange(e) {
    setName(e.target.value);
    let errors = [];
    if (!e.target.value.trim()) errors.push("Name is required");
    setIsNameError(errors.length !== 0);
    setNameErrors(errors);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    let errors = [];
    if (!e.target.value.trim()) errors.push("Email is required");
    else checkEmailFormat(e, errors);
    setIsEmailError(errors.length !== 0);
    setEmailErrors(errors);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    let errors = [];
    if (!e.target.value.trim()) errors.push("Password is required");
    else checkPasswordStrength(e, errors);
    setIsPasswordError(errors.length !== 0);
    setPasswordErrors(errors);
  }

  async function handleSubmit() {
    let nErrors = [];
    let eErrors = [];
    let pErrors = [];

    if (!name.trim()) {
      nErrors.push("Name is required");
      setIsNameError(true);
    }
    if (!email.trim()) {
      eErrors.push("Email is required");
      setIsEmailError(true);
    }
    if (!password.trim()) {
      pErrors.push("Password is required");
      setIsPasswordError(true);
    }

    if (nErrors.length > 0 || eErrors.length > 0 || pErrors.length > 0) {
      setNameErrors(nErrors);
      setEmailErrors(eErrors);
      setPasswordErrors(pErrors);
      return;
    }

    if (emailErrors.length !== 0 || passwordErrors.length !== 0 || nameErrors.length !== 0) return;

    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ name, email, password });
    try {
      let response = await fetch("http://localhost:8000/admin/teacher", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Teacher created successfully");
        handleOpenToast();
        handleClose();
        fetchTeacher();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to create teacher");
        handleOpenToast();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
    }
  }

  const filteredTeachers = teacher.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q))
    );
  });

  return (
    <Box>
      {/* Top Header */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Teacher Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
            Manage instructors, classroom educators, and assign them to batches
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: "12px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
          }}
        >
          Add Teacher
        </Button>
      </Box>

      {/* KPI & Search */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                backgroundColor: "#F0FDF4",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PeopleAltRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Teachers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.2 }}>
                {noTeachers}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search teachers by name or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px" },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Modern Table */}
      <DisplayTable
        columns={["name", "email", "action"]}
        rows={filteredTeachers}
        elevation={0}
        handleEditOpen={handleEditOpen}
        handleDeleteOpen={handleDeleteOpen}
      />

      {/* Add Modal */}
      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add New Teacher / Instructor"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Teacher Full Name *
            </Typography>
            <TextField
              fullWidth
              name="name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={handleNameChange}
              error={isNameError}
            />
            {nameErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Email Address *
            </Typography>
            <TextField
              fullWidth
              name="email"
              placeholder="teacher@school.com"
              value={email}
              onChange={handleEmailChange}
              error={isEmailError}
            />
            {emailErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Initial Password *
            </Typography>
            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={handlePasswordChange}
              error={isPasswordError}
            />
            {passwordErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>
        </Stack>
      </ModalForm>

      {/* Edit Form */}
      <EditForm
        open={edit}
        handleClose={handleEditClose}
        handleSubmit={handleEditSubmit}
        title="Edit Teacher Profile"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Full Name *
            </Typography>
            <TextField
              fullWidth
              name="name"
              value={name}
              onChange={handleNameChange}
              error={isNameError}
            />
            {nameErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Email Address *
            </Typography>
            <TextField
              fullWidth
              name="email"
              value={email}
              onChange={handleEmailChange}
              error={isEmailError}
            />
            {emailErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>
        </Stack>
      </EditForm>

      {/* Delete Dialog */}
      <DeleteModel
        open={deleTeOpen}
        handleDeleteClose={handleDeleteClose}
        handleDeleteSubmit={handleDeleteSubmit}
        title="Delete Teacher"
        message="Are you sure you want to remove this teacher from the platform?"
      />

      <Toastify
        open={openToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
      />
    </Box>
  );
};

export default TeacherView;
