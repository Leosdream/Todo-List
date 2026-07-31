import "./styles.css";
let projectArr = [];
let currentProject = "inbox";
let inboxArr = [];

import { initDOMListeners, renderProject } from "./dom.js";
import { renderTodo } from "./dom.js";

if (
  !localStorage.getItem("projectArrMemory") ||
  !localStorage.getItem("inboxArrMemory") ||
  !localStorage.getItem("currentProject")
) {
  populateStorage();
} else {
  setStyles();
}

initDOMListeners();

function createTodo(title, description, dueDate, priority) {
  if (title !== "") {
    return {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      priority,
    };
  }
}

function createProject(name) {
  return {
    id: crypto.randomUUID(),
    name: name,
    todos: [],
  };
}
const confirmProjectBtn = document.querySelector("#confirm-project-btn");
const allProjects = document.querySelectorAll(".projectCreated");
const projectName = document.querySelector("#project-name");

confirmProjectBtn.addEventListener("click", () => {
  if (projectName.value === "") {
    return;
  }
  const newProject = createProject(projectName.value);
  projectArr.push(newProject);
  currentProject = newProject.id;
  populateStorage();
  renderTodo(newProject.todos);
  renderProject(newProject);
});

const containerProject = document.querySelector("#containerProject");

containerProject.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const projectContainer = e.target.closest("[data-id]");
    const targetId = projectContainer.dataset.id;
    projectArr = projectArr.filter((proj) => proj.id !== targetId);
    projectContainer.remove();
    populateStorage();
    if (currentProject === targetId) {
      currentProject = "inbox";
      populateStorage();
      renderTodo(inboxArr);
    }
  }
});

const inbox = document.querySelector("#inbox");
inbox.addEventListener("click", () => {
  currentProject = "inbox";
});

const confirmTaskBtn = document.querySelector("#confirm-task-btn");
const taskName = document.querySelector("#task-name");
const taskDescription = document.querySelector("#task-description");
const taskPriority = document.querySelector("#task-priority");
const taskDueDate = document.querySelector("#task-dueDate");

confirmTaskBtn.addEventListener("click", () => {
  // console.log("projectArr[0].todos", projectArr[0].todos);
  const task = createTodo(
    taskName.value,
    taskDescription.value,
    taskDueDate.value,
    taskPriority.value,
  );
  if (!task) {
    return;
  }
  if (currentProject === "inbox") {
    inboxArr.push(task);
    populateStorage();
    renderTodo(inboxArr);
  } else {
    projectArr.forEach((project) => {
      if (project.id === currentProject) {
        project.todos.push(task);
        populateStorage();
        renderTodo(project.todos);
      }
    });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("inboxBtn")) {
    currentProject = "inbox";
    populateStorage();
    renderTodo(inboxArr);
  }
  if (e.target.classList.contains("projectCreated")) {
    currentProject = e.target.closest("[data-id]").dataset.id;
    projectArr.forEach((project) => {
      if (project.id === currentProject) {
        populateStorage();
        renderTodo(project.todos);
      }
    });
  }
});

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("projectCreated") ||
    e.target.classList.contains("inboxBtn") ||
    e.target.classList.contains("confirm-project-btn")
  ) {
    document
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));
    document
      .querySelectorAll(".beta")
      .forEach((el) => el.classList.remove("beta"));

    if (e.target.classList.contains("confirm-project-btn")) {
      const allProjects = document.querySelectorAll("div.projectContainer");
      const lastProject = allProjects[allProjects.length - 1];
      if (lastProject) {
        lastProject.classList.add("active");
      }
    }

    if (e.target.classList.contains("inboxBtn")) {
      e.target.classList.add("active");
    }
    if (e.target.classList.contains("projectCreated")) {
      const parentCard = e.target.closest("[data-id]");

      if (parentCard) {
        parentCard.classList.add("active");

        const deleteBtn = parentCard.querySelector(".delete");
        if (deleteBtn) {
          deleteBtn.classList.add("beta");
        }
      }
    }
  }
});

const containerMain = document.querySelector("#conatiner-main");
containerMain.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteTodoBtn")) {
    const parentCard = e.target.closest(".todo-card");
    if (currentProject === "inbox") {
      inboxArr = inboxArr.filter((todo) => todo.id !== parentCard.dataset.id);
      populateStorage();
      renderTodo(inboxArr);
    } else if (currentProject !== "inbox") {
      for (let i = 0; i < projectArr.length; i++) {
        for (let j = 0; j < projectArr[i].todos.length; j++) {
          if (projectArr[i].todos[j].id === parentCard.dataset.id) {
            projectArr[i].todos.splice(j, 1);
            populateStorage();
            renderTodo(projectArr[i].todos);
            break;
          }
        }
      }
    }
  }
});

