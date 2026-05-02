// Todo Management API using In-Memory Database

const express = require('express');
const app = express();
app.use(express.json());

// In-memory database (array to store todos)
let todos = [];
let todoIdCounter = 1;

// Validation helper functions
function validateTitle(title) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return false;
  }
  return true;
}

function validatePriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return !priority || validPriorities.includes(priority);
}

// Generate unique ID
function generateId() {
  return todoIdCounter++;
}

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  try {
    const { title, completed, priority } = req.body;

    // Validate required field
    if (!validateTitle(title)) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    // Validate priority if provided
    if (!validatePriority(priority)) {
      return res.status(400).json({ 
        error: 'Priority must be one of: low, medium, high' 
      });
    }

    const newTodo = {
      id: generateId(),
      title: title.trim(),
      completed: completed !== undefined ? completed : false,
      priority: priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
  try {
    const sortedTodos = [...todos].sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(sortedTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /todos/completed - Get all completed todos (MUST be before /:id route)
app.get('/todos/completed', (req, res) => {
  try {
    const completedTodos = todos.filter(todo => todo.completed).sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(completedTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /todos/:id - Get a specific todo
app.get('/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /todos/:id - Update a todo
app.put('/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, priority } = req.body;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Validate title if provided
    if (title !== undefined && !validateTitle(title)) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Validate priority if provided
    if (!validatePriority(priority)) {
      return res.status(400).json({ 
        error: 'Priority must be one of: low, medium, high' 
      });
    }

    // Update only provided fields
    if (title !== undefined) todo.title = title.trim();
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    todo.updatedAt = new Date();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.status(200).json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;