import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function Home() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/${role}/login`);
  };

  const roles = [
    {
      id: "admin",
      title: "Administrator",
      subtitle: "Full Management Access",
      desc: "Create and configure batches, assign teachers, manage student enrollments, and oversee system analytics.",
      badgeColor: "#EEF2FF",
      badgeText: "#4F46E5",
      borderColor: "#C7D2FE",
      gradient: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
      icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      features: ["Batch & Course Creation", "Teacher & Student Allocation", "Complete System Oversight"],
    },
    {
      id: "teacher",
      title: "Instructor / Teacher",
      subtitle: "Classroom Studio",
      desc: "Mark fast daily attendance with one-click presets, inspect student records, and export detailed CSV reports.",
      badgeColor: "#F0FDF4",
      badgeText: "#16A34A",
      borderColor: "#BBF7D0",
      gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      icon: <MenuBookRoundedIcon sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      features: ["One-Click Quick Attendance", "Historical Monthly Matrix", "Instant CSV Export"],
    },
    {
      id: "student",
      title: "Student Portal",
      subtitle: "Personal Progress",
      desc: "Monitor your attendance percentage, track total present/absent days, and view performance history.",
      badgeColor: "#F0F9FF",
      badgeText: "#0284C7",
      borderColor: "#BAE6FD",
      gradient: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
      icon: <SchoolRoundedIcon sx={{ fontSize: 36, color: "#FFFFFF" }} />,
      features: ["Real-Time Attendance Rate", "Class-by-Class Breakdown", "Downloadable Report"],
    },
  ];

  const highlights = [
    {
      icon: <BoltOutlinedIcon sx={{ color: "#4F46E5" }} />,
      title: "Fast One-Click Recording",
      desc: "Quick presets to mark entire batches present, absent, or on leave in seconds.",
    },
    {
      icon: <AssessmentOutlinedIcon sx={{ color: "#0EA5E9" }} />,
      title: "Matrix Heatmap & Analytics",
      desc: "Visual daily breakdown with instant calculation of attendance percentages.",
    },
    {
      icon: <FileDownloadOutlinedIcon sx={{ color: "#10B981" }} />,
      title: "One-Click CSV Export",
      desc: "Export attendance sheets formatted for administrative records with one tap.",
    },
    {
      icon: <SecurityOutlinedIcon sx={{ color: "#F59E0B" }} />,
      title: "Role-Based Authentication",
      desc: "Granular access control tailored specifically for Admins, Teachers, and Students.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          py: 1.8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 8px 16px -2px rgba(79, 70, 229, 0.3)",
                }}
              >
                <AssessmentOutlinedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A" }}>
                Attend<span style={{ color: "#4F46E5" }}>Flow</span>
              </Typography>
              <Chip
                label="v2.0"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  backgroundColor: "#EEF2FF",
                  color: "#4F46E5",
                  height: 20,
                  ml: 0.5,
                }}
              />
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleRoleSelect("teacher")}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Teacher Portal
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRoleSelect("admin")}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Admin Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 9 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Container maxWidth="md">
          <Chip
            icon={<BoltOutlinedIcon sx={{ fontSize: "16px !important", color: "#4F46E5" }} />}
            label="Intelligent Attendance Management Platform"
            sx={{
              backgroundColor: "#EEF2FF",
              color: "#4F46E5",
              fontWeight: 700,
              fontSize: "0.8125rem",
              mb: 3,
              px: 1,
              py: 2,
              borderRadius: "9999px",
              border: "1px solid #C7D2FE",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.15,
              mb: 2.5,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
            }}
          >
            Smart Attendance Tracking for Modern{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Institutions
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#64748B",
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 5,
              fontSize: { xs: "1rem", sm: "1.15rem" },
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Effortlessly organize batches, mark student records in seconds, track real-time attendance rates, and export monthly CSV analytics.
          </Typography>
        </Container>

        {/* Role Cards Grid */}
        <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
          <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", mb: 3 }}>
            Select Your Portal to Continue
          </Typography>

          <Grid container spacing={3.5} justifyContent="center">
            {roles.map((r) => (
              <Grid item xs={12} md={4} key={r.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    p: 1.5,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.1)",
                      borderColor: "#CBD5E1",
                    },
                  }}
                  onClick={() => handleRoleSelect(r.id)}
                >
                  <CardContent sx={{ p: 2.5, textAlign: "left" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "16px",
                          background: r.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 10px 20px -5px rgba(0,0,0,0.15)",
                        }}
                      >
                        {r.icon}
                      </Box>
                      <Chip
                        label={r.subtitle}
                        size="small"
                        sx={{
                          backgroundColor: r.badgeColor,
                          color: r.badgeText,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          border: `1px solid ${r.borderColor}`,
                        }}
                      />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}>
                      {r.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.5, mb: 3 }}>
                      {r.desc}
                    </Typography>

                    <Stack spacing={1.2}>
                      {r.features.map((feat, idx) => (
                        <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: r.badgeText }} />
                          <Typography variant="caption" sx={{ color: "#334155", fontWeight: 600 }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2.5, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelect(r.id);
                      }}
                      sx={{
                        background: r.gradient,
                        py: 1.2,
                        borderRadius: "12px",
                        fontWeight: 700,
                      }}
                    >
                      Login as {r.title.split(" ")[0]}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Box sx={{ py: 8, backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#4F46E5", letterSpacing: "0.1em" }}>
              Core Capabilities
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.5 }}>
              Engineered for Seamless Academic Administration
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {highlights.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    height: "100%",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateY(-3px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      backgroundColor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.5 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: "auto", py: 4, backgroundColor: "#0F172A", color: "#94A3B8", textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            © {new Date().getFullYear()} AttendFlow — Modern Attendance Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
