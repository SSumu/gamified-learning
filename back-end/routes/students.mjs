import express from "express";
import {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  addBadge,
} from "../controllers/studentController.mjs";

const router = express.Router();

// CRUD operations
router.get("/", getAllStudents);
router.post("/", createStudent);
router.get("/:id", getStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

// Additional operations
router.post("/:id/badges", addBadge);

export default router;
