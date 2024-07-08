const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors())

let tasks = [];
let nextTaskId = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const {title, description} = req.body;
    if (!title || !description) {
        res.status(400).json({error: 'Title and description are required'});
        return;
    }
    const now = new Date();
    const task = {id: nextTaskId, title, description, createdAt: now.getMilliseconds()};
    tasks.push(task);
    nextTaskId++;
    res.json(task);
});

app.patch('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        res.status(404).json({error: 'Task not found'});
        return;
    }
    const {title, description} = req.body;
    if (!title && !description) {
        res.status(400).json({error: 'At least one field is required'});
        return;
    }
    const task = tasks[index];
    const now = new Date();
    Object.assign(task, title ? {title} : {}, description ? {description} : {}, {updatedAt: now.getMilliseconds()}) ;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        res.status(404).json({error: 'Task not found'});
        return;
    }
    tasks.splice(index, 1);
    res.json({success: true});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
