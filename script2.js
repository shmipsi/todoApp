let activeFolder = "";
let folders = {
    //Example folder structure
    // 'Work': {
    // "Task name": false(not done) or true(done),
    // },
};

loadData();
renderFolders();

function saveData () {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("activeFolder", activeFolder);
}

function loadData () {
    const foldersFromStorage = localStorage.getItem("folders");
    if (foldersFromStorage) {
        folders = JSON.parse(foldersFromStorage);
    } else {
        folders = {};
    }

    const activeFolderFromStorage = localStorage.getItem("activeFolder");
    if (activeFolderFromStorage) {
        activeFolder = activeFolderFromStorage;
    } else {
        activeFolder = null;
    }

    renderFolders();

    if (activeFolder) {
        renderToDos();
    } else {
        document.getElementById("todo-list").innerHTML = "<p>Create or select a folder</p>";
    }
}

function renderFolders () {
    const folderList = document.getElementById("folder-list");
    folderList.innerHTML = ""; // Clear existing folders

    if (Object.keys(folders).length === 0) {
        folderList.innerHTML = "<p>No folders available. Please add a folder.</p>";
    }

    for (const folderName in folders) {
        const folderItem = document.createElement("div");
        folderItem.className = "folder";

        const folderTitle = document.createElement("h3");
        folderTitle.textContent = folderName;
        folderTitle.onclick = () => {
            activeFolder = folderTitle.textContent;
            saveData();
            renderToDos();
        }
        folderItem.appendChild(folderTitle);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteFolder(folderTitle.textContent);
        folderItem.appendChild(deleteButton);

        folderList.appendChild(folderItem);
    }

}

function addFolder () {
    const folderName = document.getElementById("folder-input").value.trim();
    if (!folderName) {
        alert("Please enter a folder name.");
        return;
    }
    if (folders[folderName]) {
        alert("Folder already exists.");
        return;
    }
    folders[folderName] = {};
    activeFolder = folderName; // Set newly created folder as active
    document.getElementById("folder-input").value = ""; // Clear input field

    saveData();
    renderFolders();
}

function deleteFolder (folderName) {
    if(confirm(`Are you sure you want to delete the folder "${folderName}"?`)) {
        if (activeFolder === folderName) {
            activeFolder = ""; // Reset active folder if deleted
        }
        delete folders[folderName];
        saveData();
        renderFolders();
        renderToDos();
    }
}

function renderToDos () {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""; // Clear existing tasks

    if (!activeFolder || !folders[activeFolder]) {
        todoList.innerHTML = "<p>Create or select a folder</p>";
        return;
    }

    if (Object.keys(folders[activeFolder]).length === 0) {
        todoList.innerHTML = "<p>No tasks available. Please add a task.</p>";
        return;
    }

    const tasks = folders[activeFolder];
    for (const taskName in tasks) {
        const taskItem = document.createElement("div");
        taskItem.className = "todo-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tasks[taskName];
        checkbox.onchange = () => {
            tasks[taskName] = checkbox.checked;
            saveData();
        };
        taskItem.appendChild(checkbox);

        const taskText = document.createElement("h6");
        taskText.textContent = taskName;
        taskItem.appendChild(taskText);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editToDo(taskName);
        taskItem.appendChild(editButton);

        const archiveButton = document.createElement("button");
        archiveButton.textContent = "Archive";
        archiveButton.onclick = () => archiveToDO(taskName);
        taskItem.appendChild(archiveButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteToDo(taskName);
        taskItem.appendChild(deleteButton);

        todoList.appendChild(taskItem);
    }
}

function addToDo () {
    const taskName = document.getElementById("todo-input").value.trim();
    if (!taskName) {
        alert("Please enter a task name.");
        return;
    }
    if (folders[activeFolder][taskName]) {
        alert("Task already exists in this folder.");
        return;
    }
    folders[activeFolder][taskName] = false; // Default to not done

    saveData();
    renderToDos();
}

function deleteToDo (taskName) {
    delete folders[activeFolder][taskName];
    saveData();
    renderToDos();
}

function editToDo (taskName) {
    const newTask = prompt("Edit task:", taskName);
    if (newTask && newTask.trim() !== "" && !folders[activeFolder][newTask]) {
        folders[activeFolder][newTask] = folders[activeFolder][taskName];
        delete folders[activeFolder][taskName];
        saveData();
        renderToDos();
    } else {
        alert("Invalid task name or task already exists.");
    }
}

function archiveToDO (taskName) {
    if (!folders["Archive"]) {
        folders["Archive"] = {};
    }
    folders["Archive"][taskName] = folders[activeFolder][taskName];
    delete folders[activeFolder][taskName];
    saveData();
    renderFolders();
    renderToDos();
}