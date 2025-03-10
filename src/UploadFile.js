import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Paper } from "@mui/material";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message + " Rows Uploaded: " + response.data.rows_uploaded);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading file.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        📂 Upload CSV File
      </Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginLeft: 2 }}>
        Upload
      </Button>
      {message && <Typography sx={{ marginTop: 2, color: "green" }}>{message}</Typography>}
    </Paper>
  );
};

export default UploadFile;
