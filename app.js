const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public')); // To use static files

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Read all tasks
app.get('/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error reading tasks');
          return;
      }
      try {
          const tasks = JSON.parse(data);
          res.json(tasks);
      } catch (parseErr) {
          console.error(parseErr);
          res.status(500).send('Error parsing tasks');
      }
  });
});
// Read a single task
  // app.get('/task/:id', (req, res) => {

  // });  


  // Create a new task
// app.post('/tasks', (req, res) => {

//   });


  // Update a task
// app.put('/tasks/:id', (req, res) => {

//   });

// Delete Task
app.delete('/tasks/:id', (req, res) => {

  });


app.listen(4000, (req, res) => {
    // console.log("application is running on port 4000");
    // console.log("Welcome to Express");
});