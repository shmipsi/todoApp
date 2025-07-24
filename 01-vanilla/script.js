/*
TODO

*/

const todoList = document.getElementById("todo-list");
localStorage.getItem("todoList") &&
    (todoList.innerHTML = localStorage.getItem("todoList"));
const todoItems = todoList.querySelectorAll("li");
todoItems.forEach((item) => {
    const editButton = item.querySelector(".edit-btn");
    const deleteButton = item.querySelector(".dlt-btn");
    if (editButton) {
        editButton.addEventListener("click", editTask);
    }
    if (deleteButton) {
        deleteButton.addEventListener("click", deleteTask);
    }
});

function saveTodoList() {
    const todoList = document.getElementById("todo-list");
    localStorage.setItem("todoList", todoList.innerHTML);
}

function addTask() {
    const taskInput = document.getElementById("todo-input");
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Please enter a task.");
        return;
    }

    const todoList = document.getElementById("todo-list");
    if (!todoList) {
        alert("todo list not found.");
        return;
    }

    const taskItem = document.createElement("li");

    const todoText = document.createElement("span");
    todoText.textContent = taskText;
    todoText.className = "todo-text";
    taskItem.appendChild(todoText);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", editTask);
    taskItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "dlt-btn";
    deleteButton.addEventListener("click", deleteTask);
    taskItem.appendChild(deleteButton);

    todoList.appendChild(taskItem);
    taskInput.value = "";

    saveTodoList();
}

function editTask(event) {
    const taskItem = event.target.parentElement;
    const todoText = taskItem.querySelector(".todo-text");
    const newText = prompt("Edit your task:", todoText.textContent);

    if (newText !== null && newText.trim() !== "") {
        todoText.textContent = newText.trim();
    } else {
        alert("Task cannot be empty.");
    }

    saveTodoList();
}

function deleteTask(event) {
    const taskItem = event.target.parentElement;
    if (confirm("Are you sure you want to delete this task?")) {
        taskItem.remove();
    }

    saveTodoList();
}
