import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

export default function DisplayTable({
  columns,
  rows,
  elevation = 0,
  handleEditOpen,
  handleDeleteOpen,
  admin = "",
}) {
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
            {admin !== "admin" && <TableCell>Name</TableCell>}
            <TableCell>Email Address</TableCell>
            {columns.includes("action") && (
              <TableCell align="right" sx={{ pr: 3 }}>
                Actions
              </TableCell>
            )}
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
                {admin !== "admin" && (
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
                        }}
                      >
                        {getInitials(row.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Active Member
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                )}

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      {row.email}
                    </Typography>
                  </Box>
                </TableCell>

                {columns.includes("action") && (
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <Tooltip title="Edit Member" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEditOpen(e, row._id)}
                          sx={{
                            backgroundColor: "rgba(79, 70, 229, 0.08)",
                            "&:hover": { backgroundColor: "rgba(79, 70, 229, 0.18)" },
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Member" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDeleteOpen(e, row._id)}
                          sx={{
                            backgroundColor: "rgba(244, 63, 94, 0.08)",
                            "&:hover": { backgroundColor: "rgba(244, 63, 94, 0.18)" },
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "text.secondary" }}>
                    No records found
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click the "Add" button above to create a new record.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
