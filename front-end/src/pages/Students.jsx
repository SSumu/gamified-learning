import React, { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  Avatar,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Verified as VerifiedIcon,
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
    points: 0,
    level: 1,
    avatar: "",
    isVerified: false,
    isActive: true,
  });
  const [isEdit, setIsEdit] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
        }/api/students`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      enqueueSnackbar(`Failed to fetch students: ${error.message}`, {
        variant: "error",
        autoHideDuration: 4000,
      });
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpen = (student = null) => {
    if (student) {
      setCurrentStudent({
        ...student,
        password: "", // Never pre-fill password
      });
      setIsEdit(true);
    } else {
      setCurrentStudent({
        name: "",
        email: "",
        password: "",
        points: 0,
        level: 1,
        avatar: "",
        isVerified: false,
        isActive: true,
      });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = isEdit
        ? `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
          }/api/students/${currentStudent._id}`
        : `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
          }/api/students`;

      // For updates, exclude password if empty
      const payload =
        isEdit && !currentStudent.password
          ? {
              name: currentStudent.name,
              email: currentStudent.email,
              points: currentStudent.points,
              level: currentStudent.level,
              avatar: currentStudent.avatar,
              isVerified: currentStudent.isVerified,
              isActive: currentStudent.isActive,
            }
          : currentStudent;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

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
        error.message || `Failed to ${isEdit ? "update" : "create"} student`,
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
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
        }/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      enqueueSnackbar("Student deleted successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to delete student", {
        variant: "error",
        autoHideDuration: 4000,
      });
      console.error("Deletion error:", error);
    }
  };

  if (loading) {
    return (
      <Container
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Student Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ minWidth: 150 }}
        >
          Add Student
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Avatar
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Points
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Level
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>
                    <Avatar
                      src={student.avatar}
                      alt={student.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {student.name}
                      {student.isVerified && (
                        <Tooltip title="Verified">
                          <VerifiedIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.points}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.isActive ? "Active" : "Inactive"}
                      color={student.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpen(student)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(student._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {isEdit ? "Edit Student" : "Create New Student"}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <TextField
            margin="normal"
            name="name"
            label="Full Name"
            fullWidth
            value={currentStudent.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={currentStudent.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            name="password"
            label={
              isEdit ? "New Password (leave blank to keep current)" : "Password"
            }
            type="password"
            fullWidth
            value={currentStudent.password}
            onChange={handleChange}
            required={!isEdit}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            name="avatar"
            label="Avatar URL"
            fullWidth
            value={currentStudent.avatar}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="points"
              label="Points"
              type="number"
              fullWidth
              value={currentStudent.points}
              onChange={handleChange}
            />
            <TextField
              name="level"
              label="Level"
              type="number"
              fullWidth
              value={currentStudent.level}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isVerified"
                  checked={currentStudent.isVerified}
                  onChange={handleChange}
                />
              }
              label="Verified"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={currentStudent.isActive}
                  onChange={handleChange}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
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
