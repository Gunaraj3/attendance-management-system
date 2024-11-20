import React from "react";
import { useAuth } from "../context/auth";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const validateToken = async (token) => {
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

  return ans.success;
};

const ProtectedRoute = ({ redirect,children}) => {
  console.log("inside protected route")
  const user = useAuth();

  const token = user.token();
  let role = user.role() ? user.role() : "admin"
  let isTokenValid;
  if (token) {
    isTokenValid = validateToken(user.token());
    console.log(isTokenValid, "isTokenValid");
  } else {
    isTokenValid = false;
    console.log("inside else");
  }

  if (isTokenValid) {
    console.log("outlet");
    return <Outlet></Outlet>;
  }

  return <Navigate to={redirect}></Navigate>;

  // if (user.token()) {
  //   console.log(children);
  //   return <Outlet></Outlet>;
  // }

  // return <Navigate to="/admin" replace={true}></Navigate>;
};

export default ProtectedRoute;
