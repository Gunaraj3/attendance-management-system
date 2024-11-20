import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Toastify from "../../components/Toastify";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import { AiOutlineArrowLeft } from "react-icons/Ai";

const BatchAttendanceTeacher = () => {
  let [batchStudent, setBatchStudent] = useState([]);
  let [toastMessage, setToastMessage] = useState();
  let [severity, setSeverity] = useState();
  let [openToast, setOpenToast] = useState(false);

  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  let { batchId } = useParams();
  let user = useAuth();
  async function fetchBatchStudent() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch(
      "http://localhost:8000/attendance/studentList/" + batchId,
      {
        method: "GET",
        headers: headersList,
      }
    );

    let data = await response.json();
    console.log(data);
    let res = data.result.map((v) => {
      let a = {
        name: v.name,
        status: "P",
        studentId: v._id,
      };
      return a;
    });

    setBatchStudent(res);
  }

  async function register() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ data: batchStudent });
    let data;
    try {
      let response = await fetch(
        "http://localhost:8000/attendance/submit/" + batchId,
        {
          method: "post",
          headers: headersList,
          body: bodyContent,
        }
      );

      data = await response.json();
    } catch (e) {
      setOpenToast(true);
      setToastMessage("something went wrong");
      setSeverity("error");
      handleClose();
    }
    if (data.success) {
      setOpenToast(true);
      setToastMessage(data.message);
      setSeverity("success");
      handleClose();
    } else {
      setOpenToast(true);
      setToastMessage(data.message);
      setSeverity("error");
      handleClose();
    }

    console.log(data);
  }

  useEffect(() => {
    fetchBatchStudent();
  }, []);
  return (
    <div>
      <AiOutlineArrowLeft
        style={{ position: "relative", top: "48px" }}
        onClick={goBack}
      ></AiOutlineArrowLeft>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "15px",
          padding: "10px",
          textAlign: "center",
        }}
        color="primary"
      >
        {" "}
        Take Attendance
      </Typography>
      <TableContainer component={Paper} sx={{ padding: "10px" }} elevation={6}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {["name", new Date().toISOString().split("T")[0]].map((v, i) => {
                return <TableCell key={i}>{v}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {batchStudent?.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell
                  onClick={(e) => {
                    if (batchStudent[i].status === "A") {
                      batchStudent[i].status = "P";
                    } else if (batchStudent[i].status === "P") {
                      batchStudent[i].status = "L";
                    } else if (batchStudent[i].status === "L") {
                      batchStudent[i].status = "A";
                    }
                    console.log(batchStudent[i].status);

                    setBatchStudent([...batchStudent]);
                  }}
                >
                  <Button
                    sx={{
                      color:
                        batchStudent[i].status === "A"
                          ? "red"
                          : batchStudent[i].status === "P"
                          ? "primary"
                          : "orange",
                    }}
                  >
                    {row.status}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="outlined"
          startIcon={<SendIcon></SendIcon>}
          onClick={(e) => register()}
          sx={{ marginTop: "10px" }}
        >
          register
        </Button>
      </TableContainer>

      <Toastify
        handleOpen={handleOpenToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
        open={openToast}
      ></Toastify>
    </div>
  );
};

export default BatchAttendanceTeacher;
