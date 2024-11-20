import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TeacherBatch from "./TeacherBatch";
import StudentBatch from "./StudentBatch";
import BatchAttendance from "./BatchAttendance";
import { useState } from "react";
import PreviousAttendanceAll from "./PreviousAttendanceAll";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/Ai";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function StudentTeacherBatch() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <AiOutlineArrowLeft
          style={{ position: "relative", top: "34px" }}
          onClick={goBack}
        ></AiOutlineArrowLeft>
        <Tabs value={value} onChange={handleChange} sx={{ marginLeft: "25px" }}>
          <Tab label="Teacher" />
          <Tab label="Student" />
          <Tab label="Today Attendance" />
          <Tab label="Previous Attendance" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TeacherBatch></TeacherBatch>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudentBatch></StudentBatch>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BatchAttendance></BatchAttendance>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PreviousAttendanceAll></PreviousAttendanceAll>
      </TabPanel>
    </Box>
  );
}
