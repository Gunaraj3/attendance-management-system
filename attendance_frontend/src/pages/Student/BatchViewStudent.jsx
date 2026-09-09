import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  Typography,
  TextField,
  Skeleton,
  Chip,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { useAuth } from "../../context/auth";

const BatchViewStudent = () => {
  const [loader, setLoader] = useState(true);
  const [batch, setBatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noBatches, setNoBatches] = useState(0);

  const user = useAuth();
  const navigate = useNavigate();

  async function fetchBatch() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch("http://localhost:8000/student/class", {
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
    navigate(`/student/batch/${id}`);
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
      {/* Top Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          My Enrolled Batches
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
          Select a class batch to view your detailed attendance records, percentage stats, and report
        </Typography>
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
                backgroundColor: "#F0F9FF",
                color: "#0284C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Enrolled Classes
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
              placeholder="Search your enrolled classes by title..."
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
          Enrolled Classes ({filteredBatches.length})
        </Typography>

        {loader ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((k) => (
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
                      borderColor: "#BAE6FD",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleBatchClick(v._id)} sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip
                        icon={<MenuBookRoundedIcon sx={{ fontSize: "16px !important", color: "#0284C7" }} />}
                        label={v.course}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          backgroundColor: "#F0F9FF",
                          color: "#0284C7",
                          border: "1px solid #BAE6FD",
                        }}
                      />
                      <Chip label="Enrolled" size="small" sx={{ fontWeight: 700, backgroundColor: "#E0F2FE", color: "#0369A1", fontSize: "0.7rem" }} />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}>
                      {v.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                      Course Specialization: <strong>{v.course}</strong>
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0284C7" }}>
                        View Personal Attendance Log
                      </Typography>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: "#0284C7" }} />
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
              No enrolled classes found
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              You have not been registered into any active classroom batches yet.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default BatchViewStudent;
