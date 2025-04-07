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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState({
    name: "",
    description: "",
    icon: "",
    pointsRequired: 0,
    rarity: "common",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/rewards`
      );
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const handleOpen = (reward = null) => {
    if (reward) {
      setCurrentReward(reward);
      setIsEdit(true);
    } else {
      setCurrentReward({
        name: "",
        description: "",
        icon: "",
        pointsRequired: 0,
        rarity: "common",
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
    setCurrentReward((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = isEdit
        ? `${process.env.REACT_APP_API_BASE_URL}/api/rewards/${currentReward._id}`
        : `${process.env.REACT_APP_API_BASE_URL}/api/rewards`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentReward),
      });

      if (response.ok) {
        fetchRewards();
        handleClose();
      }
    } catch (error) {
      console.error("Error saving reward:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/rewards/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchRewards();
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
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
          Reward Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Reward
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Points Required</TableCell>
              <TableCell>Rarity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward._id}>
                <TableCell>{reward.name}</TableCell>
                <TableCell>{reward.description.substring(0, 50)}...</TableCell>
                <TableCell>{reward.pointsRequired}</TableCell>
                <TableCell>{reward.rarity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(reward)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(reward._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Reward" : "Add New Reward"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentReward.name}
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
            value={currentReward.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="icon"
            label="Icon URL"
            type="text"
            fullWidth
            variant="standard"
            value={currentReward.icon}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="pointsRequired"
            label="Points Required"
            type="number"
            fullWidth
            variant="standard"
            value={currentReward.pointsRequired}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="rarity-label">Rarity</InputLabel>
            <Select
              labelId="rarity-label"
              name="rarity"
              value={currentReward.rarity}
              onChange={handleChange}
              variant="standard"
            >
              <MenuItem value="common">Common</MenuItem>
              <MenuItem value="rare">Rare</MenuItem>
              <MenuItem value="epic">Epic</MenuItem>
              <MenuItem value="legendary">Legendary</MenuItem>
            </Select>
          </FormControl>
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

export default Rewards;
