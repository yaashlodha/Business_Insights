import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Typography, Paper } from "@mui/material";
import UploadFile from "./UploadFile";
import SalesChart from "./SalesChart";
import CategoryPieChart from "./CategoryPieChart";
import Analytics from "./Analytics";

function App() {
  const [data, setData] = useState([]);

  // Fetch data from Flask
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/fetch-data")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Business Insights Dashboard
      </Typography>

      {/* File Upload Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <UploadFile />
      </Paper>

      <Grid container spacing={3}>
        {/* Analytics Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Analytics />
          </Paper>
        </Grid>

        {/* Sales Chart Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <SalesChart />
          </Paper>
        </Grid>

        {/* Category Pie Chart Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CategoryPieChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
