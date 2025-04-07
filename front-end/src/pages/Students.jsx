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
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

const Students = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await fetch("/api/students");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch students", { variant: "error" });
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
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
        ? `/api/students/${currentStudent._id}`
        : "/api/students";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStudent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      enqueueSnackbar(
        `Student ${isEdit ? "updated" : "created"} successfully`,
        {
          variant: "success",
          autoHideDuration: 3000,
        }
      );
      fetchStudents();
      handleClose();
    } catch (error) {
      enqueueSnackbar(
        `Failed to ${isEdit ? "update" : "create"} student: ${error.message}`,
        {
          variant: "error",
          autoHideDuration: 4000,
        }
      );
      console.error("Submission error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      enqueueSnackbar("Student deleted successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });
      fetchStudents();
    } catch (error) {
      enqueueSnackbar(`Failed to delete student: ${error.message}`, {
        variant: "error",
        autoHideDuration: 4000,
      });
      console.error("Deletion error:", error);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={80} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Student Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Student
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Points</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Level</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.points || 0}</TableCell>
                  <TableCell>{student.level || 1}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(student)}
                      color="primary"
                      aria-label="edit"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(student._id)}
                      color="error"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentStudent.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={currentStudent.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={currentStudent.password}
            onChange={handleChange}
            required={!isEdit}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={
              !currentStudent.name ||
              !currentStudent.email ||
              (!isEdit && !currentStudent.password)
            }
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
