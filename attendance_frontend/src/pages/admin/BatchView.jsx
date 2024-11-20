import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Skeleton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalForm from "../../components/ModalForm";
import Toastify from "../../components/Toastify";
import { useAuth } from "../../context/auth";
import "../../css/linear-gradient.css";

const BatchView = () => {
  let [loader, setLoader] = useState(true);
  let [batch, setBatch] = useState([]);
  let [noBatches, setNoBatches] = useState(0);
  let [toastMessage, setToastMessage] = useState();
  let [severity, setSeverity] = useState();
  let [openToast, setOpenToast] = useState(false);
  let [course, setCourse] = useState("");
  let [name, setName] = useState("");
  let [courseErrors, setCourseErrors] = useState([]);
  let [nameErrors, setNameErrors] = useState([]);
  let [isCourseError, setIsCourseError] = useState(false);
  let [isNameError, setIsNameError] = useState(false);
  const [open, setOpen] = useState(false);
  let user = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  function required(event, errors) {
    if (event.target.value === "") {
      errors.push(`${event.target.name} is required`);
    }
  }
  const checks = {
    course: [required],
    name: [required],
  };

  async function handleChange(e) {
    if (e.target.name === "course") {
      handleCourseChange(e);
    } else if (e.target.name === "name") {
      handleNameChange(e);
    }
  }
  function handleNameChange(e) {
    setName(e.target.value);
    let errors = [];

    checks.name.forEach((v) => {
      v(e, errors);
      // if (v === "required") {
      //   if (e.target.value === "") {
      //     errors.push("password is required");
      //   }
      // }
    });
    if (errors.length === 0) {
      setIsNameError(false);
    } else {
      setIsNameError(true);
    }
    setNameErrors(errors);
  }

  function handleCourseChange(e) {
    setCourse(e.target.value);

    let errors = [];

    checks.course.forEach((v) => {
      v(e, errors);
      // if (v === "required") {
      //   if (e.target.value === "") {
      //     errors.push("email is required");
      //   }
      // }
    });
    if (errors.length !== 0) {
      setIsCourseError(true);
    } else {
      setIsCourseError(false);
    }
    setCourseErrors(errors);
  }

  async function handleSubmit() {
    if (course === "" || name === "") {
      if (course === "" && !courseErrors.includes("course is required")) {
        setIsCourseError(true);
        setCourseErrors([...courseErrors, "course is required"]);
      }
      if (name === "" && !nameErrors.includes("name is required")) {
        setIsNameError(true);
        setNameErrors([...nameErrors, "name is required"]);
      }
      return;
    }
    if (courseErrors.length !== 0 || nameErrors.length !== 0) {
      console.log("cannot call error is there");
      return;
    }
    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ name, course });
    let data;
    try {
      let response = await fetch("http://localhost:8000/admin/batch/", {
        method: "post",
        body: bodyContent,
        headers: headersList,
      });

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
    fetchBatch();
  }

  async function fetchBatch() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch("http://localhost:8000/admin/batch", {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    if (data.success) {
      setNoBatches(data.result.length);
    }
    console.log(data);

    setBatch(data.result);
    setLoader(false);
  }

  useEffect(() => {
    fetchBatch();
  }, []);

  function handleBatchClick(e, id) {
    navigate(`/admin/batch/${id}`);
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Button
            variant="outlined"
            sx={{ boxShadow: 6 }}
            startIcon={<AddIcon />}
            onClick={(e) => handleOpen(e)}
          >
            Add Batch{" "}
          </Button>
          {loader && (
            <Stack>
              <Skeleton
                variant="rectangular"
                sx={{ marginTop: "15px" }}
                width={"100%"}
                height={120}
              />
              <Skeleton
                variant="rectangular"
                sx={{ marginTop: "15px" }}
                width={"100%"}
                height={120}
              />
              <Skeleton
                variant="rectangular"
                sx={{ marginTop: "15px" }}
                width={"100%"}
                height={120}
              />
              <Skeleton
                variant="rectangular"
                sx={{ marginTop: "15px" }}
                width={"100%"}
                height={120}
              />
            </Stack>
          )}
          {batch?.map((v, i) => {
            return (
              <Card
                key={i}
                elevation={6}
                sx={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  padding: "20px",
                }}
              >
                <CardContent>
                  <Grid container>
                    <Grid
                      item
                      xs={8}
                      onClick={(e) => handleBatchClick(e, v._id)}
                      sx={{ marginBottom: "3px" }}
                    >
                      <Stack direction={"column"} flexWrap="wrap">
                        <Typography variant="h5">
                          Course:{v.course} <br></br>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Name of batch: {v.name}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction={"column"} flexWrap="wrap">
                        {/* <Button
                          variant="outlined"
                          color="success"
                          onClick={(e) => console.log(e, row._id)}
                          sx={{ marginRight: "6px", width: "fit-content" }}
                          startIcon={<EditIcon></EditIcon>}
                        ></Button> */}
                      </Stack>

                      {/* <Button
                        onClick={(e) => console.log(e, row._id)}
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon></DeleteIcon>}
                      >
                        
                      </Button> */}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
        <Grid item xs={4}>
          {loader && (
            <Skeleton
              variant="rectangular"
              sx={{ marginTop: "50px" }}
              width={"100%"}
              height={120}
            />
          )}
          {!loader && (
            <Stack sx={{ marginTop: "50px" }}>
              <Card elevation={6}>
                <Stack direction={"column"}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Total Batch
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {noBatches}
                    </Typography>
                  </CardContent>
                </Stack>
              </Card>
            </Stack>
          )}
        </Grid>
      </Grid>

      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <TextField
          error={isNameError ? true : false}
          style={{ marginTop: "20px" }}
          onChange={handleChange}
          value={name}
          id="standard-basic"
          label="name*"
          variant="standard"
          fullWidth={true}
          name="name"
        />
        {nameErrors.length !== 0 &&
          nameErrors.map((v, i) => {
            return (
              <div style={{ color: "red", marginTop: "5px" }} key={i}>
                {" "}
                {v}{" "}
              </div>
            );
          })}
        <TextField
          error={isCourseError ? true : false}
          style={{ marginTop: "20px" }}
          onChange={handleChange}
          value={course}
          id="standard-basic"
          label="course*"
          variant="standard"
          fullWidth={true}
          name="course"
        />
        {courseErrors.length !== 0 &&
          courseErrors.map((v, i) => {
            return (
              <div style={{ color: "red", marginTop: "5px" }} key={i}>
                {" "}
                {v}{" "}
              </div>
            );
          })}
      </ModalForm>

      <Toastify
        handleOpen={handleOpenToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
        open={openToast}
      ></Toastify>

      {/* <Stack sx={{ marginTop: "20px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Stack> */}
      {/* {batch.map((v, i) => {
        return (
          <Stack spacing={2} direction={"row"}>
            <Card>
              <Stack direction={"column"}>
                <CardContent className="blue-gradient">
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: "white" }}
                  >
                    {v.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "white" }}
                  >
                    {v.course}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack> */}
      {/* ); })} */}
    </div>
  );
};

export default BatchView;
