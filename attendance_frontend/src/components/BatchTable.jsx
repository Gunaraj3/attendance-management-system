import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import IndividualAttendance from "./IndividualAttendance";

export default function BatchTable({
  columns,
  rows,
  handleUnassign,
  elevation = 0,
  student,
}) {
  const [attendance, setAttendance] = useState(false);
  const handleClose = () => setAttendance(false);
  let [email, setEmail] = useState("");

  function handleViewAttendance(e, studentEmail) {
    setEmail(studentEmail);
    setAttendance(true);
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <TableContainer
      component={Paper}
      elevation={elevation}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right" sx={{ pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.length > 0 ? (
            rows.map((row, i) => (
              <TableRow
                key={row._id || i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.15s ease",
                  "&:hover": { backgroundColor: "#F8FAFC" },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        background: student
                          ? "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)"
                          : "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",
                      }}
                    >
                      {getInitials(row.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {student ? "Enrolled Student" : "Assigned Instructor"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      {row.email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right" sx={{ pr: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    {student && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={(e) => handleViewAttendance(e, row.email)}
                        sx={{
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          py: 0.5,
                          px: 1.5,
                        }}
                      >
                        Attendance
                      </Button>
                    )}

                    <Tooltip title="Unassign from Batch" arrow>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={(e) => handleUnassign(e, row._id)}
                        sx={{
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          py: 0.5,
                          px: 1.5,
                        }}
                      >
                        Unassign
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "text.secondary" }}>
                    No assigned members yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click the assign button above to add members to this batch.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {attendance && (
        <IndividualAttendance
          isOpen={attendance}
          handleClose={handleClose}
          email={email}
        />
      )}
    </TableContainer>
  );
}
