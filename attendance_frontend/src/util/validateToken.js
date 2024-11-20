import React from "react";

const validateToken = async (token) => {
  const response = await fetch("http://localhost:8000/login/authenticate", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

export default validateToken;
