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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState({
    title: "",
    description: "",
    course: "",
    points: 0,
    dueDate: "",
    isActive: true,
    completionCriteria: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchChallenges();
    fetchCourses();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/challenges`
      );
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses`
      );
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpen = (challenge = null) => {
    if (challenge) {
      setCurrentChallenge({
        ...challenge,
        course: challenge.course._id || challenge.course,
      });
      setIsEdit(true);
    } else {
      setCurrentChallenge({
        title: "",
        description: "",
        course: "",
        points: 0,
        dueDate: "",
        isActive: true,
        completionCriteria: "",
      });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentChallenge((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = isEdit
        ? `${process.env.REACT_APP_API_BASE_URL}/api/challenges/${currentChallenge._id}`
        : `${process.env.REACT_APP_API_BASE_URL}/api/challenges`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentChallenge),
      });

      if (response.ok) {
        fetchChallenges();
        handleClose();
      }
    } catch (error) {
      console.error("Error saving challenge:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/challenges/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchChallenges();
      }
    } catch (error) {
      console.error("Error deleting challenge:", error);
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
          Challenge Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Challenge
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge._id}>
                <TableCell>{challenge.title}</TableCell>
                <TableCell>
                  {courses.find((c) => c._id === challenge.course)?.title ||
                    challenge.course?.title}
                </TableCell>
                <TableCell>{challenge.points}</TableCell>
                <TableCell>
                  {challenge.dueDate
                    ? new Date(challenge.dueDate).toLocaleDateString()
                    : "None"}
                </TableCell>
                <TableCell>{challenge.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(challenge)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(challenge._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEdit ? "Edit Challenge" : "Add New Challenge"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={currentChallenge.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={currentChallenge.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              name="course"
              value={currentChallenge.course}
              onChange={handleChange}
              variant="standard"
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="points"
            label="Points"
            type="number"
            fullWidth
            variant="standard"
            value={currentChallenge.points}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={currentChallenge.dueDate}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isActive"
                checked={currentChallenge.isActive}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Active Challenge"
          />
          <TextField
            margin="dense"
            name="completionCriteria"
            label="Completion Criteria"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={2}
            value={currentChallenge.completionCriteria}
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

export default Challenges;
