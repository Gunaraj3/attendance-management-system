import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import banner from "../assets/banner.png";
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";





export default function Home() {
  const navigate = useNavigate()
  function handleClick(ans){
    
    navigate(`/${ans}/login`)
    console.log("handleclick")
}

  return (
    <Box >
      
      <img
        style={{ marginBottom: "0px" ,height:"100vh",width:"100%"}}
        src={banner}
        
        alt="image"
      />
      <Stack direction={"row"} justifyContent={"space-around"} sx={{position:"absolute",top:"70px",width:"100%"}} spacing={4}>
    <Button variant="contained" color="success" sx={{color:"white",border:"red",fontSize:"20px"}} onClick={()=>{handleClick("admin")}}> Login as 
    Admin</Button>
    <Button variant="contained" color="success"  onClick={()=>{handleClick("teacher")}} sx={{color:"white",fontSize:"20px"}}> Login as Teacher</Button>
    <Button variant="contained" color="success"  onClick={()=>{handleClick("student")}}sx={{color:"white",fontSize:"20px"}}> Login as Student</Button>
  
    </Stack>
 
    </Box>
  );
}
