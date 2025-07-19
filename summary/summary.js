/**
 * Initializes the dashboard by loading tasks, updating UI elements, and setting user greeting.
 */
async function init() {
  updateHoverScaleClass();
  await onloadFunc(); // Tasks laden
  showTasksCounts(tasks); // Tasks anzeigen
  showUrgentDate(tasks); // Dringend-Datum anzeigen
  await loadUserNameAndGreeting(); // Name + Gruß anzeigen
  loadAvatarForHeader();
  checkOrientation();
}

/**
 * Displays the counts of various task statuses.
 * @param {Array} tasks - Array of task objects.
 */
function showTasksCounts(tasks) {
  showTotalTasks(tasks);
  showTodoCount(tasks);
  showDoneCount(tasks);
  showInProgressCount(tasks);
  showAwaitFeedbackCount(tasks);
  showUrgentTasksCount(tasks);
}

/**
 * Toggles the visibility of the side menu.
 */
function openCloseSideMenu() {
  document.getElementById("sideMenu").classList.toggle('side-menu-close');
}

/**
 * Displays the total number of tasks.
 * @param {Array} tasks - Array of task objects.
 */
function showTotalTasks(tasks) {
  let content = document.getElementById('totalTasks');
  content.innerHTML = `${tasks.length}`;
}

/**
 * Displays the number of tasks with status 'ToDo'.
 * @param {Array} tasks - Array of task objects.
 */
function showTodoCount(tasks) {
  const content = document.getElementById('totalToDos');
  const toDoTasks = tasks.filter(task => task.status === 'ToDo');
  content.innerHTML = `${toDoTasks.length}`;
}

/**
 * Displays the number of tasks with status 'Done'.
 * @param {Array} tasks - Array of task objects.
 */
function showDoneCount(tasks) {
  const content = document.getElementById('doneCount');
  const doneTasks = tasks.filter(task => task.status === 'Done');
  content.innerHTML = `${doneTasks.length}`;
}

/**
 * Displays the number of tasks with status 'InProgress'.
 * @param {Array} tasks - Array of task objects.
 */
function showInProgressCount(tasks) {
  const content = document.getElementById('inProgressCount');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  content.innerHTML = `${inProgressTasks.length}`;
}

/**
 * Displays the number of tasks with status 'AwaitFeedback'.
 * @param {Array} tasks - Array of task objects.
 */
function showAwaitFeedbackCount(tasks) {
  const content = document.getElementById('awaitFeedbackCount');
  const awaitFeedbackTasks = tasks.filter(task => task.status === 'AwaitFeedback');
  content.innerHTML = `${awaitFeedbackTasks.length}`;
}

/**
 * Displays the number of tasks with priority 'urgent'.
 * @param {Array} tasks - Array of task objects.
 */
function showUrgentTasksCount(tasks) {
  const content = document.getElementById('urgentTasksCount');
  const urgentTasks = tasks.filter(task => task.priority && task.priority.trim().toLowerCase() === 'urgent');
  content.innerHTML = `${urgentTasks.length}`;
}

/**
 * Displays the due date of the most urgent task.
 * @param {Array} tasks - Array of task objects.
 */
function showUrgentDate(tasks) {
  const Date_Urgent = document.getElementById('UrgentDate');
  const urgentTasks = tasks
    .filter(task => task.priority && task.priority.trim().toLowerCase() === 'urgent')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  if (urgentTasks.length > 0) {
    const formattedDate = new Date(urgentTasks[0].due_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    Date_Urgent.innerHTML = formattedDate;
  }
}

/**
 * Returns a greeting string based on the current time.
 * @returns {string} Greeting message.
 */
function getGreetings() {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return "Good Night";
  if (hour >= 17) return "Good Evening";
  if (hour >= 12) return "Good Afternoon";
  return "Good Morning";
}

/**
 * Retrieves login info from local storage.
 * @param {string} key - Key for localStorage.
 * @returns {Object|null} Parsed object or null if not found.
 */
function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Loads the user's name and greeting for the dashboard. Handles guest, user not found, and error cases.
 * Fetches user data from the database and updates the greeting UI.
 * @returns {Promise<void>}
 */
async function loadUserNameAndGreeting() {
  const loginInfo = loadLoginInfo("whoIsLoggedIn");
  if (!loginInfo || !loginInfo.userLoggedIn || !loginInfo.userLoggedIn.email) {
    return guestUser();
  }
  const email = loginInfo.userLoggedIn.email;
  try {
    const user = await fetchUser();
    if (user) {
      greetingUser(user);
    } else {
      userNotFoundInfo();
    }
  } catch (error) {
    errorLoading(error);
  }

  /**
   * Fetches the user object from the database by email.
   * @returns {Promise<Object|undefined>} The user object or undefined if not found.
   */
  async function fetchUser() {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    const user = Object.values(data).find(
      (userObj) => userObj.email.toLowerCase() === email.toLowerCase()
    );
    return user;
  }

  /**
   * Handles the guest user case and updates the greeting UI.
   */
  function guestUser() {
    const greeting = getGreetings();
    document.getElementById("dashboard-time").innerText = greeting;
    return;
  }

  /**
   * Handles errors during user loading and updates the UI.
   * @param {Error} error - The error object.
   */
  function errorLoading(error) {
    console.error("❌ Fehler beim Laden:", error);
    document.getElementById("dashboard-name").innerText = "Fehler beim Laden";
  }

  /**
   * Handles the case when the user is not found and updates the UI.
   */
  function userNotFoundInfo() {
    console.warn("❌ Nutzer nicht gefunden.");
    document.getElementById("dashboard-name").innerText = "Nutzer nicht gefunden";
  }

  /**
   * Updates the UI with the user's name and greeting.
   * @param {Object} user - The user object.
   */
  function greetingUser(user) {
    const name = user.name;
    const greeting = getGreetings();
    document.getElementById("dashboard-name").innerText = name;
    document.getElementById("dashboard-time").innerText = greeting;
  }
}

/**
 * Updates the hover-scale class on elements based on window width for responsive design.
 */
function updateHoverScaleClass() {
  const container = document.getElementById('boxInfoTask');
  if (!container) return;

  if (window.innerWidth <= 1418) {
    const hoverElements = container.querySelectorAll('.hover-scale');
    hoverElements.forEach(el => el.classList.remove('hover-scale'));
  }
}