const parentCard = document.querySelector("#conatiner-main");

parentCard.addEventListener("click", (e) => {
  if (e.target.classList.contains("editTodoBtn")) {
    const card = e.target.closest(".todo-card");
    const rowDiv = e.target.parentElement;
    const id = card.dataset.id;

    const currentText = rowDiv.firstChild.textContent;
    // const updatedText = prompt("Edit field:", currentText);
    let updatedText;
    let confirm;
    let cancel;
    let dialog;
    let dialogEditText;
    if (
      rowDiv.classList.contains("todo-title") ||
      rowDiv.classList.contains("todo-description")
    ) {
      dialog = document.querySelector("#editDialog");
      confirm = document.querySelector("#confirm-text-edit-buttons");
      cancel = document.querySelector("#cancel-text-edit-buttons");
      dialogEditText = document.querySelector("#dialogEditText");
      dialog.showModal();
    } else if (rowDiv.classList.contains("task-date")) {
      dialog = document.querySelector("#editDialog-date");
      confirm = document.querySelector("#confirm-text-edit-buttons-date");
      cancel = document.querySelector("#cancel-text-edit-buttons-date");
      dialogEditText = document.querySelector("#dialogEditText-date");
      dialog.showModal();
    } else if (rowDiv.classList.contains("task-priority")) {
      dialog = document.querySelector("#editDialog-priority");
      confirm = document.querySelector("#confirm-text-edit-buttons-priority");
      cancel = document.querySelector("#cancel-text-edit-buttons-priority");
      dialogEditText = document.querySelector("#dialogEditText-priority");
      dialog.showModal();
    }

    confirm.addEventListener("click", () => {
      // const dialogEditText= document.querySelector("#dialogEditText")
      updatedText = dialogEditText.value;
      dialog.close();
      if (updatedText !== undefined) {
        if (currentProject === "inbox") {
          for (let i = 0; i < inboxArr.length; i++) {
            if (inboxArr[i].id === id) {
              if (rowDiv.classList.contains("todo-title")) {
                inboxArr[i].title = updatedText;
              } else if (rowDiv.classList.contains("todo-description")) {
                inboxArr[i].description = updatedText;
              } else if (rowDiv.classList.contains("task-date")) {
                inboxArr[i].dueDate = updatedText;
              } else if (
                rowDiv.classList.contains("task-priority") &&
                updatedText !== ""
              ) {
                inboxArr[i].priority = updatedText;
              } else if (
                rowDiv.classList.contains("task-priority") &&
                updatedText === ""
              ) {
                inboxArr[i].priority = "";
                rowDiv.remove();
                console.log("11111");
              }
              break;
            }
          }
          renderTodo(inboxArr);
          populateStorage();
        } else if (currentProject !== "inbox") {
          for (let i = 0; i < projectArr.length; i++) {
            for (let j = 0; j < projectArr[i].todos.length; j++) {
              if (projectArr[i].todos[j].id === id) {
                if (rowDiv.classList.contains("todo-title")) {
                  projectArr[i].todos[j].title = updatedText;
                } else if (rowDiv.classList.contains("todo-description")) {
                  projectArr[i].todos[j].description = updatedText;
                } else if (rowDiv.classList.contains("task-date")) {
                  projectArr[i].todos[j].dueDate = updatedText;
                } else if (rowDiv.classList.contains("task-priority")) {
                  projectArr[i].todos[j].priority = updatedText;
                }
                populateStorage();
                renderTodo(projectArr[i].todos);
                break;
              }
            }
          }
        }
      }
    });
    cancel.addEventListener("click", () => {
      dialog.close();
    });
  }
});

function populateStorage() {
  localStorage.setItem("projectArrMemory", JSON.stringify(projectArr));
  localStorage.setItem("inboxArrMemory", JSON.stringify(inboxArr));
  localStorage.setItem("currentProject", currentProject);

  setStyles();
}

function setStyles() {
  const rawProjectData = localStorage.getItem("projectArrMemory");
  const rawInboxData = localStorage.getItem("inboxArrMemory");

  let projectArrMemory;
  if (rawProjectData !== "") {
    projectArrMemory = JSON.parse(rawProjectData);
  } else {
    projectArrMemory = [];
  }

  console.log("projectArrMemory", projectArrMemory);

  if (projectArr == "") {
    projectArr = projectArrMemory;
    for (let i = 0; i < projectArr.length; i++) {
      renderProject(projectArr[i]);
    }
  }
  projectArr = projectArrMemory;

  let projectInboxMemory;
  if (rawInboxData !== "") {
    projectInboxMemory = JSON.parse(rawInboxData);
  } else {
    projectInboxMemory = [];
  }

  if (inboxArr == "") {
    inboxArr = projectInboxMemory;
    renderTodo(inboxArr);
  }
}
