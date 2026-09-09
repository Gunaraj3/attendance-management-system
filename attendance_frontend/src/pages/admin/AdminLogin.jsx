import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAuth } from "../../context/auth";
import Toastify from "../../components/Toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const user = useAuth();
  const navigate = useNavigate();

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  function required(event, errors) {
    if (event.target.value.trim() === "") {
      errors.push(`${event.target.name} is required`);
    }
  }

  function checkEmailFormat(event, errors) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(event.target.value)) {
      errors.push("Invalid email format");
    }
  }

  const checks = {
    email: [required, checkEmailFormat],
    password: [required],
  };

  function handleEmailChange(e) {
    setEmail(e.target.value);
    let errors = [];
    checks.email.forEach((v) => v(e, errors));
    setIsEmailError(errors.length !== 0);
    setEmailErrors(errors);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    let errors = [];
    checks.password.forEach((v) => v(e, errors));
    setIsPasswordError(errors.length !== 0);
    setPasswordErrors(errors);
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();

    let eErrors = [];
    let pErrors = [];

    if (!email) {
      eErrors.push("Email is required");
      setIsEmailError(true);
    }
    if (!password) {
      pErrors.push("Password is required");
      setIsPasswordError(true);
    }

    if (eErrors.length > 0 || pErrors.length > 0) {
      setEmailErrors(eErrors);
      setPasswordErrors(pErrors);
      return;
    }

    if (isEmailError || isPasswordError) return;

    setLoading(true);
    try {
      const da = await user.login({ email, password }, "/admin/list");
      if (da && !da.success) {
        setOpenToast(true);
        setToastMessage(da.message || "Invalid email or password");
      }
    } catch (err) {
      setOpenToast(true);
      setToastMessage("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        backgroundImage: "radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.08) 0px, transparent 40%), radial-gradient(at 90% 80%, rgba(14, 165, 233, 0.08) 0px, transparent 40%)",
        p: 2.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
          p: { xs: 3.5, sm: 4.5 },
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Top Back & Role Tabs */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Button
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/")}
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Home
          </Button>

          <Tabs
            value="admin"
            onChange={(e, val) => navigate(`/${val}/login`)}
            sx={{
              minHeight: 36,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              value="admin"
              label="Admin"
              sx={{
                minHeight: 32,
                px: 1.5,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 700,
                borderRadius: "8px",
                backgroundColor: "#EEF2FF",
                color: "#4F46E5 !important",
              }}
            />
            <Tab
              value="teacher"
              label="Teacher"
              sx={{ minHeight: 32, px: 1.5, py: 0.5, fontSize: "0.75rem", fontWeight: 600, color: "#64748B" }}
            />
            <Tab
              value="student"
              label="Student"
              sx={{ minHeight: 32, px: 1.5, py: 0.5, fontSize: "0.75rem", fontWeight: 600, color: "#64748B" }}
            />
          </Tabs>
        </Box>

        {/* Brand & Title */}
        <Box sx={{ textAlign: "center", mb: 3.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.35)",
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 32, color: "#FFFFFF" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
            Admin Portal
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
            Sign in with administrative credentials to manage system
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                name="email"
                placeholder="admin@school.com"
                value={email}
                onChange={handleEmailChange}
                error={isEmailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              {emailErrors.map((err, i) => (
                <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                  {err}
                </Typography>
              ))}
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={handlePasswordChange}
                error={isPasswordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {passwordErrors.map((err, i) => (
                <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                  {err}
                </Typography>
              ))}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In to Admin Dashboard"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Toastify
        open={openToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity="error"
      />
    </Box>
  );
};

export default AdminLogin;
