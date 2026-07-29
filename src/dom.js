


export function initDOMListeners(){

const userName= document.querySelector("#userName");
const dialog = document.querySelector("#userName-dialog");
const userNametitle= document.querySelector("#userName-title");
const submit= document.querySelector("#submit");
const sideBarButton= document.querySelector("#sideBarButton");
const inbox= document.querySelector("#inbox");
const projectDialog = document.querySelector("#project-dialog");
const addProjectBtn = document.querySelector("#addProjectButton");
const cancelBtn = document.querySelector("#cancel-project-btn");
const confirmProjectBtn=document.querySelector("#confirm-project-btn");

const savedName=localStorage.getItem('userStorage')|| "User";
userName.textContent=savedName;
userName.addEventListener("click", () => { dialog.showModal();});
submit.addEventListener("click", () => {  
    const newUser=userNametitle.value
    userName.textContent=newUser;
    localStorage.setItem('userStorage', newUser);
    dialog.close();
})

addProjectBtn.addEventListener("click", () => { 
    projectDialog.showModal();
    
});


cancelBtn.addEventListener("click", () => {
    projectDialog.close();
    });



    const newTaskBtn = document.querySelector("#new-Task");
  const taskDialog = document.querySelector("#task-dialog");
  const cancelTaskBtn = document.querySelector("#cancel-task-btn");

  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", () => {
      taskDialog.showModal();
    });
  }

  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", () => {
      taskDialog.close();
    });
  }


}

export function renderTodo(todoObj){
    const container= document.querySelector("#conatiner-main");
    container.classList.add("todoContainer");
    container.innerHTML="";
    todoObj.forEach(todo => {
        const card = document.createElement("div");
        card.classList.add("todo-card");
    card.dataset.id = todo.id;
        const title = document.createElement("div");
        const description = document.createElement("div");
        const dueDate= document.createElement("div");
        const priority= document.createElement("div");
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteTodoBtn");


    title.textContent = todo.title;
    description.textContent = todo.description;
    dueDate.textContent = todo.dueDate;
    priority.textContent = todo.priority;
    deleteButton.textContent = "Delete";
    // attach delete buttons, priority styling, etc.
    container.appendChild(card);
    card.appendChild(title)
    card.appendChild(description);
    card.appendChild(dueDate);
    card.appendChild(priority);
    card.appendChild(deleteButton);
    })


}

export function renderProject(value){
    const projectContainer=document.createElement("div");
    const project = document.createElement("button");
    const deleteBtn =document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.className="delete";
    project.className="projectCreated";
    projectContainer.className="projectContainer";

    const containerProject= document.querySelector("#containerProject");
    containerProject.appendChild(projectContainer);
    projectContainer.appendChild(project);
    projectContainer.appendChild(deleteBtn);
    project.textContent=value.name;
projectContainer.dataset.id=value.id;


}




// making a localStorage creation function where everytime i create a project it can use the function and save it in the local storage?