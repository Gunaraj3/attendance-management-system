import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
// import Table from "../../components/Table";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ModalForm from "./../../components/ModalForm";
import DisplayTable from "./../../components/DisplayTable";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Toastify from "./../../components/Toastify";
import { Card, CardContent, Grid, Stack } from "@mui/material";
import EditForm from "./../../components/EditForm";
import DeleteModel from "../../components/DeleteModel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TeacherView = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [name, setName] = useState("");
  let [loading, setLoading] = useState(true);
  let [teacher, setTeacher] = useState([]);
  let [isEmailError, setIsEmailError] = useState(false);
  let [isPasswordError, setIsPasswordError] = useState(false);
  let [isNameError, setIsNameError] = useState(false);
  let [emailErrors, setEmailErrors] = useState([]);
  let [passwordErrors, setPasswordErrors] = useState([]);
  let [nameErrors, setNameErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  let [toastMessage, setToastMessage] = useState();
  let [severity, setSeverity] = useState("error");
  let [noTeachers, setNoTeachers] = useState(0);
  let [edit, setEdit] = useState(false);
  let [editTeacherId, setEditTeacherId] = useState("");
  let [deleTeOpen, setDeleteOpen] = useState(false);
  let [deleteId, setDeleteId] = useState("");

  console.log(email, "email");
  console.log(name, "name");

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  let user = useAuth();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEmail("");
    setName("");
    setPassword("");
    setEmailErrors([]);
    setPasswordErrors([]);
    setNameErrors([]);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsNameError(false);
    setOpen(false);
  };
  console.log("edit valued:", edit);

  async function handleEditOpen(e, id) {
    await fetch("http://localhost:8000/admin/teacher/" + id, {
      headers: {
        Authorization: `Bearer ${user.token()}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setEmail(data.result.email);
        setName(data.result.name);
        setEditTeacherId(id);
        setEdit(true);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function handleEditClose(e) {
    setEmail("");
    setName("");
    setEmailErrors([]);
    setPasswordErrors([]);
    setNameErrors([]);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsNameError(false);
    setEdit(false);
    console.log("inside edit k", edit);
  }

  async function handleEditSubmit(e, id) {
    if (email === "" || name === "") {
      if (email === "" && !emailErrors.includes("email is required")) {
        setIsEmailError(true);
        setEmailErrors([...emailErrors, "email is required"]);
      }

      if (name === "" && !nameErrors.includes("name is required")) {
        setIsEmailError(true);
        setEmailErrors([...nameErrors, "name is required"]);
      }
      return;
    }
    if (emailErrors.length !== 0 || nameErrors.length !== 0) {
      console.log("cannot call error is there");
      return;
    }
    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ data: { name, email } });
    let data;
    try {
      let response = await fetch(
        "http://localhost:8000/admin/teacher/" + editTeacherId,
        {
          method: "put",
          body: bodyContent,
          headers: headersList,
        }
      );

      data = await response.json();
    } catch (e) {
      setOpenToast(true);
      setToastMessage("something went wrong");
      setSeverity("error");
      handleClose();
      handleEditClose();
    }

    console.log("data......", data);
    if (data.success) {
      setSeverity("success");
      setToastMessage(data.message);
      handleOpenToast();
      handleEditClose();
    } else {
      setOpenToast(true);
      setToastMessage(data.message);
      setSeverity("error");
      handleEditClose();
    }
    fetchTeacher();
    console.log("edit submit");
  }

  async function handleDeleteOpen(e, id) {
    setDeleteId(id);
    setDeleteOpen(true);
    console.log("handleClose");
  }
  async function handleDeleteClose(e, id) {
    setDeleteOpen(false);
    console.log("handleClose");
  }

  async function handleDeleteSubmit(e, id) {
    let data;
    try {
      let response = await fetch(
        "http://localhost:8000/admin/teacher/" + deleteId,
        {
          method: "delete",

          headers: {
            Authorization: `Bearer ${user.token()}`,
          },
        }
      );

      data = await response.json();
    } catch (e) {
      setOpenToast(true);
      setToastMessage("something went wrong");
      setSeverity("error");
      handleClose();
      handleEditClose();
    }

    console.log("data......", data);
    if (data.success) {
      setSeverity("success");
      setToastMessage(data.message);
      handleOpenToast();
      handleDeleteClose();

      fetchTeacher();
    } else {
      setOpenToast(true);
      setToastMessage(data.message);
      setSeverity("error");
      handleDeleteClose();
    }
  }

  async function fetchTeacher() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch("http://localhost:8000/admin/teacher", {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    if (data.success) {
      setNoTeachers(data.result.length);
      setTeacher(data.result);
    }
    console.log(data);
  }

  useEffect(() => {
    fetchTeacher();
  }, []);

  function required(event, errors) {
    if (event.target.value === "") {
      errors.push(`${event.target.name} is required`);
    }
  }

  function checkEmailFormat(event, errors) {
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        event.target.value
      )
    ) {
      errors.push(`Invalid Email`);
    }
  }

  function checkPasswordStrength(event, errors) {
    if (!/.*[a-z].*/.test(event.target.value)) {
      errors.push(`must contain at least one lower case letter`);
    }
    if (!/.*[A-Z].*/.test(event.target.value)) {
      errors.push(`must contain at least one upper case letter`);
    }
    if (!/.*\d.*/.test(event.target.value)) {
      errors.push(`mush contain one digit`);
    }
    if (!/.{8,}/.test(event.target.value)) {
      errors.push(`must be at least 8 character long`);
    }
  }

  const checks = {
    email: [required, checkEmailFormat],
    password: [required, checkPasswordStrength],
    name: [required],
  };

  async function handleChange(e) {
    if (e.target.name === "email") {
      handleEmailChange(e);
    } else if (e.target.name === "password") {
      handlePasswordChange(e);
    } else if (e.target.name === "name") {
      handleNameChange(e);
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
    let errors = [];

    checks.name.forEach((v) => {
      v(e, errors);
    });
    if (errors.length === 0) {
      setIsNameError(false);
    } else {
      setIsNameError(true);
    }
    setNameErrors(errors);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    let errors = [];

    checks.password.forEach((v) => {
      v(e, errors);
    });
    if (errors.length === 0) {
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
    }
    setPasswordErrors(errors);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);

    let errors = [];

    checks.email.forEach((v) => {
      v(e, errors);
    });
    if (errors.length !== 0) {
      setIsEmailError(true);
    } else {
      setIsEmailError(false);
    }
    setEmailErrors(errors);
  }

  async function handleSubmit() {
    if (email === "" || password === "" || name === "") {
      console.log(emailErrors);
      if (email === "" && !emailErrors.includes("email is required")) {
        setIsEmailError(true);
        setEmailErrors([...emailErrors, "email is required"]);
      }
      if (password === "" && !passwordErrors.includes("password is required")) {
        setIsPasswordError(true);
        setPasswordErrors([...passwordErrors, "password is required"]);
      }
      if (name === "" && !nameErrors.includes("name is required")) {
        setIsNameError(true);
        setNameErrors([...nameErrors, "name is required"]);
      }
      return;
    }
    if (
      emailErrors.length !== 0 ||
      passwordErrors.length !== 0 ||
      nameErrors.length !== 0
    ) {
      console.log("cannot call error is there");
      return;
    }
    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let bodyContent = JSON.stringify({ name, email, password });
    let data;
    try {
      let response = await fetch("http://localhost:8000/admin/teacher", {
        method: "POST",
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

    console.log("data......", data);
    if (data.success) {
      setSeverity("success");
      setToastMessage(data.message);
      handleOpenToast();
      handleClose();
    } else {
      setOpenToast(true);
      setToastMessage(data.message);
      setSeverity("error");
      handleClose();
    }
    fetchTeacher();
  }

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={9}>
          {" "}
          <Button
            onClick={handleOpen}
            variant="outlined"
            startIcon={<AddIcon></AddIcon>}
            sx={{ marginBottom: "10px", boxShadow: 6 }}
          >
            add teacher
          </Button>
          <DisplayTable
            columns={["name", "email", "action"]}
            rows={teacher}
            elevation={6}
            handleEditOpen={handleEditOpen}
            handleDeleteOpen={handleDeleteOpen}
          ></DisplayTable>
        </Grid>
        <Grid item xs={3}>
          <Stack sx={{ marginTop: "50px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total teachers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {noTeachers}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <DeleteModel
        open={deleTeOpen}
        handleDeleteClose={handleDeleteClose}
        handleDeleteSubmit={handleDeleteSubmit}
      ></DeleteModel>

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
          error={isEmailError ? true : false}
          style={{ marginTop: "20px" }}
          onChange={handleChange}
          value={email}
          id="standard-basic"
          label="email*"
          variant="standard"
          fullWidth={true}
          name="email"
        />
        {emailErrors.length !== 0 &&
          emailErrors.map((v, i) => {
            return (
              <div style={{ color: "red", marginTop: "5px" }} key={i}>
                {" "}
                {v}{" "}
              </div>
            );
          })}
        <TextField
          error={isPasswordError ? true : false}
          onChange={handleChange}
          value={password}
          type="password"
          id="standard-basic"
          label="password*"
          variant="standard"
          fullWidth
          name="password"
          style={{ marginTop: "20px" }}
        />
        {passwordErrors.length !== 0 &&
          passwordErrors.map((v, i) => {
            return (
              <div style={{ color: "red", marginTop: "5px" }} key={i}>
                {" "}
                {v}{" "}
              </div>
            );
          })}
      </ModalForm>

      <EditForm
        open={edit}
        handleClose={handleEditClose}
        handleSubmit={handleEditSubmit}
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
          value={email}
          error={isEmailError ? true : false}
          style={{ marginTop: "20px" }}
          onChange={handleChange}
          id="standard-basic"
          label="email*"
          variant="standard"
          fullWidth={true}
          name="email"
        />
        {emailErrors.length !== 0 &&
          emailErrors.map((v, i) => {
            return (
              <div style={{ color: "red", marginTop: "5px" }} key={i}>
                {" "}
                {v}{" "}
              </div>
            );
          })}
      </EditForm>

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

export default TeacherView;
