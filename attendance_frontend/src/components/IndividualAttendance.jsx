import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import CloseIcon from "@mui/icons-material/Close";

const IndividualAttendance = ({ email, handleClose, isOpen }) => {
  let [presentDays, setPresentDays] = useState(0);
  let [absentDays, setAbsentDays] = useState(0);
  let [leaveDays, setLeaveDays] = useState(0);
  let [columns, setColumns] = useState([]);
  let [studentRep, setStudentRep] = useState([]);
  let [data, setData] = useState([]);
  let [totalDays, setTotalDays] = useState("");

  let { batchId } = useParams();

  const user = useAuth();

  async function fetchStudentsReport() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    console.log(batchId, email);
    let response = await fetch(
      "http://localhost:8000/attendance/" + batchId + "/" + email,
      {
        method: "GET",
        headers: headersList,
      }
    );

    let data = await response.json();
    console.log(data, "insdie get previous student");

    setData(data.result);

    let dates = new Set();

    let nm = new Set();
    let presentDays = 0;
    let leaveDays = 0;
    let absentDays = 0;

    data.result.forEach((v, id) => {
      dates.add(v.date);
      if (v.studentId) {
        nm.add(v.studentId._id + "-" + v.studentId.name);
      }

      if (v.status === "A") {
        absentDays += 1;
        console.log(absentDays, "1", "look", v.status);
      } else if (v.status === "P") {
        console.log(presentDays, "0,", "look", v.status);
        presentDays += 1;
      } else if (v.status === "L") {
        leaveDays += 1;
        console.log(leaveDays, "2", "look", v.status);
      }
    });
    let unique = [...dates];
    console.log(leaveDays, absentDays, presentDays);
    setPresentDays(presentDays);
    setAbsentDays(absentDays);
    setLeaveDays(leaveDays);
    setTotalDays(unique.length);

    setColumns(unique);

    setStudentRep([...nm]);
  }

  const getAttendanceStatus = (id, date) => {
    const attendanceRecord = data.find((item) => {
      if (item.studentId) {
        return item.studentId._id === id && item.date === date;
      }

      return false;
    });

    if (!attendanceRecord) {
      return "N";
    }

    // if (attendanceRecord.status === 1) {
    //   absentDays += 1;
    // } else if (attendanceRecord.status === 2) {
    //   leaveDays += 1;
    // }

    return attendanceRecord.status;
  };

  useEffect(() => {
    fetchStudentsReport();
  }, []);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ backgroundColor: "#9c27b0" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={5} marginTop={0} marginBottom={5}>
        <Grid item xs={3}>
          <Stack sx={{ marginTop: "50px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalDays}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack sx={{ marginTop: "50px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total Absent Days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {absentDays}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack sx={{ marginTop: "50px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total Present Days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {presentDays}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack sx={{ marginTop: "50px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total Leave Days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {leaveDays}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ padding: "10px" }} elevation={6}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>name of student</TableCell>

              {columns.map((v, i) => {
                return <TableCell key={i}>{v.split("T")[0]}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {studentRep?.map((name, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {name.split("-")[1]}
                </TableCell>

                {columns.map((v, i) => {
                  return (
                    <TableCell component="th" scope="row">
                      {`${getAttendanceStatus(name.split("-")[0], v)}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default IndividualAttendance;
