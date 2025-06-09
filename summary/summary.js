async function init() {
    await onloadFunc();
    showTasksCounts(tasks);
    dateToday();
    insertUserName()
}

function showTasksCounts(tasks) {
    showTotalTasks(tasks);
    showTodoCount(tasks);
    showDoneCount(tasks);
    showInProgressCount(tasks);
    showAwaitFeedbackCount(tasks);
    showUrgentTasksCount(tasks);
}

function openCloseSideMenu() {
    document.getElementById("sideMenu").classList.toggle('side-menu-close');
}

function showTotalTasks(tasks) {
    let content = document.getElementById('totalTasks');
    content.innerHTML = `${tasks.length}`;
}

function showTodoCount(tasks) {
    const content = document.getElementById('totalToDos');
    const toDoTasks = tasks.filter(task => task.status === 'ToDo');
    content.innerHTML = `${toDoTasks.length}`;
}

function showDoneCount(tasks) {
    const content = document.getElementById('doneCount');
    const doneTasks = tasks.filter(task => task.status === 'Done');
    content.innerHTML = `${doneTasks.length}`;
}

function showInProgressCount(tasks) {
    const content = document.getElementById('inProgressCount');
    const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
    content.innerHTML = `${inProgressTasks.length}`;
}

function showAwaitFeedbackCount(tasks) {
    const content = document.getElementById('awaitFeedbackCount');
    const awaitFeedbackTasks = tasks.filter(task => task.status === 'AwaitFeedback');
    content.innerHTML = `${awaitFeedbackTasks.length}`;
}

function showUrgentTasksCount(tasks) {
    const content = document.getElementById('urgentTasksCount');
    const urgentTasks = tasks.filter(task => task.priority === 'Urgent');
    content.innerHTML = `${urgentTasks.length}`;
}

function dateToday(){
   let time = new Date().toLocaleDateString();
   document.getElementById("Date-today").innerHTML = time;
}

//Great Guest or User
function guestOurUserGreating(){
    let nameUser = document.getElementById('user-name');

    if (isGuestLoggedIn){
       nameUser = `<h3> Gude Morning!</h3>`
    }
    else(userLoggedIn)
       nameUser.innerHTML = insertUserName();
}

// Great with name
function insertUserName(){
    let nameUser = document.getElementById('user-name');
    let name = ("Anja");
    nameUser.innerHTML = `<h3> Gude Morning, ${name}!</h3>`;
}