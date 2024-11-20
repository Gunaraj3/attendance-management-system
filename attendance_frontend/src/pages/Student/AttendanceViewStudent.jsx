import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
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

import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import { AiOutlineArrowLeft } from "react-icons/Ai";
import Divider from "@mui/material/Divider";

const AttendanceViewStudent = ({ email, handleClose, isOpen }) => {
  let [presentDays, setPresentDays] = useState(0);
  let [absentDays, setAbsentDays] = useState(0);
  let [leaveDays, setLeaveDays] = useState(0);
  let [columns, setColumns] = useState([]);
  let [studentRep, setStudentRep] = useState([]);
  let [data, setData] = useState([]);
  let [totalDays, setTotalDays] = useState("");

  let navigate = useNavigate();

  let { batchId } = useParams();

  const user = useAuth();

  const goBack = () => {
    navigate(-1);
  };

  async function fetchStudentsReport() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let emailData = await fetch(`http://localhost:8000/student/info`, {
      method: "GET",
      headers: headersList,
    });

    let emailResponse = await emailData.json();

    let email = emailResponse.result.email;

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

      if (v.status === "A" || v.status === "a") {
        absentDays += 1;
        console.log(absentDays, "1", "look", v.status);
      } else if (v.status === "P" || v.status === "p") {
        console.log(presentDays, "0,", "look", v.status);
        presentDays += 1;
      } else if (v.status === "L" || v.status === "l") {
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

  async function downloadCSv() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };
    let emailData = await fetch(`http://localhost:8000/student/info`, {
      method: "GET",
      headers: headersList,
    });

    let emailResponse = await emailData.json();

    let email = emailResponse.result.email;

    let headerCsv = {
      "Content-type": "text/csv",
      Authorization: `Bearer ${user.token()}`,
    };
    let response;
    try {
      response = await fetch(
        "http://localhost:8000/attendance/export/" + batchId + "/" + email,
        {
          method: "GET",
          headers: headerCsv,
        }
      );
      console.log(response, "response................");
    } catch (e) {
      console.log("error", e);
    }

    let blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "student.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    return attendanceRecord.status 
    // === 0
    //   ? "P"
    //   : attendanceRecord.status === 1
    //   ? "A"
    //   : attendanceRecord.status === 2
    //   ? "L"
    //   : "N";
  };

  useEffect(() => {
    fetchStudentsReport();
  }, []);

  return (
    <>
      {" "}
      <AiOutlineArrowLeft
        // style={{ position: "relative", top: "34px" }}

        style={{ fontSize: "20px", marginBottom: "3px" }}
        onClick={goBack}
      ></AiOutlineArrowLeft>
      <Divider sx={{ background: "black" }}></Divider>
      <Grid container spacing={2} marginBottom={1} marginTop={3}>
        <Grid item xs={3}>
          <Stack>
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
          <Stack>
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
          <Stack>
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
          <Stack>
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
      <Grid container spacing={2} marginTop={0} marginBottom={5}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ padding: "20px", marginRight: "10px" }}
            elevation={6}
          >
            <Paper
              elevation={0}
              sx={{ padding: "10px", borderBottom: "1px solid black" }}
            >
              action{" "}
              <Button
                sx={{ marginLeft: "20px" }}
                variant="outlined"
                startIcon={<DownloadIcon></DownloadIcon>}
                onClick={(e) => {
                  downloadCSv();
                }}
              ></Button>
            </Paper>
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
        </Grid>
      </Grid>
    </>
  );
};

export default AttendanceViewStudent;
