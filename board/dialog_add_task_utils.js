
/**
 * Show the blue variant of the clear icon while the pointer is hovering.
 */
function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

/**
 * Restore the default (black) clear icon when hovering stops.
 */
function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

/**
 * Transform an array into an object keyed by numeric indices.
 * @param {Array} array - Array to transform.
 * @returns {Object} Object where keys are indices and values are items.
 */
function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

/**
 * Create and return a new unique task identifier.
 * @returns {string} New unique id as a string.
 */
function generateUniqueId() {
  currentMaxId += 1;
  return String(currentMaxId);
}

/**
 * Retrieve all tasks from Firebase and populate `tasksArr`.
 * @param {string} path - Location in Firebase to fetch tasks from.
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
   * Build `tasksArr` from the Firebase object and update `currentMaxId`.
   * @param {Object} data - Firebase tasks object keyed by id.
   */
  function taskArrObject(data) {
    tasksArr = Object.values(data);
    const ids = Object.keys(data).map(id => Number(id)).filter(id => !isNaN(id));
    currentMaxId = ids.length ? Math.max(...ids) : 3;
  }
}

/**
 * Load login data and display either the guest initial or the user's avatar.
 * Shows 'G' for guest sessions; otherwise uses the stored avatar character.
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
 * Mark the active navigation link based on the current page pathname.
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
 * Return the string with its first character converted to uppercase.
 * @param {string} string - Text to convert.
 * @returns {string} The input with the initial character capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Convert titles in `subtasks` into objects containing `title` and `completed` flags.
 * @returns {Array<Object>} List of subtask objects prepared for saving.
 */
function getSubtasksArray() {
  return subtasks.map(title => ({ title: title, completed: false }));
}