import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  completedChallenges: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  ],
  lastActive: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
