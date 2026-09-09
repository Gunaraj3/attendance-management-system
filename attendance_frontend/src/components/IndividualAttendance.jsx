import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { useParams } from "react-router-dom";
import {
  Dialog,
  Grid,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IndividualAttendance = ({ email, handleClose, isOpen }) => {
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [leaveDays, setLeaveDays] = useState(0);
  const [columns, setColumns] = useState([]);
  const [studentRep, setStudentRep] = useState([]);
  const [data, setData] = useState([]);
  const [totalDays, setTotalDays] = useState(0);

  const { batchId } = useParams();
  const user = useAuth();

  async function fetchStudentsReport() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        `http://localhost:8000/attendance/${batchId}/${email}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let res = await response.json();
      if (res.success && res.result) {
        setData(res.result);

        let dates = new Set();
        let nm = new Set();
        let pDays = 0;
        let lDays = 0;
        let aDays = 0;

        res.result.forEach((v) => {
          dates.add(v.date);
          if (v.studentId) {
            nm.add(v.studentId._id + "---" + v.studentId.name);
          }

          const st = v.status ? v.status.toUpperCase() : "";
          if (st === "A") aDays += 1;
          else if (st === "P") pDays += 1;
          else if (st === "L") lDays += 1;
        });

        let unique = [...dates].sort();
        setPresentDays(pDays);
        setAbsentDays(aDays);
        setLeaveDays(lDays);
        setTotalDays(unique.length);
        setColumns(unique);
        setStudentRep([...nm]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const getAttendanceStatus = (studentId, date) => {
    const record = data.find((item) => {
      if (item.studentId) {
        return item.studentId._id === studentId && item.date === date;
      }
      return false;
    });

    if (!record) return "N";
    return record.status || "N";
  };

  useEffect(() => {
    if (email && batchId) {
      fetchStudentsReport();
    }
  }, [email, batchId]);

  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const renderStatusBadge = (status) => {
    const st = status ? status.toUpperCase() : "";
    if (st === "P") {
      return (
        <Chip
          label="P"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.75rem",
            backgroundColor: "#F0FDF4",
            color: "#16A34A",
            border: "1px solid #BBF7D0",
            minWidth: 28,
            height: 24,
          }}
        />
      );
    }
    if (st === "A") {
      return (
        <Chip
          label="A"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.75rem",
            backgroundColor: "#FFF1F2",
            color: "#E11D48",
            border: "1px solid #FECDD3",
            minWidth: 28,
            height: 24,
          }}
        />
      );
    }
    if (st === "L") {
      return (
        <Chip
          label="L"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.75rem",
            backgroundColor: "#FFFBEB",
            color: "#D97706",
            border: "1px solid #FDE68A",
            minWidth: 28,
            height: 24,
          }}
        />
      );
    }
    return (
      <Typography variant="caption" sx={{ color: "#CBD5E1", fontWeight: 700 }}>
        —
      </Typography>
    );
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { backgroundColor: "#F8FAFC" },
      }}
    >
      {/* Top App Header */}
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          px: { xs: 2, sm: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Student Attendance Performance
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
            {email} — Batch: {batchId}
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: "#F1F5F9",
            "&:hover": { backgroundColor: "#E2E8F0" },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1300, mx: "auto", width: "100%" }}>
        {/* KPI Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: "10px", backgroundColor: "#EEF2FF", color: "#4F46E5" }}>
                  <CalendarMonthRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Total Sessions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A" }}>
                {totalDays} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 500 }}>days</span>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: "10px", backgroundColor: "#F0FDF4", color: "#16A34A" }}>
                  <CheckCircleRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Present Days
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#16A34A" }}>
                {presentDays} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 500 }}>({attendanceRate}%)</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={attendanceRate}
                sx={{
                  mt: 1.5,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#E2E8F0",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#10B981", borderRadius: 3 },
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: "10px", backgroundColor: "#FFF1F2", color: "#E11D48" }}>
                  <CancelRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Absent Days
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#E11D48" }}>
                {absentDays} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 500 }}>days</span>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: "10px", backgroundColor: "#FFFBEB", color: "#D97706" }}>
                  <AccessTimeFilledRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Leave / Late
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#D97706" }}>
                {leaveDays} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 500 }}>days</span>
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Date Breakdown Matrix Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Student</TableCell>
                {columns && columns.length > 0 ? (
                  columns.map((v, i) => (
                    <TableCell key={i} align="center" sx={{ fontWeight: 700, minWidth: 65, px: 1 }}>
                      {v.split("T")[0].split("-").slice(1).join("/")}
                    </TableCell>
                  ))
                ) : (
                  <TableCell align="center">Dates</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {studentRep && studentRep.length > 0 ? (
                studentRep.map((name, i) => {
                  const [studentId, studentName] = name.split("---");
                  return (
                    <TableRow key={i} sx={{ "&:hover": { backgroundColor: "#F8FAFC" } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                        {studentName}
                      </TableCell>
                      {columns.map((v, cIdx) => (
                        <TableCell key={cIdx} align="center" sx={{ px: 1 }}>
                          {renderStatusBadge(getAttendanceStatus(studentId, v))}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1 || 2} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No attendance records found for this student.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Dialog>
  );
};

export default IndividualAttendance;
