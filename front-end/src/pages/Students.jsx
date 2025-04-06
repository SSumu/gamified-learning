// src/pages/Students.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleOpen = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setIsEdit(true);
    } else {
      setCurrentStudent({
        name: "",
        email: "",
        password: "",
      });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = isEdit
        ? `http://localhost:5000/api/students/${currentStudent._id}`
        : "http://localhost:5000/api/students";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStudent),
      });

      if (response.ok) {
        fetchStudents();
        handleClose();
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Student Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Student
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.points}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(student)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentStudent.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={currentStudent.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={currentStudent.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
