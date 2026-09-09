import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TeacherBatch from "./TeacherBatch";
import StudentBatch from "./StudentBatch";
import BatchAttendance from "./BatchAttendance";
import PreviousAttendanceAll from "./PreviousAttendanceAll";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`batch-tabpanel-${index}`}
      aria-labelledby={`batch-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3.5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function StudentTeacherBatch() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { batchId } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      {/* Top Breadcrumb & Back Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Tooltip title="Back to Batches" arrow>
          <IconButton
            onClick={goBack}
            sx={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              "&:hover": { backgroundColor: "#F1F5F9" },
            }}
          >
            <ArrowBackRoundedIcon sx={{ color: "#0F172A" }} />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Batch Studio & Management
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
            Batch ID: {batchId}
          </Typography>
        </Box>
      </Box>

      {/* Styled Tabs Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          p: 0.8,
          boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 48,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px",
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              minHeight: 48,
              borderRadius: "10px",
              color: "#64748B",
              gap: 1,
              "&.Mui-selected": {
                color: "#4F46E5",
              },
            },
          }}
        >
          <Tab icon={<PeopleAltRoundedIcon fontSize="small" />} iconPosition="start" label="Assigned Teachers" />
          <Tab icon={<SchoolRoundedIcon fontSize="small" />} iconPosition="start" label="Enrolled Students" />
          <Tab icon={<TodayRoundedIcon fontSize="small" />} iconPosition="start" label="Take Today's Attendance" />
          <Tab icon={<HistoryRoundedIcon fontSize="small" />} iconPosition="start" label="Historical Matrix & Export" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={value} index={0}>
        <TeacherBatch />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudentBatch />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BatchAttendance />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PreviousAttendanceAll />
      </TabPanel>
    </Box>
  );
}
