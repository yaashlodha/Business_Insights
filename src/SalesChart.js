import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Paper, Typography } from "@mui/material";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/fetch-data")
      .then(response => {
        const data = response.data;

        // Group data by product and sum revenue
        const productRevenue = {};
        data.forEach(row => {
          if (!productRevenue[row.product]) {
            productRevenue[row.product] = 0;
          }
          productRevenue[row.product] += row.revenue;
        });

        // Prepare data for the chart
        const labels = Object.keys(productRevenue);
        const revenueData = Object.values(productRevenue);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Total Revenue",
              data: revenueData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      })
      .catch(error => console.error("Error fetching chart data:", error));
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        📊 Revenue by Product
      </Typography>
      {chartData ? <Bar data={chartData} /> : <Typography>Loading chart...</Typography>}
    </Paper>
  );
};

export default SalesChart;
