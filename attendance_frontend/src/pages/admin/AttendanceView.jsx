import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useAuth } from "../../context/auth";

const AttendanceView = () => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const user = useAuth();
  const navigate = useNavigate();

  async function fetchBatches() {
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
      if (data.success && data.result) {
        setBatches(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Attendance Hub
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
          Select a batch below to record today's session or inspect historical attendance analytics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {batches.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b._id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "18px",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 25px -4px rgba(0,0,0,0.08)",
                  borderColor: "#C7D2FE",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "#EEF2FF",
                    color: "#4F46E5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClassRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    {b.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    {b.course}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate(`/admin/batch/${b._id}`)}
                sx={{ borderRadius: "10px", fontWeight: 700, mt: 1 }}
              >
                Open Attendance Studio
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AttendanceView;
