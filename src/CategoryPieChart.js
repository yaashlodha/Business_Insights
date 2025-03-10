import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Paper, Typography } from "@mui/material";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/fetch-data")
      .then(response => {
        const data = response.data;

        // Group data by category and sum revenue
        const categoryRevenue = {};
        data.forEach(row => {
          if (!categoryRevenue[row.category]) {
            categoryRevenue[row.category] = 0;
          }
          categoryRevenue[row.category] += row.revenue;
        });

        // Prepare data for the chart
        const labels = Object.keys(categoryRevenue);
        const revenueData = Object.values(categoryRevenue);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Total Revenue by Category",
              data: revenueData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error("Error fetching chart data:", error));
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        📊 Revenue by Category
      </Typography>
      {chartData ? <Pie data={chartData} /> : <Typography>Loading chart...</Typography>}
    </Paper>
  );
};

export default CategoryPieChart;
