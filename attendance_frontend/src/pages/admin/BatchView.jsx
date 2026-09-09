import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  TextField,
  Skeleton,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ModalForm from "../../components/ModalForm";
import Toastify from "../../components/Toastify";
import { useAuth } from "../../context/auth";

const BatchView = () => {
  const [loader, setLoader] = useState(true);
  const [batch, setBatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noBatches, setNoBatches] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [courseErrors, setCourseErrors] = useState([]);
  const [nameErrors, setNameErrors] = useState([]);
  const [isCourseError, setIsCourseError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setName("");
    setCourse("");
    setNameErrors([]);
    setCourseErrors([]);
    setIsNameError(false);
    setIsCourseError(false);
    setOpen(false);
  };

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  function required(event, errors) {
    if (event.target.value.trim() === "") {
      errors.push(`${event.target.name} is required`);
    }
  }

  const checks = {
    course: [required],
    name: [required],
  };

  function handleNameChange(e) {
    setName(e.target.value);
    let errors = [];
    checks.name.forEach((v) => v(e, errors));
    setIsNameError(errors.length !== 0);
    setNameErrors(errors);
  }

  function handleCourseChange(e) {
    setCourse(e.target.value);
    let errors = [];
    checks.course.forEach((v) => v(e, errors));
    setIsCourseError(errors.length !== 0);
    setCourseErrors(errors);
  }

  async function handleSubmit() {
    let nErrors = [];
    let cErrors = [];

    if (!name.trim()) {
      nErrors.push("Batch name is required");
      setIsNameError(true);
    }
    if (!course.trim()) {
      cErrors.push("Course name is required");
      setIsCourseError(true);
    }

    if (nErrors.length > 0 || cErrors.length > 0) {
      setNameErrors(nErrors);
      setCourseErrors(cErrors);
      return;
    }

    if (isCourseError || isNameError) return;

    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ name, course });
    try {
      let response = await fetch("http://localhost:8000/admin/batch/", {
        method: "post",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setOpenToast(true);
        setToastMessage(data.message || "Batch created successfully");
        setSeverity("success");
        handleClose();
        fetchBatch();
      } else {
        setOpenToast(true);
        setToastMessage(data.message || "Failed to create batch");
        setSeverity("error");
      }
    } catch (e) {
      setOpenToast(true);
      setToastMessage("Something went wrong while creating batch");
      setSeverity("error");
    }
  }

  async function fetchBatch() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch("http://localhost:8000/admin/batch", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setNoBatches(data.result.length);
        setBatch(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchBatch();
  }, []);

  function handleBatchClick(id) {
    navigate(`/admin/batch/${id}`);
  }

  const filteredBatches = batch.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.course && b.course.toLowerCase().includes(q))
    );
  });

  return (
    <Box>
      {/* Top Header & Actions */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Batches & Classes
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
            Create, allocate instructors, and manage classroom batches
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
            background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
            boxShadow: "0 8px 16px -2px rgba(79, 70, 229, 0.3)",
          }}
        >
          Create New Batch
        </Button>
      </Box>

      {/* KPI Stats Row */}
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
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClassRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Active Batches
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.2 }}>
                {loader ? <Skeleton width={50} /> : noBatches}
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
              placeholder="Search batches by course or batch name..."
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

      {/* Batch Cards Grid */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
          All Configured Batches ({filteredBatches.length})
        </Typography>

        {loader ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <Grid item xs={12} sm={6} md={4} key={k}>
                <Skeleton variant="rounded" height={180} sx={{ borderRadius: "16px" }} />
              </Grid>
            ))}
          </Grid>
        ) : filteredBatches.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBatches.map((v, i) => (
              <Grid item xs={12} sm={6} md={4} key={v._id || i}>
                <Card
                  sx={{
                    borderRadius: "18px",
                    border: "1px solid #E2E8F0",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 16px 30px -8px rgba(0, 0, 0, 0.1)",
                      borderColor: "#C7D2FE",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleBatchClick(v._id)} sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip
                        icon={<MenuBookRoundedIcon sx={{ fontSize: "16px !important", color: "#4F46E5" }} />}
                        label={v.course}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          backgroundColor: "#EEF2FF",
                          color: "#4F46E5",
                          border: "1px solid #C7D2FE",
                        }}
                      />
                      <Chip label="Active" size="small" sx={{ fontWeight: 700, backgroundColor: "#F0FDF4", color: "#16A34A", fontSize: "0.7rem" }} />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}>
                      {v.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                      Course Specialization: <strong>{v.course}</strong>
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#4F46E5" }}>
                        Manage Batch & Attendance
                      </Typography>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
            <FolderOpenOutlinedIcon sx={{ fontSize: 54, color: "#94A3B8", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
              No batches found
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              {searchQuery ? "Try searching for a different course name" : "Get started by creating your first classroom batch"}
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddRoundedIcon />} onClick={handleOpen}>
              Create Batch
            </Button>
          </Paper>
        )}
      </Box>

      {/* Modal Form for Creating Batch */}
      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Create New Classroom Batch"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
              Batch Name *
            </Typography>
            <TextField
              fullWidth
              name="name"
              placeholder="e.g. Batch A - 2026 Morning"
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
              Course / Subject Title *
            </Typography>
            <TextField
              fullWidth
              name="course"
              placeholder="e.g. Full Stack Web Development"
              value={course}
              onChange={handleCourseChange}
              error={isCourseError}
            />
            {courseErrors.map((err, i) => (
              <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                {err}
              </Typography>
            ))}
          </Box>
        </Stack>
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

export default BatchView;
