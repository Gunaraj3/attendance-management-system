import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useAuth } from "../../context/auth";
import { IoIosLogOut } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { MdOutlineClass } from "react-icons/md";
import { BsListCheck } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { RiTeamLine } from "react-icons/ri";
import { GoGear } from "react-icons/go";
import { Tooltip } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Navigate } from "react-router-dom";

const drawerWidth = 150;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  console.log("inside admin layout")
  const navigate = useNavigate()
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const user = useAuth();
  const role = user.role() ? user.role() : "student"
  console.log("role",role)
  if(role !== "admin"){
     let path 
     if( role === "student"){
      path = "/student/batch"
     }else if( role === "teacher"){
      path = "/teacher/batch"
     }
     return  <Navigate to={path} replace={true} />
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    user.logout({ url: "admin" });
  };

  console.log("end adminlayout")

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#9c27b0" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            Attendance System
          </Typography>

          <Button color="inherit" onClick={logout}>
            <IoIosLogOut size={20} />
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            height: "100vh",
          },
        }}
      >
        <List
          sx={{
            marginTop: "60px",
            height: "100%",
            backgroundColor: "#9c27b0",
          }}
        >
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <ListItem disablePadding sx={{ display: "block" }}>
                <NavLink
                  to="list"
                  style={({ isActive }) => ({
                    color: "white",
                    backgroundColor: isActive ? "#af52bf" : "",
                    display: "block",
                    textDecoration: "none",
                  })}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    {open && (
                      <Stack direction="row">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <AdminPanelSettingsIcon
                            size={25}
                            color={"white"}
                            sx={{ color: "white" }}
                          ></AdminPanelSettingsIcon>
                        </ListItemIcon>
                        <span>Admins</span>
                      </Stack>
                    )}
                    {!open && (
                      <Stack direction="column">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "14px",
                          }}
                        >
                          <AdminPanelSettingsIcon
                            size={25}
                            color="white"
                            sx={{ color: "white" }}
                          ></AdminPanelSettingsIcon>
                        </ListItemIcon>
                        <span>Admins</span>
                      </Stack>

                      // <Tooltip title="Admins" arrow>
                      //   <ListItemIcon
                      //     sx={{
                      //       minWidth: 0,
                      //       mr: open ? 3 : "auto",
                      //       justifyContent: "center",
                      //       fontWeight: "bold",
                      //     }}
                      //   >
                      //     <MdOutlineClass size={25} color="white"></MdOutlineClass>
                      //   </ListItemIcon>
                      // </Tooltip>
                    )}
                  </ListItemButton>
                </NavLink>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <NavLink
                  to="batch"
                  style={({ isActive }) => ({
                    color: "white",
                    backgroundColor: isActive ? "#af52bf" : "",
                    display: "block",
                    textDecoration: "none",
                  })}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    {open && (
                      <Stack direction="row">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <MdOutlineClass
                            size={25}
                            color="white"
                          ></MdOutlineClass>
                        </ListItemIcon>
                        <span>Batches</span>
                      </Stack>
                    )}
                    {!open && (
                      <Stack direction="column">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "14px",
                          }}
                        >
                          <MdOutlineClass
                            size={25}
                            color="white"
                          ></MdOutlineClass>
                        </ListItemIcon>
                        <span>Batches</span>
                      </Stack>

                      // <Tooltip title="Admins" arrow>
                      //   <ListItemIcon
                      //     sx={{
                      //       minWidth: 0,
                      //       mr: open ? 3 : "auto",
                      //       justifyContent: "center",
                      //       fontWeight: "bold",
                      //     }}
                      //   >
                      //     <MdOutlineClass size={25} color="white"></MdOutlineClass>
                      //   </ListItemIcon>
                      // </Tooltip>
                    )}
                  </ListItemButton>
                </NavLink>
              </ListItem>
              {/* <ListItem disablePadding sx={{ display: "block" }}>
            <NavLink
              to="admin"
              style={({ isActive }) => ({
                color: "white",
                backgroundColor: isActive ? "#af52bf" : "",
                display: "block",
                textDecoration: "none",
              })}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                {open && (
                  <Stack direction="row">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <RiAdminLine size={25} color="white"></RiAdminLine>
                    </ListItemIcon>
                    <span style={{ color: "white" }}>Admins</span>
                  </Stack>
                )}
                {!open && (
                  <Tooltip title="Admins" arrow>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <RiAdminLine size={25} color="white"></RiAdminLine>
                    </ListItemIcon>
                  </Tooltip>
                )}
              </ListItemButton>
            </NavLink>
          </ListItem> */}
              <ListItem disablePadding sx={{ display: "block" }}>
                <NavLink
                  to="teacher"
                  style={({ isActive }) => ({
                    color: "white",
                    backgroundColor: isActive ? "#af52bf" : "",
                    display: "block",
                    textDecoration: "none",
                  })}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    {open && (
                      <Stack direction="row">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <RiTeamLine size={25} color="white"></RiTeamLine>
                        </ListItemIcon>
                        <span>Teachers</span>
                      </Stack>
                    )}
                    {!open && (
                      <Stack direction="column">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "14px",
                          }}
                        >
                          <RiTeamLine size={25} color="white"></RiTeamLine>
                        </ListItemIcon>
                        <span>Teachers</span>
                      </Stack>
                    )}
                  </ListItemButton>
                </NavLink>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block" }}>
                <NavLink
                  to="student"
                  style={({ isActive }) => ({
                    color: "white",
                    backgroundColor: isActive ? "#af52bf" : "",
                    display: "block",
                    textDecoration: "none",
                  })}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    {open && (
                      <Stack direction="row">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <PiStudent size={25} color="white"></PiStudent>
                        </ListItemIcon>
                        <span>Students</span>
                      </Stack>
                    )}
                    {!open && (
                      <Stack direction="column">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "14px",
                          }}
                        >
                          <PiStudent size={25} color="white"></PiStudent>
                        </ListItemIcon>
                        <span>Students</span>
                      </Stack>
                    )}
                  </ListItemButton>
                </NavLink>
              </ListItem>
            </div>

            {/* jslfsj */}
            <div>
              <ListItem disablePadding sx={{ display: "block" }}>
                <NavLink
                  to="setting"
                  style={({ isActive }) => ({
                    color: "white",
                    backgroundColor: isActive ? "#af52bf" : "",
                    display: "block",
                    textDecoration: "none",
                  })}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      marginTop: open ? "480px" : "280px",
                    }}
                  >
                    {open && (
                      <Stack direction="row">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <GoGear size={25} color="white"></GoGear>
                          {/* <PiStudent size={25} color="white"></PiStudent> */}
                        </ListItemIcon>
                        <span>Setting</span>
                      </Stack>
                    )}
                    {!open && (
                      <Stack direction="column">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "14px",
                          }}
                        >
                          <GoGear size={25} color="white"></GoGear>
                        </ListItemIcon>
                        <span>Setting</span>
                      </Stack>
                    )}
                  </ListItemButton>
                </NavLink>
              </ListItem>
            </div>
          </Stack>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "50px" }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
