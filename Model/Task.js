const mongoose = require("mongoose");

const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: { type: String },
  description: { type: String },
  TaskManager: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  Status: { type: String, default: "pending" },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
