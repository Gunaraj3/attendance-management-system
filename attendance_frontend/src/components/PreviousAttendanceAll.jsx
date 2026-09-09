import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { useParams } from "react-router-dom";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Toastify from "./Toastify";

const PreviousAttendanceAll = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [studentRep, setStudentRep] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString();

  const [inputYear, setInputYear] = useState(currentYear);
  const [inputMonth, setInputMonth] = useState(currentMonth);

  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);

  const { batchId } = useParams();
  const user = useAuth();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const years = Array.from({ length: 15 }, (_, i) => (2020 + i).toString());

  async function fetchStudentsReport() {
    setLoading(true);
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(
        `http://localhost:8000/attendance/${batchId}/${inputYear}/${inputMonth}`,
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

        res.result.forEach((v) => {
          if (v.studentId) {
            nm.add(v.studentId._id + "---" + v.studentId.name);
          }
          if (v.date) {
            dates.add(v.date);
          }
        });

        // Sort dates chronologically
        const sortedDates = [...dates].sort();
        setColumns(sortedDates);
        setStudentRep([...nm]);
      } else {
        setData([]);
        setColumns([]);
        setStudentRep([]);
      }
    } catch (e) {
      console.error(e);
      setSeverity("error");
      setToastMessage("Failed to fetch historical attendance data");
      handleOpenToast();
    } finally {
      setLoading(false);
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

  async function download() {
    setDownloading(true);
    try {
      let headersList = {
        Authorization: `Bearer ${user.token()}`,
        "Content-type": "text/csv",
      };

      let response = await fetch(
        `http://localhost:8000/attendance/export/${batchId}/${inputYear}/${inputMonth}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance-batch-${batchId}-${inputYear}-${inputMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSeverity("success");
      setToastMessage("Attendance CSV report downloaded successfully");
      handleOpenToast();
    } catch (e) {
      setSeverity("error");
      setToastMessage("Failed to download attendance CSV report");
      handleOpenToast();
    } finally {
      setDownloading(false);
    }
  }

  const renderStatusBadge = (status) => {
    if (status === "P" || status === "p") {
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
    if (status === "A" || status === "a") {
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
    if (status === "L" || status === "l") {
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

  const filteredStudentRep = studentRep.filter((item) => {
    const studentName = item.split("---")[1] || "";
    return studentName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box>
      {/* Filter & Toolbar Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
            <Autocomplete
              value={inputYear}
              onChange={(e, val) => setInputYear(val || currentYear)}
              options={years}
              sx={{ width: { xs: "100%", sm: 150 } }}
              renderInput={(params) => <TextField {...params} label="Select Year" size="small" />}
            />

            <Autocomplete
              value={months.find((m) => m.value === inputMonth)?.label || "Select Month"}
              onChange={(e, val) => {
                const found = months.find((m) => m.label === val);
                if (found) setInputMonth(found.value);
              }}
              options={months.map((m) => m.label)}
              sx={{ width: { xs: "100%", sm: 180 } }}
              renderInput={(params) => <TextField {...params} label="Select Month" size="small" />}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SyncRoundedIcon />}
              onClick={fetchStudentsReport}
              disabled={loading}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              Fetch Records
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search student in report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "10px" },
              }}
            />

            <Button
              variant="outlined"
              color="primary"
              startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <FileDownloadOutlinedIcon />}
              onClick={download}
              disabled={downloading}
              sx={{
                borderRadius: "10px",
                fontWeight: 700,
                borderWidth: "1.5px",
                whiteSpace: "nowrap",
              }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Historical Matrix Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ minWidth: 180, fontWeight: 700 }}>Student Name</TableCell>
              {columns && columns.length > 0 ? (
                columns.map((dateStr, i) => (
                  <TableCell key={i} align="center" sx={{ minWidth: 65, px: 1, fontWeight: 700 }}>
                    {dateStr.split("T")[0].split("-").slice(1).join("/")}
                  </TableCell>
                ))
              ) : (
                <TableCell align="center">Dates</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudentRep && filteredStudentRep.length > 0 ? (
              filteredStudentRep.map((item, i) => {
                const [studentId, studentName] = item.split("---");
                return (
                  <TableRow
                    key={studentId || i}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: "#0F172A" }}>
                      {studentName}
                    </TableCell>

                    {columns && columns.length > 0 ? (
                      columns.map((dateStr, dIdx) => (
                        <TableCell key={dIdx} align="center" sx={{ px: 1 }}>
                          {renderStatusBadge(getAttendanceStatus(studentId, dateStr))}
                        </TableCell>
                      ))
                    ) : (
                      <TableCell align="center" sx={{ color: "text.secondary" }}>
                        No dates recorded
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1 || 2} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {loading ? "Loading attendance records..." : "No attendance logs found for this period."}
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

export default PreviousAttendanceAll;
