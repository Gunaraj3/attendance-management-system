import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Info from "./../../components/Info";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useAuth } from "../../context/auth";
import Toastify from "../../components/Toastify";

export default function SettingAdmin() {
  const user = useAuth();
  let [oldPassword, setOldPassword] = React.useState("");
  let [oldPasswordErrors, setOldPasswordErrors] = React.useState("");
  let [isOldPasswordError, setIsOldPasswordError] = React.useState(false);
  let [newPassword, setNewPassword] = React.useState("");
  let [newPasswordErrors, setNewPasswordErrors] = React.useState("");
  let [isNewPasswordError, setIsNewPasswordError] = React.useState(false);
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [confirmPasswordErrors, setConfirmPasswordErrors] = React.useState("");
  let [isConfirmPasswordError, setIsConfirmPasswordError] =
    React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  let [toastMessage, setToastMessage] = React.useState();
  let [severity, setSeverity] = React.useState();
  let [openToast, setOpenToast] = React.useState(false);

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [subExpand, setSubExpanded] = React.useState(false);

  const handleSubExpandChange = (panel) => (event, isExpanded) => {
    console.log(isExpanded, "..........");
    setSubExpanded(isExpanded ? panel : false);
  };

  function ChangePassword() {
    handleSubmit();
    async function handleSubmit() {
      if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
        if (
          oldPassword === "" &&
          !oldPasswordErrors.includes("oldPassword is required")
        ) {
          setIsOldPasswordError(true);
          setOldPasswordErrors([
            ...oldPasswordErrors,
            "oldPassword is required",
          ]);
        }
        if (
          confirmPassword === "" &&
          !confirmPasswordErrors.includes("confirmPassword is required")
        ) {
          setIsConfirmPasswordError(true);
          setConfirmPasswordErrors([
            ...confirmPasswordErrors,
            "confirmPassword is required",
          ]);
        }
        if (
          newPassword === "" &&
          !newPasswordErrors.includes("newPassword is required")
        ) {
          setIsNewPasswordError(true);
          setNewPasswordErrors([
            ...setNewPasswordErrors,
            "newPassword is required",
          ]);
        }
        return;
      }
      if (
        newPasswordErrors.length !== 0 ||
        oldPasswordErrors.length !== 0 ||
        confirmPasswordErrors.length !== 0
      ) {
        console.log("cannot call error is there");
        return;
      }

      let headersList = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token()}`,
      };

      if (confirmPassword !== newPassword) {
        console.log("password did not match");
        return;
      }

      let bodyContent = JSON.stringify({
        currentPassword: oldPassword,
        newPassword,
      });

      let data;
      try {
        let response = await fetch(
          "http://localhost:8000/admin/update-password",
          {
            method: "POST",
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
      }

      console.log(data);

      if (data.success) {
        console.log(data.result.length);

        setOpenToast(true);
        setToastMessage(data.message);
        setSeverity("success");
      } else {
        setOpenToast(true);
        setToastMessage(data.message);
        setSeverity("error");
      }
    }
  }

  function required(event, errors) {
    if (event.target.value === "") {
      errors.push(`${event.target.name} is required`);
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
    confirmPassword: [required, checkPasswordStrength],
    oldPassword: [required, checkPasswordStrength],
    newPassword: [required, checkPasswordStrength],
  };

  function handleOldPasswordChange(e) {
    setOldPassword(e.target.value);
    let errors = [];

    checks.oldPassword.forEach((v) => {
      v(e, errors);
    });
    if (errors.length === 0) {
      setIsOldPasswordError(false);
    } else {
      setIsOldPasswordError(true);
    }
    setOldPasswordErrors(errors);
  }
  function handleNewPasswordChange(e) {
    setNewPassword(e.target.value);
    let errors = [];

    checks.newPassword.forEach((v) => {
      v(e, errors);
    });
    if (errors.length === 0) {
      setIsNewPasswordError(false);
    } else {
      setIsNewPasswordError(true);
    }
    setNewPasswordErrors(errors);
  }
  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
    let errors = [];

    checks.confirmPassword.forEach((v) => {
      v(e, errors);
    });
    if (errors.length === 0) {
      setIsConfirmPasswordError(false);
    } else {
      setIsConfirmPasswordError(true);
    }
    setConfirmPasswordErrors(errors);
  }

  async function handleChangePassword(e) {
    if (e.target.name === "oldPassword") {
      handleOldPasswordChange(e);
    } else if (e.target.name === "password") {
      handleNewPasswordChange(e);
    } else {
      handleConfirmPasswordChange(e);
    }
  }
  console.log("newPassword", newPassword);
  console.log("confirmPassword", confirmPassword);

  return (
    <div>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Personal data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Info></Info>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            General settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion
            expanded={subExpand === "subPanel1"}
            onChange={handleSubExpandChange("subPanel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Change Password
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={"column"}>
                <Stack
                  direction={"row"}
                  spacing={5}
                  justifyContent={"space-between"}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      position: "relative",
                      top: "10px",
                    }}
                  >
                    old password
                  </div>
                  <TextField
                    type="password"
                    error={isOldPasswordError ? true : false}
                    label="old password"
                    sx={{
                      width: "70%",
                    }}
                    onChange={(e) => {
                      handleOldPasswordChange(e);
                    }}
                    name="oldPassword"
                    value={oldPassword}
                  />
                </Stack>
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: 0,
                    minWidth: "70%",
                  }}
                >
                  {oldPasswordErrors.length !== 0 &&
                    oldPasswordErrors.map((v, i) => {
                      return (
                        <p
                          style={{
                            color: "red",
                            marginTop: "5px",
                            width: "70%",
                            textAlign: "left",
                          }}
                          key={i}
                        >
                          {" "}
                          {v}{" "}
                        </p>
                      );
                    })}
                </div>
              </Stack>
              <Stack direction={"column"} marginTop={2}>
                <Stack
                  direction={"row"}
                  spacing={5}
                  justifyContent={"space-between"}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      position: "relative",
                      top: "10px",
                    }}
                  >
                    new password
                  </div>
                  <TextField
                    error={isNewPasswordError ? true : false}
                    label="new password"
                    sx={{
                      width: "70%",
                    }}
                    onChange={(e) => {
                      handleNewPasswordChange(e);
                    }}
                    name="newPassword"
                    value={newPassword}
                    type="password"
                  />
                </Stack>
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: 0,
                    minWidth: "70%",
                  }}
                >
                  {newPasswordErrors.length !== 0 &&
                    newPasswordErrors.map((v, i) => {
                      return (
                        <p
                          style={{
                            color: "red",
                            marginTop: "5px",
                            width: "70%",
                            textAlign: "left",
                          }}
                          key={i}
                        >
                          {" "}
                          {v}{" "}
                        </p>
                      );
                    })}
                </div>
              </Stack>
              <Stack direction={"column"} marginTop={2}>
                <Stack
                  direction={"row"}
                  spacing={5}
                  justifyContent={"space-between"}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      position: "relative",
                      top: "10px",
                    }}
                  >
                    confirm password
                  </div>
                  <TextField
                    error={isConfirmPasswordError ? true : false}
                    label="confirm password"
                    type="password"
                    sx={{
                      width: "70%",
                    }}
                    onChange={(e) => {
                      handleConfirmPasswordChange(e);
                    }}
                    name="confirmPassword"
                    value={confirmPassword}
                  />
                </Stack>
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: 0,
                    minWidth: "70%",
                  }}
                >
                  {confirmPasswordErrors.length !== 0 &&
                    confirmPasswordErrors.map((v, i) => {
                      return (
                        <p
                          style={{
                            color: "red",
                            marginTop: "5px",
                            width: "70%",
                            textAlign: "left",
                          }}
                          key={i}
                        >
                          {" "}
                          {v}{" "}
                        </p>
                      );
                    })}
                </div>
              </Stack>

              <div style={{ textAlign: "right", marginTop: "7px" }}>
                <Button variant="outlined" onClick={ChangePassword}>
                  Change
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      <Toastify
        handleOpen={handleOpenToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        severity={severity}
        open={openToast}
      ></Toastify>
    </div>
  );
}
