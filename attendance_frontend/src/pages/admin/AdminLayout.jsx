import React, { useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useAuth } from "../../context/auth";

const drawerWidth = 260;
const collapsedDrawerWidth = 78;

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const user = useAuth();
  const location = useLocation();

  const role = user.role() ? user.role() : "student";
  if (role !== "admin") {
    let path = role === "teacher" ? "/teacher/batch" : "/student/batch";
    return <Navigate to={path} replace={true} />;
  }

  const logout = () => {
    user.logout({ url: "admin" });
  };

  const navItems = [
    { text: "Administrators", path: "list", icon: <AdminPanelSettingsRoundedIcon /> },
    { text: "Batches & Courses", path: "batch", icon: <ClassRoundedIcon /> },
    { text: "Teachers", path: "teacher", icon: <PeopleAltRoundedIcon /> },
    { text: "Students", path: "student", icon: <SchoolRoundedIcon /> },
    { text: "Settings", path: "setting", icon: <SettingsRoundedIcon /> },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const getPageTitle = () => {
    const currentPath = location.pathname.split("/").pop();
    const item = navItems.find((n) => n.path === currentPath);
    return item ? item.text : "Admin Dashboard";
  };

  const currentDrawerWidth = open ? drawerWidth : collapsedDrawerWidth;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          color: "#0F172A",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(!open)}
              sx={{
                p: 1,
                borderRadius: "10px",
                backgroundColor: "rgba(0,0,0,0.03)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
              }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                {getPageTitle()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                px: 1.8,
                py: 0.6,
                borderRadius: "20px",
                backgroundColor: "#F1F5F9",
                border: "1px solid #E2E8F0",
              }}
            >
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "#64748B" }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                {currentDate}
              </Typography>
            </Box>

            <Chip
              label="ADMIN"
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: "0.75rem",
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                border: "1px solid #C7D2FE",
                px: 0.5,
              }}
            />

            <Tooltip title="Logout" arrow>
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  color: "#F43F5E",
                  backgroundColor: "#FFF1F2",
                  "&:hover": { backgroundColor: "#FFE4E6" },
                  p: 1,
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: currentDrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            borderRight: "1px solid #1E293B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        {/* Sidebar Brand Header */}
        <Box>
          <Box sx={{ p: open ? 2.5 : 1.5, display: "flex", alignItems: "center", gap: 1.5, minHeight: 64 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 16px -2px rgba(79, 70, 229, 0.4)",
              }}
            >
              <AssessmentOutlinedIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
            </Box>
            {open && (
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}>
                  Attend<span style={{ color: "#818CF8" }}>Flow</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                  Admin Suite
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: "#1E293B", my: 1 }} />

          {/* Navigation Items */}
          <List sx={{ px: open ? 1.5 : 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.8, display: "block" }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    borderRadius: "12px",
                    backgroundColor: isActive ? "#4F46E5" : "transparent",
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    padding: open ? "10px 14px" : "10px 0",
                    justifyContent: open ? "flex-start" : "center",
                    transition: "all 0.2s ease",
                  })}
                >
                  {({ isActive }) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        width: "100%",
                        justifyContent: open ? "flex-start" : "center",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: isActive ? "#FFFFFF" : "#94A3B8",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 600 }}>
                          {item.text}
                        </Typography>
                      )}
                    </Box>
                  )}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Sidebar Footer / User Profile */}
        <Box sx={{ p: open ? 2 : 1, borderTop: "1px solid #1E293B", backgroundColor: "rgba(0,0,0,0.2)" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                fontSize: "0.875rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
              }}
            >
              A
            </Avatar>
            {open && (
              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#FFFFFF", noWrap: true }}>
                  Administrator
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", noWrap: true }}>
                  Admin Privileges
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: "64px",
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#F8FAFC",
        }}
      >
        <Box className="animate-fade-in" sx={{ maxWidth: 1400, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
