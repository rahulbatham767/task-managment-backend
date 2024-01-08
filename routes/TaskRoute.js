const { body, validationResult } = require("express-validator");
const express = require("express");
const Task = require("../Model/Task");
const router = express.Router();

const showTask = async (req, res) => {
  try {
    const { id } = req.user.user;
    const task = await Task.find({ adminId: id });

    if (!task) {
      return res.status(404).json("The task with the given ID was not found.");
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTask = async (req, res) => {
  // console.log(req.body);

  const { id, admin } = req.user.user;

  const { name, description, TaskManager, status } = req.body;
  // console.log(id);

  try {
    const task = new Task({
      name: name,
      description: description,
      adminId: id,
      TaskManager: TaskManager,
    });

    const savedTask = await task.save();
    // console.log(savedTask);

    res.json({ success: "success", msg: "Task Added Successfully" });
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
};

const updateTask = async (req, res) => {
  const { _id, taskName, taskDescription, taskManager, taskStatus } = req.body;

  try {
    let updated = Task.findById(_id);
    if (!updated) {
      return res.status(404).json("The task with the given ID was not found.");
    }
    // Use findByIdAndUpdate to directly update the document in the database
    updated = await Task.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: taskName || updated.name,
          description: taskDescription || updated.description,
          Status: taskStatus || updated.Status,
          TaskManager: taskManager || updated.TaskManager,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json("The task with the given ID was not found.");
    }

    // console.log(updated);
    res.json("Task Updated Successfully");
  } catch (error) {
    res.status(500).send(`Error updating task: ${error.message}`);
  }
};

const deleteTask = async (req, res) => {
  try {
    // console.log(req.params);

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json("The task with the given ID was not found.");
    }
    res.send("Task Successfully Deleted");
  } catch (error) {
    res.status(500).send(`Error deleting task: ${error.message}`);
  }
};

router.get("/show-task", showTask);

router.post("/add-task", addTask);
router.put("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);

module.exports = router;
