import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/Ai";
import IndividualAttendance from "./IndividualAttendance";

export default function BatchTable({
  columns,
  rows,
  handleUnassign,
  elevation = 0,
  student,
}) {
  const [attendance, setAttendance] = useState(false);
  const handleClose = () => setAttendance(false);

  let [email, setEmail] = useState("");

  function handleViewAttendance(e, email) {
    setEmail(email);
    setAttendance(true);
  }

  return (
    <TableContainer
      component={Paper}
      elevation={elevation}
      sx={{ padding: "10px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((v, i) => {
              return <TableCell key={i}>{v}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length !== 0 &&
            rows.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell>{row.email}</TableCell>
                <TableCell>
                  {student && (
                    <Button
                      onClick={(e) => handleViewAttendance(e, row.email)}
                      variant="outlined"
                      color="primary"
                      startIcon={<AiOutlineEye></AiOutlineEye>}
                      sx={{ marginRight: "5px" }}
                    >
                      attendance
                    </Button>
                  )}

                  <Button
                    onClick={(e) => handleUnassign(e, row._id)}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon></DeleteIcon>}
                  >
                    unassign
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell>no data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {attendance && (
        <IndividualAttendance
          isOpen={attendance}
          handleClose={handleClose}
          email={email}
        ></IndividualAttendance>
      )}
    </TableContainer>
  );
}
