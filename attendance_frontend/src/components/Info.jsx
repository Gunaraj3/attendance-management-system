import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";

const Info = ({ url = "admin" }) => {
  let [data, setData] = useState([]);
  const user = useAuth();
  console.log("info ..................................................")

  async function fetchStudentsReport() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch(`http://localhost:8000/${url}/info`, {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    console.log(data, "...............insdie get previous student.........");

    setData(data.result);
  }

  function fetchAdmin() {
    fetchStudentsReport();
  }

  useEffect(fetchAdmin, []);
  console.log("url", url);
  return (
    <div>
      {url === "admin" && (
        <table style={{ width: "100%" }}>
          <tr>
            <td>email</td>
            <td>{data.email}</td>
          </tr>
        </table>
      )}

      {url === "teacher" && (
        <table style={{ width: "100%" }}>
          <tr>
            <td>name</td>
            <td>{data.name}</td>
          </tr>
          <tr>
            <td>email</td>
            <td>{data.email}</td>
          </tr>
        </table>
      )}
      {url == "student" && (
        <table style={{ width: "100%" }}>
          <tr>
            <td>name</td>
            <td>{data.name}</td>
          </tr>
          <tr>
            <td>email</td>
            <td>{data.email}</td>
          </tr>
        </table>
      )}
    </div>
  );
};

export default Info;
