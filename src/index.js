import './styles.css';
let projectArr=[];
let currentProject="inbox";
let inboxArr=[];

import { initDOMListeners, renderProject} from './dom.js';
import { renderTodo } from './dom.js';
initDOMListeners();

function createTodo(title, description, dueDate, priority) {
if(title!==""){
    return{
    id:crypto.randomUUID(),
    title,
    description,
    dueDate,
    priority
  }}
}


 function createProject(name){
return{
    id:crypto.randomUUID(),
    name: name,
    todos: []
}
}
const confirmProjectBtn=document.querySelector("#confirm-project-btn");
const allProjects= document.querySelectorAll(".projectCreated");
const projectName=document.querySelector("#project-name");


confirmProjectBtn.addEventListener("click", ()=>{
    if(projectName.value===""){return;}
    const newProject=createProject(projectName.value);
    projectArr.push(newProject);
    renderProject(projectArr[projectArr.length-1]);
    currentProject=newProject.id;
    renderTodo(newProject.todos);
})

const containerProject = document.querySelector("#containerProject");

containerProject.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const projectContainer = e.target.closest("[data-id]");
        const targetId = projectContainer.dataset.id;
        projectArr = projectArr.filter(proj => proj.id !== targetId);
        projectContainer.remove();
        if(currentProject===targetId){
        currentProject ="inbox";
        renderTodo(inboxArr);}
    }
});

const inbox= document.querySelector("#inbox");
inbox.addEventListener("click", () => {
    currentProject="inbox"
})



const confirmTaskBtn = document.querySelector("#confirm-task-btn");
const taskName = document.querySelector("#task-name");
const taskDescription = document.querySelector("#task-description");
// const taskDueDate = document.querySelector("#task-dueDate");
// const taskPriority = document.querySelector("#task-priority");


confirmTaskBtn.addEventListener("click", () => {
    
   const leo= createTodo(taskName.value, taskDescription.value)
//    console.log(leo);
   if(!leo){return;}
   if(currentProject==="inbox"){
    inboxArr.push(leo);
    renderTodo(inboxArr);

   } else{
    projectArr.forEach(project => {
        if(project.id===currentProject){
            project.todos.push(leo);
            console.log(projectArr[0].todos[0].id);
            //  HEY, here, aici
            renderTodo(project.todos);
        }
    })
   }


})

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("inboxBtn")) {
        currentProject = "inbox";
        renderTodo(inboxArr);
    }
    if (e.target.classList.contains("projectCreated")) {
        currentProject = e.target.closest("[data-id]").dataset.id;
        projectArr.forEach(project => {
            if (project.id === currentProject) {
                renderTodo(project.todos);
            }
        });
    }
})




document.addEventListener("click", (e) => {
    if (e.target.classList.contains("projectCreated") || e.target.classList.contains("inboxBtn")) {
        
        document.querySelectorAll(".active").forEach(el => el.classList.remove("active"));
        document.querySelectorAll(".beta").forEach(el => el.classList.remove("beta"));

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
    console.log(parentCard.dataset.id);
    if(currentProject==="inbox"){
        inboxArr = inboxArr.filter(todo => todo.id !== parentCard.dataset.id);
        renderTodo(inboxArr);}


    else if (currentProject!=="inbox"){
        for(let i=0; i<projectArr.length; i++){
            for(let j=0; j<projectArr[i].todos.length; j++){
                if(projectArr[i].todos[j].id===parentCard.dataset.id){
                    projectArr[i].todos.splice(j, 1);
                    renderTodo(projectArr[i].todos);
                    break;
                }
    }
    
}}}});

