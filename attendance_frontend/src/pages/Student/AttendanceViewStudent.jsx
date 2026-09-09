import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Toastify from "../../components/Toastify";

const AttendanceViewStudent = () => {
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [leaveDays, setLeaveDays] = useState(0);
  const [columns, setColumns] = useState([]);
  const [studentRep, setStudentRep] = useState([]);
  const [data, setData] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);

  const navigate = useNavigate();
  const { batchId } = useParams();
  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  const goBack = () => {
    navigate(-1);
  };

  async function fetchStudentsReport() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let emailData = await fetch(`http://localhost:8000/student/info`, {
        method: "GET",
        headers: headersList,
      });

      let emailResponse = await emailData.json();
      let email = emailResponse.result?.email;
      setStudentEmail(email || "");

      if (!email) return;

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

  async function downloadCSv() {
    setDownloading(true);
    try {
      let headerCsv = {
        "Content-type": "text/csv",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        `http://localhost:8000/attendance/export/${batchId}/${studentEmail}`,
        {
          method: "GET",
          headers: headerCsv,
        }
      );

      let blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `my-attendance-report-${batchId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSeverity("success");
      setToastMessage("Attendance CSV report downloaded successfully");
      handleOpenToast();
    } catch (e) {
      setSeverity("error");
      setToastMessage("Failed to download CSV report");
      handleOpenToast();
    } finally {
      setDownloading(false);
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
    fetchStudentsReport();
  }, [batchId]);

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
    <Box>
      {/* Breadcrumb & Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Back to Classes" arrow>
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
              My Class Attendance Report
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              Batch ID: {batchId}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <FileDownloadOutlinedIcon />}
          onClick={downloadCSv}
          disabled={downloading || totalDays === 0}
          sx={{
            borderRadius: "10px",
            fontWeight: 700,
            borderWidth: "1.5px",
          }}
        >
          Download CSV Sheet
        </Button>
      </Box>

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
                Total Recorded Days
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
                    No attendance records logged for your account in this batch yet.
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

export default AttendanceViewStudent;
