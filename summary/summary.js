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

function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

async function loadUserNameAndGreeting() {
  console.log("🔎 Starte: Nutzer aus DB holen und Gruß setzen...");

  const loginInfo = loadLoginInfo("whoIsLoggedIn");
  console.log("📦 loginInfo:", loginInfo);

  if (!loginInfo || !loginInfo.userLoggedIn || !loginInfo.userLoggedIn.email) {
    console.warn("⚠️ Kein eingeloggter Nutzer gefunden.");
    document.getElementById("dashboard-name").innerText = "Nicht eingeloggt";
    return;
  }

  const email = loginInfo.userLoggedIn.email;
  console.log("📧 Suche Nutzer mit Email:", email);

  try {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    console.log("🌐 Daten aus DB:", data);

    // Finde den Nutzer mit der gespeicherten Email
    const user = Object.values(data).find(
      (userObj) => userObj.email.toLowerCase() === email.toLowerCase()
    );
    console.log("👤 Gefundener Nutzer:", user);

    if (user) {
      const name = user.name;
      console.log("✅ Name:", name);

      const greeting = getGreetings();
      console.log("👋 Gruß:", greeting);

      document.getElementById("dashboard-name").innerText = name;
      document.getElementById("dashboard-time").innerText = greeting;
    } else {
      console.warn("❌ Nutzer nicht gefunden.");
      document.getElementById("dashboard-name").innerText = "Nutzer nicht gefunden";
    }

  } catch (error) {
    console.error("❌ Fehler beim Laden:", error);
    document.getElementById("dashboard-name").innerText = "Fehler beim Laden";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});


