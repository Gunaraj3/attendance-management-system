import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { useParams } from "react-router-dom";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Toastify from "./Toastify";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const PreviousAttendanceAll = () => {
  let [batchReport, setBatchReport] = useState([]);
  let [toastMessage, setToastMessage] = useState();
  let [severity, setSeverity] = useState();
  let [openToast, setOpenToast] = useState(false);
  let [dat, setDat] = useState();
  let [columns, setColumns] = useState([]);
  let [studentRep, setStudentRep] = useState([]);
  let [data, setData] = useState([]);
  let [inputYear, setInputYear] = useState([
    new Date().toISOString().split("-")[0],
  ]);
  let [valueYear, setValueYear] = useState([
    new Date().toISOString().split("-")[0],
  ]);
  let [inputMonth, setInputMonth] = useState([
    new Date().toISOString().split("-")[1],
  ]);
  let [valueMonth, setValueMonth] = useState([
    new Date().toISOString().split("-")[1],
  ]);

  const [inputValue, setInputValue] = React.useState(
    new Date().toISOString().split("-")[1]
  );

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  let { batchId } = useParams();
  let user = useAuth();

  async function fetchStudentsReport() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch(
      "http://localhost:8000/attendance/" +
        batchId +
        "/" +
        inputYear +
        "/" +
        inputMonth,
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
    console.log("data.........", data);

    data.result.forEach((v, id) => {
      if (v.studentId) {
        nm.add(v.studentId._id + "-" + v.studentId.name);
        dates.add(v.date);
      }
    });

    let unique = [...dates];
    console.log("nm........", [...nm]);
    console.log("un........", unique);

    let studentsd = {};
    let columns = new Set();
    let names = new Set();
    let res = data.result.map((v) => {
      // let a = {
      //   name: v.name,
      //   status: "P",
      //   studentId: v._id,
      // };
      columns.add(v.date.split("T")[0]);

      if (v.studentId) {
        names.add(v.studentId.name);
        if (studentsd[v.studentId.name]) {
          studentsd[v.studentId.name].push(
            v.status 
          );
        } else {
          studentsd[v.studentId.name] = [
            v.status 
          ];
        }
      }

      // return a;
    });

    console.log(studentsd, "studentsd.................");
    console.log(Object.entries(studentsd), "studentsd.................");
    // console.log(...columns, "date coluns........");

    setColumns(unique);

    // setBatchReport([...names]);
    setStudentRep([...nm]);

    // setBatchReport(studentsd);
  }

  //   async function register() {
  //     let headersList = {
  //       "Content-type": "application/json",
  //       Authorization: `Bearer ${user.token()}`,
  //     };

  //     let bodyContent = JSON.stringify({ data: batchStudent });
  //     let data;
  //     try {
  //       let response = await fetch("http://localhost:8000/attendance/submit/", {
  //         method: "post",
  //         headers: headersList,
  //         body: bodyContent,
  //       });

  //       data = await response.json();
  //     } catch (e) {
  //       setOpenToast(true);
  //       setToastMessage("something went wrong");
  //       setSeverity("error");
  //       handleClose();
  //     }
  //     if (data.success) {
  //       setOpenToast(true);
  //       setToastMessage(data.message);
  //       setSeverity("success");
  //       handleClose();
  //     } else {
  //       setOpenToast(true);
  //       setToastMessage(data.message);
  //       setSeverity("error");
  //       handleClose();
  //     }

  //     console.log(data, "previous attendance");
  //   }

  const getAttendanceStatus = (id, date) => {
    console.log(data, "data......................");
    const attendanceRecord = data.find((item) => {
      if (item.studentId) {
        return item.studentId._id === id && item.date === date;
      }

      return false;
    });

    // if (attendanceRecord) {
    //   return attendanceRecord.isPresent ? 'Present' : 'Absent';
    // }

    console.log("attendanceRecord ................", attendanceRecord);

    if (!attendanceRecord) {
      return "N";
    }

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

  const yrs = function () {
    let dates = [];

    let start = 2010;
    let end = parseInt(new Date().toISOString().split("-")[0]);

    for (let i = start; i <= end; i++) {
      dates.push(i.toString());
    }

    return dates;
  };

  console.log("inputYear.....", inputYear);
  console.log("inputMonth.....", inputMonth);

  const mon = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const yr = yrs();

  async function download() {
    let headersList = {
      Authorization: `Bearer ${user.token()}`,
      "Content-type": "text/csv",
    };

    let response = await fetch(
      "http://localhost:8000/attendance/export/" +
        batchId +
        "/" +
        inputYear +
        "/" +
        inputMonth,
      {
        method: "GET",
        headers: headersList,
      }
    );

    console.log(response, "response csv.............");
    let blob = await response.blob();
    console.log(data, "data is important ...........");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link);
  }
  return (
    <div>
      <Stack direction={"row"} spacing={9} sx={{ marginBottom: "15px" }}>
        <Autocomplete
          inputValue={inputYear}
          onInputChange={(event, newInputYear) => {
            setInputYear(newInputYear);
          }}
          id="controllable-states-demo"
          options={yr}
          value={valueYear}
          onChange={(e, nv) => {
            setValueYear(nv);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Year" />}
        />
        <Autocomplete
          inputValue={inputMonth}
          onInputChange={(event, newInputValue) => {
            setInputMonth(newInputValue);
          }}
          id="controllable-states-demo"
          options={mon}
          value={valueMonth}
          onChange={(event, newValue) => {
            setValueMonth(newValue);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Month" />}
          // <Button onClick={()=>fetchStudentsReport()}>fetch</Button>
        />

        <Button
          startIcon={<SendIcon />}
          variant="outlined"
          onClick={() => {
            fetchStudentsReport();
          }}
        >
          fetch{" "}
        </Button>
        <IconButton
          aria-label="download"
          onClick={(e) => {
            download();
          }}
        >
          <DownloadIcon color="primary" />
        </IconButton>
      </Stack>

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
            {/* {batchReport?.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell
                  onClick={(e) => {
                    if (batchReport[i].status === "A") {
                      batchReport[i].status = "P";
                    } else if (batchReport[i].status === "P") {
                      batchReport[i].status = "L";
                    } else if (batchReport[i].status === "L") {
                      batchReport[i].status = "A";
                    }
                    console.log(batchReport[i].status);

                    setBatchStudent([...batchReport]);
                  }}
                >
                  <Button
                    sx={{
                      color:
                        batchReport[i].status === "A"
                          ? "red"
                          : batchReport[i].status === "P"
                          ? "primary"
                          : "orange",
                    }}
                  >
                    {row.status}
                  </Button>
                </TableCell>
              </TableRow>
            ))} */}
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

                {/* <TableCell
                  onClick={(e) => {
                    if (batchReport[i].status === "A") {
                      batchReport[i].status = "P";
                    } else if (batchReport[i].status === "P") {
                      batchReport[i].status = "L";
                    } else if (batchReport[i].status === "L") {
                      batchReport[i].status = "A";
                    }
                    console.log(batchReport[i].status);

                    setBatchStudent([...batchReport]);
                  }}
                >
                  <Button
                    sx={{
                      color:
                        batchReport[i].status === "A"
                          ? "red"
                          : batchReport[i].status === "P"
                          ? "primary"
                          : "orange",
                    }}
                  >
                    {row.status}
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <Button
          variant="outlined"
          startIcon={<SendIcon></SendIcon>}
          onClick={(e) => register()}
          sx={{ marginTop: "10px" }}
        >
          register
        </Button> */}
      </TableContainer>

      {/* <Toastify
        handleOpen={handleOpenToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
        open={openToast}
      ></Toastify> */}
    </div>
  );
};

export default PreviousAttendanceAll;

{
  /* cle
         </Dialog>
*/
}
// let [attendance, setAttendance] = React.useState([]);
// let { batchId } = useParams();
// const user = useAuth();
// async function fetchBatchStudent() {
//   let headersList = {
//     "Content-type": "application/json",
//     Authorization: `Bearer ${user.token()}`,
//   };

//   console.log(batchId, email);
//   let response = await fetch(
//     "http://localhost:8000/attendance/" + batchId + "/" + email,
//     {
//       method: "GET",
//       headers: headersList,
//     }
//   );

//   let data = await response.json();
//   console.log("data..............", data);

//   setAttendance(data.result);

//     }
// }

// React.useEffect(() => {
//   fetchBatchStudent();
// }, []);
