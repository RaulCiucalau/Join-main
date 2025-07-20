
/**
 * Changes the clear icon to blue on hover.
 */
function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

/**
 * Changes the clear icon back to black when not hovered.
 */
function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

/**
 * Converts an array to an object with numeric keys.
 * @param {Array} array - The array to convert.
 * @returns {Object} The resulting object.
 */
function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

/**
 * Generates a unique ID for a new task.
 * @returns {string}
 */
function generateUniqueId() {
  currentMaxId += 1;
  return String(currentMaxId);
}

/**
 * Loads all tasks from Firebase and updates `tasksArr`.
 * @param {string} path - Firebase path for tasks.
 */
async function loadTasks(path = "tasks") {
  try {
    const response = await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/${path}.json`);
    const data = await response.json();
    if (data) {
      taskArrObject(data);
    } else {
      tasksArr = [];
      currentMaxId = 3;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks aus Firebase:", error);
  }

  /**
   * Converts the tasks data object from Firebase into an array and updates the currentMaxId.
   * @param {Object} data - The tasks data object from Firebase, with task IDs as keys.
   */
  function taskArrObject(data) {
    tasksArr = Object.values(data);
    const ids = Object.keys(data).map(id => Number(id)).filter(id => !isNaN(id));
    currentMaxId = ids.length ? Math.max(...ids) : 3;
  }
}

/**
 * Fetches and displays the logged-in user's avatar or guest initial in the UI.
 * Sets the initial letter to 'G' for guests or the user's avatar for logged-in users.
 */
async function showLoggedInInfo() {
  try {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/login.json");
    const loginInfo = await response.json();
    if (loginInfo?.[0]?.isGuestLoggedIn) {
      document.getElementById("initialLetter").innerText = "G";
    } else {
      const avatar = loginInfo?.[0]?.userLoggedIn?.avatar || "?";
      document.getElementById("initialLetter").innerText = avatar;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Login-Info:", error);
    document.getElementById("initialLetter").innerText = "?";
  }
}

/**
 * Highlights the current menu item in the navigation bar based on the page URL.
 */
function highlightMenuActual() {
  const path = window.location.pathname;
  const menuLinks = document.querySelectorAll(".nav-link");
  menuLinks.forEach(link => {
    if (path.includes(link.getAttribute("href"))) {
      link.classList.add("nav-active");
    } else {
      link.classList.remove("nav-active");
    }
  });
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts the subtasks array to an array of subtask objects with title and completed properties.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getSubtasksArray() {
  return subtasks.map(title => ({ title: title, completed: false }));
}