import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const BatchViewTeacher = () => {
  let [batch, setBatch] = useState([]);
  let [noBatches, setNoBatches] = useState(0);

  let user = useAuth();
  const navigate = useNavigate();

  async function fetchBatch() {
    let headersList = {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token()}`,
    };

    let response = await fetch("http://localhost:8000/teacher/batch", {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    if (data.success) {
      setNoBatches(data.result.length);
    }
    console.log(data);

    setBatch(data.result);
  }

  useEffect(() => {
    fetchBatch();
  }, []);

  function handleBatchClick(e, id) {
    navigate(`/teacher/batch/${id}`);
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          {batch?.map((v, i) => {
            return (
              <Card
                key={i}
                elevation={6}
                sx={{
                  marginTop: "5px",
                  marginBottom: "10px",
                  padding: "20px",
                }}
              >
                <CardContent>
                  <Grid container>
                    <Grid
                      item
                      xs={8}
                      onClick={(e) => handleBatchClick(e, v._id)}
                      sx={{ marginBottom: "3px" }}
                    >
                      <Stack direction={"column"} flexWrap="wrap">
                        <Typography variant="h5">
                          Course:{v.course} <br></br>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Name of batch: {v.name}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
        <Grid item xs={4}>
          <Stack sx={{ marginTop: "7px" }}>
            <Card elevation={6}>
              <Stack direction={"column"}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total Batch
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {noBatches}
                  </Typography>
                </CardContent>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default BatchViewTeacher;
