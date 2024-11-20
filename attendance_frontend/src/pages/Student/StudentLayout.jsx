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
import { NavLink, Navigate, Outlet } from "react-router-dom";
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
import { Tooltip } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { GoGear } from "react-icons/go";

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

export default function StudentLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const user = useAuth();

  const role = user.role() ? user.role() : "student"
  console.log("role",role)
  if(role !== "student"){
     let path 
     if( role === "admin"){
      path = "/admin/list"
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
    user.logout({ url: "student" });
  };

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
      <Drawer variant="permanent" open={open}>
        <List
          sx={{
            marginTop: "60px",
            height: "100%",
            backgroundColor: "#9c27b0",
          }}
        >
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
                      <MdOutlineClass size={25} color="white"></MdOutlineClass>
                    </ListItemIcon>
                    <span
                      style={{ position: "relative", top: "5px", left: "-5px" }}
                    >
                      Batches
                    </span>
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
                      <MdOutlineClass size={25} color="white"></MdOutlineClass>
                    </ListItemIcon>
                    <span>Batches</span>
                  </Stack>
                )}
              </ListItemButton>
            </NavLink>
          </ListItem>

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
                  marginTop: open ? "600px" : "530px",
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
                    <span
                      style={{ position: "relative", top: "5px", left: "-5px" }}
                    >
                      Setting
                    </span>
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
                    <span
                      style={{
                        position: "relative",
                        left: "4px",
                        bottom: "6px",
                      }}
                    >
                      Setting
                    </span>
                  </Stack>
                )}
              </ListItemButton>
            </NavLink>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "50px" }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
