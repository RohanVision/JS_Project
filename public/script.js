"use strict";

$(document).ready(() => {
    const namePattern = /^[A-Za-z ]+$/;

    // Get references to various DOM elements by their ID's.
    const taskDisplayTable = document.getElementById("task-display-table");
    const addTaskButton = document.getElementById("addTask");
    const searchFilter = document.getElementById("searchFilter");

    // project 2 functions start
    // Retrieve tasks from task.json.
    const tasks = [];
    const fetchAllTasks = async () => {
        try {
            const data = await fetch("/tasks");
            const tasksData = await data.json();
            tasksData.forEach((task) => {
                tasks.push(task);
            });
            // Initial render of tasks when the page loads.
            renderTasks();
        } catch (error) {
            console.error("Error:", error);
        }
    };
    fetchAllTasks();

    // To track the task being edited.
    let editIndex = null;

    // Fetch one task
    const taskId = "1"; // sample task id
    const fetchOneTask = async (taskId) => {
        try {
            const data = await fetch(`/task/${taskId}`);
            const json = await data.json();
        } catch (error) {
            console.error("Error fetch all tasks:", error);
        }
    };
    // fetchOneTask(taskId);

    // Add new task
    const addNewTask = async () => {
        const data = JSON.stringify(tasks);
        try {
            const res = await fetch("/task", {
                method: "POST",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: data,
            });
            const content = await res.json();
        } catch (error) {
            console.log("Error adding task:", error);
        }
    };

    // Edit a task
    const editCurrTask = async () => {
        const data = JSON.stringify(tasks);
        try {
            const res = await fetch("/task", {
                method: "PUT",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: data,
            });
            const content = await res.json();
        } catch (error) {
            console.log("Error adding task:", error);
        }
    };

    // project 2 functions End

    // Function to save tasks to local storage.
    function saveTasks(editOrNew) {
        // localStorage.setItem("tasks", JSON.stringify(tasks));
        editOrNew === "new" ? addNewTask() : editCurrTask();
        // resetting editIndex
        editIndex = null;
    }

    // Function to check for duplicate task name
    function checkDuplicate(taskName) {
        return tasks.some(function (item) {
            return item.taskName === taskName;
        });
    }

    // Function to display the tasks in the table
    function renderTasks(filteredTasks = tasks) {
        // remove all rows
        $("#task-display-table").find("tr:not(:first)").remove();
        // get the reference of the table
        let table = document.getElementById("task-display-table");
        // if task list is empty, show the message 'No task to display'
        if (tasks.length == 0) {
            let row = table.insertRow();
            let noTask = row.insertCell(0);
            noTask.colSpan = "7";
            noTask.style.textAlign = "center";
            noTask.textContent = "No task to display";
        }
        //insert row for each task
        filteredTasks.forEach((task, index) => {
            let row = table.insertRow();
            let taskName = row.insertCell(0);
            let description = row.insertCell(1);
            let assignedTo = row.insertCell(2);
            let dueDate = row.insertCell(3);
            let priority = row.insertCell(4);
            let taskstatus = row.insertCell(5);
            let actionButtonCell = row.insertCell(6);
            taskName.textContent = `${task.taskName}`;
            description.textContent = `${task.description}`;
            assignedTo.textContent = `${task.assignedTo}`;
            dueDate.textContent = `${task.dueDate}`;
            // set backgroundColor of priority cell based on the value
            priority.style.backgroundColor = `${
                task.priority === "high"
                    ? "#dd3737"
                    : task.priority === "medium"
                    ? "#ffc71e"
                    : task.priority === "low"
                    ? "#05aa4e"
                    : ""
            }`;
            priority.textContent = `${task.priority}`;
            taskstatus.textContent = `${task.status}`;

            // Edit button
            let editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.setAttribute("data-index", index);
            editButton.title = "Edit";
            editButton.innerHTML = `<img src="./images/edit-button.png" alt="buttonpng" border="0" />`;

            // Delete button
            let deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.setAttribute("data-index", index);
            deleteButton.title = "Delete";
            deleteButton.innerHTML = `<img src="./images/trash.png" alt="buttonpng" border="0" />`;

            // add both buttons to the action cell
            let buttonHolder = document.createElement("span");
            buttonHolder.appendChild(editButton);
            buttonHolder.appendChild(deleteButton);
            actionButtonCell.appendChild(buttonHolder);
        });
    }

    // Function to add a new task or update an existing task.
    function addTask() {
        let isValid = true;

        // Retrieve task details from input fields.
        const taskName = $("#taskName").val().trim();
        const description = $("#taskDescription").val().trim();
        const assignedTo = $("#assignedTo").val().trim();
        const dueDate = $("#dueDate").val();
        const priority = $("#priority").val();
        const status = $("#status").val();

        // validate task name
        if (taskName == "") {
            $("#taskName").next().text("*This field is required.");
            isValid = false;
        } else if (!namePattern.test(taskName)) {
            //validate using regex
            $("#taskName").next().text("*Task name must contain only letters.");
            isValid = false;
        } else {
            $("#taskName").next().text("");
        }
        // validate task description
        if (description == "") {
            $("#taskDescription").next().text("*This field is required.");
            isValid = false;
        } else if (!namePattern.test(description)) {
            //validate using regex
            $("#taskDescription")
                .next()
                .text("*Description must contain only letters.");
            isValid = false;
        } else {
            $("#taskDescription").next().text("");
        }
        // validate task assignedTo
        if (assignedTo == "") {
            $("#assignedTo").next().text("*This field is required.");
            isValid = false;
        } else if (!namePattern.test(assignedTo)) {
            //validate using regex
            $("#assignedTo")
                .next()
                .text("*Assigned to must contain only letters.");
            isValid = false;
        } else {
            $("#assignedTo").next().text("");
        }
        // validate task due date
        if (dueDate == "") {
            $("#dueDate").next().text("*This field is required.");
            isValid = false;
        } else {
            // if the date is valid, ensure that the due date is a future date.
            // user cannot provide past date for due date while adding a task.
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let x = dueDate.split("-");
            let tempDate = x[1] + "/" + x[2] + "/" + x[0];
            let due_Date = new Date(tempDate);
            due_Date.setHours(0, 0, 0, 0);
            if (due_Date < today) {
                $("#dueDate").next().text("*Please enter a future date.");
                isValid = false;
            } else {
                $("#dueDate").next().text("");
            }
        }

        // if inputs are valid, do add/edit function.
        if (isValid) {
            // editing an existing task.
            if (editIndex !== null) {
                // checking taskname already exists,taskname should be unique
                if (checkDuplicate(taskName)) {
                    if (!(tasks[editIndex].taskName == taskName)) {
                        $("#taskName")
                            .next()
                            .text("*Task name already exists.");
                    } else {
                        tasks[editIndex] = {
                            taskName,
                            description,
                            assignedTo,
                            dueDate,
                            priority,
                            status,
                        };
                        // editIndex = null; // Reset the edit index.
                        clearInputFields(); // Clear input fields.
                    }
                } else {
                    tasks[editIndex] = {
                        taskName,
                        description,
                        assignedTo,
                        dueDate,
                        priority,
                        status,
                    };
                    // editIndex = null; // Reset the edit index.
                    clearInputFields(); // Clear input fields.
                }
            }
            // adding new task
            else {
                // checking taskname already exists,taskname should be unique
                if (checkDuplicate(taskName)) {
                    $("#taskName").next().text("*Task name already exists.");
                } else {
                    tasks.push({
                        taskName,
                        description,
                        assignedTo,
                        dueDate,
                        priority,
                        status,
                    }); // Add a new task.
                    clearInputFields(); // Clear input fields.
                }
            }
            saveTasks(editIndex !== null ? "edit" : "new"); // Save the tasks to local storage.
            renderTasks(); // Refresh the task list in the UI.
        }
    }

    // Function to edit a task.
    function editTask(index, filteredTasks = tasks) {
        const task = filteredTasks[index];
        let tasks_index = tasks.indexOf(task);
        // Set the index of the task being edited.
        editIndex = tasks_index;

        // clear all error messages
        const spans = $(".task-cotainer span");
        for (let span of spans) {
            span.textContent = "";
        }

        // fill input fields with task details for editing.
        document.getElementById("taskName").value = task.taskName;
        document.getElementById("taskDescription").value = task.description;
        document.getElementById("assignedTo").value = task.assignedTo;
        document.getElementById("dueDate").value = task.dueDate;
        document.getElementById("priority").value = task.priority;
        document.getElementById("status").value = task.status;
        // Change button text to "Update".
        addTaskButton.textContent = "Update";
    }

    // Function to delete a task.
    function deleteTask(index, filteredTasks = tasks) {
        const task = filteredTasks[index];
        let tasks_index = tasks.indexOf(task);
        // Remove the task from the tasks array.
        tasks.splice(tasks_index, 1);
        saveTasks(); // Save the updated tasks to local storage.
        renderTasks(); // Refresh the task list in the UI.
        clearInputFields(); // Clear input fields.
    }

    // Function to clear input fields and reset the button text.
    function clearInputFields() {
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => (input.value = "")); // Clear input values.
        document.getElementById("taskDescription").value = "";
        // set default values for priority and status
        document.getElementById("priority").value = "high";
        document.getElementById("status").value = "new";
        // clear all error messages
        const spans = $(".task-cotainer span");
        for (let span of spans) {
            span.textContent = "";
        }
        addTaskButton.textContent = "Add Task"; // Reset button text.
    }

    // Function to filter tasks based on the search text.
    function filterTasks(filterText) {
        return tasks.filter((task) => {
            for (const key in task) {
                if (
                    task[key].toLowerCase().includes(filterText.toLowerCase())
                ) {
                    return true; // Return true if any detail matches the filter text.
                }
            }
            return false;
        });
    }

    // Add event listeners for add button click.
    addTaskButton.addEventListener("click", addTask);
    // Add event listeners for search input change.
    searchFilter.addEventListener("input", () =>
        renderTasks(filterTasks(searchFilter.value))
    );
    // Add event listeners for edit and delete button in table.
    taskDisplayTable.addEventListener("click", (e) => {
        if (e.target.parentNode.classList.contains("edit-button")) {
            const index = e.target.parentNode.getAttribute("data-index");
            // if search input is having value, then pass the filtered array to editTask function
            if (searchFilter.value) {
                editTask(index, filterTasks(searchFilter.value));
            } else {
                editTask(index);
            }
        } else if (e.target.parentNode.classList.contains("delete-button")) {
            const index = e.target.parentNode.getAttribute("data-index");

            if (confirm("Are you sure you want to delete this task?")) {
                // if search input is having value, then pass the filtered array to deleteTask function
                if (searchFilter.value) {
                    deleteTask(index, filterTasks(searchFilter.value));
                } else {
                    deleteTask(index);
                }
            }
        }
    });
});
