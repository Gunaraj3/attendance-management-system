import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Info from "../../components/Info";
import { useAuth } from "../../context/auth";
import Toastify from "../../components/Toastify";

export default function SettingStudent() {
  const user = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordErrors, setOldPasswordErrors] = useState([]);
  const [isOldPasswordError, setIsOldPasswordError] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrors, setNewPasswordErrors] = useState([]);
  const [isNewPasswordError, setIsNewPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [openToast, setOpenToast] = useState(false);

  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);

  function checkPasswordStrength(val, errors) {
    if (!/.*[a-z].*/.test(val)) errors.push("Must contain at least one lower case letter");
    if (!/.*[A-Z].*/.test(val)) errors.push("Must contain at least one upper case letter");
    if (!/.*\d.*/.test(val)) errors.push("Must contain at least one digit");
    if (!/.{8,}/.test(val)) errors.push("Must be at least 8 characters long");
  }

  function handleOldPasswordChange(e) {
    const val = e.target.value;
    setOldPassword(val);
    let errors = [];
    if (!val.trim()) errors.push("Current password is required");
    setIsOldPasswordError(errors.length !== 0);
    setOldPasswordErrors(errors);
  }

  function handleNewPasswordChange(e) {
    const val = e.target.value;
    setNewPassword(val);
    let errors = [];
    if (!val.trim()) errors.push("New password is required");
    else checkPasswordStrength(val, errors);
    setIsNewPasswordError(errors.length !== 0);
    setNewPasswordErrors(errors);
  }

  function handleConfirmPasswordChange(e) {
    const val = e.target.value;
    setConfirmPassword(val);
    let errors = [];
    if (!val.trim()) errors.push("Confirm password is required");
    else if (val !== newPassword) errors.push("Passwords do not match");
    setIsConfirmPasswordError(errors.length !== 0);
    setConfirmPasswordErrors(errors);
  }

  async function handleSubmitPassword(e) {
    if (e) e.preventDefault();

    let oErrors = [];
    let nErrors = [];
    let cErrors = [];

    if (!oldPassword) oErrors.push("Current password is required");
    if (!newPassword) nErrors.push("New password is required");
    else checkPasswordStrength(newPassword, nErrors);

    if (!confirmPassword) cErrors.push("Confirm password is required");
    else if (confirmPassword !== newPassword) cErrors.push("Passwords do not match");

    if (oErrors.length > 0 || nErrors.length > 0 || cErrors.length > 0) {
      setOldPasswordErrors(oErrors);
      setNewPasswordErrors(nErrors);
      setConfirmPasswordErrors(cErrors);
      setIsOldPasswordError(oErrors.length > 0);
      setIsNewPasswordError(nErrors.length > 0);
      setIsConfirmPasswordError(cErrors.length > 0);
      return;
    }

    setLoading(true);
    try {
      let headersList = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      let bodyContent = JSON.stringify({
        currentPassword: oldPassword,
        newPassword,
      });

      let response = await fetch("http://localhost:8000/student/update-password", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      if (data.success) {
        setSeverity("success");
        setToastMessage(data.message || "Password updated successfully");
        handleOpenToast();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setSeverity("error");
        setToastMessage(data.message || "Failed to update password");
        handleOpenToast();
      }
    } catch (err) {
      setSeverity("error");
      setToastMessage("Something went wrong");
      handleOpenToast();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* Page Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Student Account Settings
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
          Manage your student profile details and update account security credentials
        </Typography>
      </Box>

      {/* Styled Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          p: 0.8,
          mb: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px",
              background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              borderRadius: "10px",
              color: "#64748B",
              gap: 1,
              "&.Mui-selected": { color: "#0284C7" },
            },
          }}
        >
          <Tab icon={<PersonOutlineIcon fontSize="small" />} iconPosition="start" label="Personal Profile" />
          <Tab icon={<LockOutlinedIcon fontSize="small" />} iconPosition="start" label="Security & Password" />
        </Tabs>
      </Paper>

      {/* Profile Details Tab */}
      {tabValue === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: "20px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
            Student Profile
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
            Your student account credentials registered in the institution
          </Typography>

          <Info url="student" />
        </Paper>
      )}

      {/* Password Update Tab */}
      {tabValue === 1 && (
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: "20px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
            Update Security Password
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 3.5 }}>
            Ensure your student account is protected with a strong, secure password
          </Typography>

          <form onSubmit={handleSubmitPassword}>
            <Stack spacing={3} sx={{ maxWidth: 500 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
                  Current Password *
                </Typography>
                <TextField
                  fullWidth
                  type={showOld ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  error={isOldPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowOld(!showOld)} edge="end">
                          {showOld ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {oldPasswordErrors.map((err, i) => (
                  <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                    {err}
                  </Typography>
                ))}
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
                  New Password *
                </Typography>
                <TextField
                  fullWidth
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  error={isNewPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowNew(!showNew)} edge="end">
                          {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {newPasswordErrors.map((err, i) => (
                  <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                    {err}
                  </Typography>
                ))}
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.8 }}>
                  Confirm New Password *
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={isConfirmPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} edge="end">
                          {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {confirmPasswordErrors.map((err, i) => (
                  <Typography key={i} variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
                    {err}
                  </Typography>
                ))}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.3,
                  borderRadius: "12px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Save New Password"}
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      <Toastify
        open={openToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
      />
    </Box>
  );
}
