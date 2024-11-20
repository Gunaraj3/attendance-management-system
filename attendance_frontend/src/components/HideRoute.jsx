import React from "react";
import { useAuth } from "../context/auth";
import { Navigate, Outlet } from "react-router-dom";

const validateToken = async (token = "") => {
  let bodyContent = JSON.stringify({
    token,
  });
  let headersList = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  let response = await fetch("http://localhost:8000/verifyToken", {
    headers: headersList,
  });
  console.log(response);
  let ans = await response.json();
  console.log(ans.success);
  return ans.success;
};

const HideRoute = ({ redirect, children }) => {
  const user = useAuth();
  const token = user.token();
  const role =user.role ? user.role : "student"
  let path 
  if(role === "admin"){
    path = "/admin/list"
  }else if(role === "teacher"){
    path="/teacher/batch"
  }
  else if(role === "student"){
    path="/student/batch"
  }
  console.log(token, "token");
  let isTokenValid;
  if (token) {
    isTokenValid = validateToken(user.token());
    console.log(isTokenValid, "isTokenValid inside if");
  } else {
    isTokenValid = false;
    console.log("inside else");
  }
  if (isTokenValid) {
    return <Navigate to={path} replace={true}></Navigate>;
  }

  return children;
};

export default HideRoute;
