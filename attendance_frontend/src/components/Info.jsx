import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const Info = ({ url = "admin" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuth();

  async function fetchUserInfo() {
    try {
      let headersList = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let response = await fetch(`http://localhost:8000/${url}/info`, {
        method: "GET",
        headers: headersList,
      });

      let res = await response.json();
      if (res.success) {
        setData(res.result);
      }
    } catch (e) {
      console.error("Error fetching user info:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [url]);

  const getRoleIcon = () => {
    if (url === "admin") return <AdminPanelSettingsOutlinedIcon fontSize="small" />;
    if (url === "teacher") return <MenuBookOutlinedIcon fontSize="small" />;
    return <SchoolOutlinedIcon fontSize="small" />;
  };

  const getRoleColor = () => {
    if (url === "admin") return { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" };
    if (url === "teacher") return { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" };
    return { bg: "#F0F9FF", text: "#0284C7", border: "#BAE6FD" };
  };

  const roleStyle = getRoleColor();

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="circular" width={64} height={64} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: "1.5rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
            boxShadow: "0 8px 20px -4px rgba(79, 70, 229, 0.3)",
          }}
        >
          {data?.name ? data.name.charAt(0).toUpperCase() : data?.email ? data.email.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            {data?.name || "System Administrator"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Chip
              icon={getRoleIcon()}
              label={url.toUpperCase()}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                backgroundColor: roleStyle.bg,
                color: roleStyle.text,
                border: `1px solid ${roleStyle.border}`,
              }}
            />
            <Chip
              icon={<VerifiedUserOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              label="Verified Active"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                backgroundColor: "#F0FDF4",
                color: "#16A34A",
                border: "1px solid #DCFCE7",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {data?.name && (
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonOutlineIcon sx={{ fontSize: 16 }} /> FULL NAME
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}>
                {data.name}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sm={data?.name ? 6 : 12}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
              <EmailOutlinedIcon sx={{ fontSize: 16 }} /> EMAIL ADDRESS
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}>
              {data?.email || "No email provided"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Info;
