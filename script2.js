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
        activeFolder = JSON.parse(activeFolderFromStorage);
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

    saveData();
    renderFolders();
}

function deleteFolder (folderName) {
    if(confirm(`Are you sure you want to delete the folder "${folderName}"?`)) {
        delete folders[folderName];
        saveData();
        renderFolders();
    }
}

function renderToDos () {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""; // Clear existing tasks

    if (Object.keys(folders[activeFolder]).length === 0) {
        todoList.innerHTML = "<p>No tasks available. Please add a task.</p>";
        return;
    }

    const tasks = folders[activeFolder.textContent];
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
        editButton.onclick = () => editToDo(taskName.textContent);
        taskItem.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteToDo(taskName.textContent);
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
    if (folders[activeFolder.textContent][taskName]) {
        alert("Task already exists in this folder.");
        return;
    }
    folders[activeFolder.textContent][taskName] = false; // Default to not done

    saveData();
    renderToDos();

}

function deleteToDo (taskName) {
    if (!taskName || !folders[activeFolder.textContent][taskName]) {
        alert("Task not found.");
        return;
    }
    delete folders[activeFolder.textContent][taskName];
    saveData();
    renderToDos();
}

function editToDo () {

}

function toggleToDo () {

}