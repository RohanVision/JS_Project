const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static("public")); // To use static files

const tasksFilePath = path.join(__dirname, "tasks.json");

// Read all tasks
app.get("/tasks", (req, res) => {
    fs.readFile(tasksFilePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading tasks");
            return;
        }
        try {
            const tasks = JSON.parse(data);
            res.json(tasks);
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send("Error parsing tasks");
        }
    });
});

// Read a single task
// app.get("/task/:id", (req, res) => {
//     fs.readFile(tasksFilePath, "utf8", (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Error reading tasks");
//             return;
//         }
//         try {
//             const task = JSON.parse(data);
//             res.json(task);
//         } catch (parseErr) {
//             console.error(parseErr);
//             res.status(500).send("Error parsing tasks");
//         }
//     });
// });

// Create a new task
app.post("/task", (req, res) => {
    const data = JSON.stringify(req.body);
    fs.writeFile(tasksFilePath, data, "utf-8", (err, data) => {
        if (err) {
            console.log("err", err);
            res.status(500).send("Error creating new task");
            return;
        }
        try {
            res.json(JSON.stringify(req.body));
        } catch (parseErr) {
            console.log(parseErr);
            res.status(500).send("Error creating new task");
        }
    });
});

// Update a task
app.put("/task", (req, res) => {
    const data = JSON.stringify(req.body);
    fs.writeFile(tasksFilePath, data, "utf-8", (err, data) => {
        if (err) {
            console.log("err", err);
            res.status(500).send("Error editing the task");
            return;
        }
        try {
            res.json(JSON.stringify(req.body));
        } catch (parseErr) {
            console.log(parseErr);
            res.status(500).send("Error editing the task");
        }
    });
});

// Delete Task
app.delete("/task/:id", (req, res) => {});

app.listen(4000, (req, res) => {
    console.log("application is running on port 4000");
});
