async function init() {
  await onloadFunc(); // Tasks laden
  showTasksCounts(tasks); // Tasks anzeigen
  showUrgentDate(tasks); // Dringend-Datum anzeigen
  await loadUserNameAndGreeting(); // Name + Gruß anzeigen
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

function showUrgentDate(tasks){
    const Date_Urgent = document.getElementById('UrgentDate');
    const urgentTasks = tasks
        .filter(task => task.priority === 'Urgent')
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    if (urgentTasks.length >= 0) {
        Date_Urgent.innerHTML = urgentTasks[0].due_date;
    }
}
// function dateToday(){
//    let time = new Date().toLocaleDateString();
//    document.getElementById("Date-today").innerHTML = time;
// }


function getGreetings() {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return "Good Night";
  if (hour >= 17) return "Good Evening";
  if (hour >= 12) return "Good Afternoon";
  return "Good Morning";
}

async function loadUserNameAndGreeting() {
  console.log("🔎 Starte: Nutzer aus DB holen und Gruß setzen...");

  try {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    console.log("🌐 Daten aus DB:", data);

    // Beispiel: erster Nutzer
    const firstUser = Object.values(data)[0];
    console.log("👤 Gefundener Nutzer:", firstUser);

    const name = firstUser.name;
    console.log("✅ Name:", name);

    // Begrüßung ermitteln
    const greeting = getGreetings();
    console.log("👋 Gruß:", greeting);

    // Ins HTML schreiben
    document.getElementById("dashboard-name").innerText = name;
    document.getElementById("dashboard-time").innerText = greeting;

  } catch (error) {
    console.error("❌ Fehler beim Laden:", error);
    document.getElementById("dashboard-name").innerText = "Fehler beim Laden";
  }
}

window.onload = () => {
  init();
};


