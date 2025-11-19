import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- TEMP DATABASE --------------------
// TEMP in-memory data (simulates a database)
let tasks = [
  {
    id: 1,
    title: "Push-ups",          // keep title for existing UI
    name: "Push-ups",
    type: "strength",
    sets: 1,
    reps: 10,
    durationMin: 1,
    calories: 5,
    autoLoggedFrom: "Jupyter tracker",
    completed: false
  },
  {
    id: 2,
    title: "Bench",             // keep title for existing UI
    name: "Bench",
    type: "strength",
    sets: 3,
    reps: 10,
    durationMin: 1,
    calories: 15,
    autoLoggedFrom: "Jupyter tracker",
    completed: true
  }
];


// -------------------- ROUTES ---------------------

// Root route
app.get("/", (req, res) => {
  res.send("CoreSync API is running");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Create a task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: "Title is required" });

  const newTask = { id: Date.now(), title, completed: false };
  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Update a task
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);

  res.json({ message: "Task deleted" });
});

// -------------------- START SERVER ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
