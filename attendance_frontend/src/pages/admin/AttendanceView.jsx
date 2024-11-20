import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
// import Table from "../../components/Table";

const AttendanceView = () => {
  let [loading, setLoading] = useState(true);
  let [attendance, setAttendance] = useState([]);
  let user = useAuth();

  async function fetchAttendance() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch("http://localhost:8000/admin/attendance", {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    console.log(data);

    setAttendance(data.result);
    setLoading(false);
  }

  useEffect(() => {
    fetchAttendance();
  }, []);
  return (
    <div>
      {/* {loading && <p>loading.......</p>}

      {loading === false && <Table> </Table>} */}
      attendance View
    </div>
  );
};

export default AttendanceView;
