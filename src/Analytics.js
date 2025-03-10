import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button, Grid } from "@mui/material";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAnalytics = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    axios.get(`http://127.0.0.1:5000/analytics?start_date=${startDate}&end_date=${endDate}`)
      .then(response => {
        if (response.data.error) {
          setError(response.data.error);
          setAnalytics(null);
        } else {
          setAnalytics(response.data);
          setError(null);
        }
      })
      .catch(error => {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data.");
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        📊 Sales Insights
      </Typography>

      {/* Date Filters */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={fetchAnalytics}>
            Apply
          </Button>
        </Grid>
      </Grid>

      {/* Display Analytics */}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {analytics && (
        <div style={{ marginTop: "20px" }}>
          <Typography><strong>Total Revenue:</strong> ${analytics.total_revenue.toLocaleString()}</Typography>
          <Typography><strong>Total Profit:</strong> ${analytics.total_profit.toLocaleString()}</Typography>
          <Typography><strong>Best-Selling Product:</strong> {analytics.top_product}</Typography>
          <Typography><strong>Best-Selling Category:</strong> {analytics.top_category}</Typography>
          <Typography><strong>Best Day:</strong> {analytics.best_day}</Typography>
          <Typography><strong>Worst Day:</strong> {analytics.worst_day}</Typography>
          <Typography><strong>Highest Profit Margin Product:</strong> {analytics.highest_profit_margin_product}</Typography>
          <Typography><strong>Lowest Profit Margin Product:</strong> {analytics.lowest_profit_margin_product}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default Analytics;
