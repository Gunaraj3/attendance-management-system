import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import ModalForm from "./../../components/ModalForm";
import DisplayTable from "../../components/DisplayTable";
import Typography from "@mui/material/Typography";

const BatchLayout = ({ handleOpen }) => {
  return (
    <div>
      <Paper elevation={10}>
        <Button onClick={(e) => handleOpen()}>Assign</Button>
        <Typography variant="h5" gutterBottom>
          {" "}
          Batch Teacher
        </Typography>
        <DisplayTable
          columns={["name", "email", "action"]}
          rows={batchTeacher}
        ></DisplayTable>
      </Paper>
      <Paper elevation={10} sx={{ marginTop: "20px" }}>
        <Button onClick={(e) => handleOpen()}>Add Student</Button>
        <Typography variant="h5" gutterBottom>
          {" "}
          Batch Teacher
        </Typography>
        <DisplayTable
          columns={["name", "email", "action"]}
          rows={batchTeacher}
        ></DisplayTable>
      </Paper>
      <ModalForm
        open={open}
        handleClose={handleClose}
        handleSubmit={assignTeacher}
      >
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          fullWidth={true}
        >
          <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={teacher}
            onChange={handleChange}
            label="Assign Teacher"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {teachers?.map((v, i) => {
              return (
                <MenuItem value={v._id}>
                  {v.name} - {v.email}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </ModalForm>
    </div>
  );
};

export default BatchLayout;
