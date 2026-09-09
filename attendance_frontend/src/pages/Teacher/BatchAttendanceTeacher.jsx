import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  CircularProgress,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Toastify from "../../components/Toastify";

const BatchAttendanceTeacher = () => {
  const [batchStudent, setBatchStudent] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { batchId } = useParams();
  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  function goBack() {
    navigate(-1);
  }

  async function fetchBatchStudent() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        "http://localhost:8000/attendance/studentList/" + batchId,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.success && data.result) {
        let res = data.result.map((v) => ({
          name: v.name,
          status: "P",
          studentId: v._id,
        }));
        setBatchStudent(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (batchStudent.length === 0) return;
    setSubmitting(true);
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let bodyContent = JSON.stringify({ data: batchStudent });
      let response = await fetch(
        "http://localhost:8000/attendance/submit/" + batchId,
        {
          method: "post",
          headers: headersList,
          body: bodyContent,
        }
      );

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Attendance recorded successfully");
        handleOpenToast();
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to submit attendance");
        handleOpenToast();
      }
    } catch (e) {
      setSeverity("error");
      setToastMessage("Something went wrong while submitting attendance");
      handleOpenToast();
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    fetchBatchStudent();
  }, [batchId]);

  const markAll = (status) => {
    const updated = batchStudent.map((s) => ({ ...s, status }));
    setBatchStudent(updated);
  };

  const setStudentStatus = (index, status) => {
    const updated = [...batchStudent];
    updated[index].status = status;
    setBatchStudent(updated);
  };

  const presentCount = batchStudent.filter((s) => s.status === "P").length;
  const absentCount = batchStudent.filter((s) => s.status === "A").length;
  const leaveCount = batchStudent.filter((s) => s.status === "L").length;
  const totalStudents = batchStudent.length;
  const presentPct = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box>
      {/* Top Breadcrumb & Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Tooltip title="Back to Batches" arrow>
          <IconButton
            onClick={goBack}
            sx={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              "&:hover": { backgroundColor: "#F1F5F9" },
            }}
          >
            <ArrowBackRoundedIcon sx={{ color: "#0F172A" }} />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Classroom Attendance Session
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Date: <strong>{todayDate}</strong> (Batch ID: {batchId})
          </Typography>
        </Box>
      </Box>

      {/* Bulk Presets Bar */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CheckRoundedIcon />}
          onClick={() => markAll("P")}
          sx={{
            color: "#16A34A",
            borderColor: "#86EFAC",
            backgroundColor: "#F0FDF4",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#DCFCE7", borderColor: "#4ADE80" },
          }}
        >
          Mark All Present
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloseRoundedIcon />}
          onClick={() => markAll("A")}
          sx={{
            color: "#E11D48",
            borderColor: "#FDA4AF",
            backgroundColor: "#FFF1F2",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#FFE4E6", borderColor: "#FB7185" },
          }}
        >
          Mark All Absent
        </Button>
      </Box>

      {/* Live Counter Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            label={`Total: ${totalStudents} Students`}
            sx={{ fontWeight: 700, backgroundColor: "#F1F5F9", color: "#334155" }}
          />
          <Chip
            icon={<CheckCircleRoundedIcon sx={{ fontSize: "16px !important", color: "#16A34A" }} />}
            label={`Present: ${presentCount} (${presentPct}%)`}
            sx={{ fontWeight: 700, backgroundColor: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}
          />
          <Chip
            icon={<CancelRoundedIcon sx={{ fontSize: "16px !important", color: "#E11D48" }} />}
            label={`Absent: ${absentCount}`}
            sx={{ fontWeight: 700, backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FECDD3" }}
          />
          <Chip
            icon={<AccessTimeFilledRoundedIcon sx={{ fontSize: "16px !important", color: "#D97706" }} />}
            label={`Leave / Late: ${leaveCount}`}
            sx={{ fontWeight: 700, backgroundColor: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}
          />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
          onClick={register}
          disabled={submitting || totalStudents === 0}
          sx={{
            py: 1,
            px: 3,
            borderRadius: "10px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
          }}
        >
          {submitting ? "Submitting..." : "Save & Submit Attendance"}
        </Button>
      </Paper>

      {/* Student List Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ width: "10%" }}>#</TableCell>
              <TableCell sx={{ width: "50%" }}>Student Name</TableCell>
              <TableCell align="center" sx={{ width: "40%" }}>
                Attendance Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batchStudent && batchStudent.length > 0 ? (
              batchStudent.map((row, i) => (
                <TableRow
                  key={row.studentId || i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#F8FAFC" },
                  }}
                >
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                    {i + 1}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
                        }}
                      >
                        {row.name ? row.name.charAt(0).toUpperCase() : "S"}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
                        {row.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: "10px", overflow: "hidden" }}>
                      <Button
                        onClick={() => setStudentStatus(i, "P")}
                        variant={row.status === "P" ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: row.status === "P" ? "#10B981 !important" : "transparent",
                          color: row.status === "P" ? "#FFFFFF !important" : "#10B981",
                          borderColor: "#10B981 !important",
                          fontWeight: 700,
                          px: 2,
                        }}
                      >
                        Present
                      </Button>
                      <Button
                        onClick={() => setStudentStatus(i, "A")}
                        variant={row.status === "A" ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: row.status === "A" ? "#F43F5E !important" : "transparent",
                          color: row.status === "A" ? "#FFFFFF !important" : "#F43F5E",
                          borderColor: "#F43F5E !important",
                          fontWeight: 700,
                          px: 2,
                        }}
                      >
                        Absent
                      </Button>
                      <Button
                        onClick={() => setStudentStatus(i, "L")}
                        variant={row.status === "L" ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: row.status === "L" ? "#F59E0B !important" : "transparent",
                          color: row.status === "L" ? "#FFFFFF !important" : "#F59E0B",
                          borderColor: "#F59E0B !important",
                          fontWeight: 700,
                          px: 2,
                        }}
                      >
                        Leave
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No students currently enrolled in this batch.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Toastify
        open={openToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
      />
    </Box>
  );
};

export default BatchAttendanceTeacher;
