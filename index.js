const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://priyapathak:<Betu123456789>@cluster0.qmjze5z.mongodb.net/tasksdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  priority: String,
  status: String,
});

const Task = mongoose.model("Task", taskSchema);

app.use(cors());
app.use(express.json());

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({ message: "Task added successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Error adding task", error: err });
  }
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ message: "Tasks fetched successfully!", tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});