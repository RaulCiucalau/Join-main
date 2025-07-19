let selectedColumn = "to-do";
let tasksArr = [];
let selectedPrio = "medium";
let contacts = [];
let currentMaxId = 3; // startet bei 3, damit die nächste ID 4 ist

/**
 * Loads contacts from storage or API.
 */
async function loadContacts(path) {
  try {
    const data = await fetchResponseFirebase();
    if (data) {
      contacts = Object.values(data).filter(c => c !== null).map(user => {
        const { secondLetter, firstLetter } = constFirstLetter(user);
        return returnUser(user, secondLetter, firstLetter);
      });
    } else {
      contacts = [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
  }
}

/**
 * Adds an avatar (initials) to the user object.
 * @param {Object} user - User object.
 * @param {string} [secondLetter] - Optional second initial.
 * @param {string} firstLetter - First initial.
 * @returns {Object} Updated user.
 */
function returnUser(user, secondLetter, firstLetter) {
  return {
    ...user,
    avatar: secondLetter ? `${firstLetter}${secondLetter}` : firstLetter
  };
}

/**
 * Gets the first and second initials from a name.
 * @param {{ name: string }} user - User with a name.
 * @returns {{ secondLetter?: string, firstLetter: string }} Initials.
 */
function constFirstLetter(user) {
  const firstLetter = user.name.charAt(0).toUpperCase();
  const secondLetter = user.name.split(" ")[1]?.[0]?.toUpperCase();
  return { secondLetter, firstLetter };
}

/**
 * Fetches contacts from Firebase.
 * @returns {Promise<Object>} Contact data.
 */
async function fetchResponseFirebase() {
  const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/contacts.json");
  const data = await response.json();
  return data;
}

/**
 * Initializes the add task page.
 */
async function init() {
  await loadContacts("contactList");
  await loadTasks("tasks");
  await showLoggedInInfo();
  highlightMenuActual();
  checkOrientation();
}

/**
 * Creates a new task and saves it.
 */
function createTask() {
  if (areInputsEmpty()) {
    showFieldRequired();
  } else if (!canSaveTask()) {
    errorTaskAlreadyExists();
  } else {
    saveTaskInputs();
    showLog();
    goToBoards();
  }
}

/**
 * Saves the current task input values.
 */
function saveTaskInputs() {
  if (canSaveTask()) {
    let id = generateUniqueId();
    console.log("Vergebene ID:", id);
    const task = createTaskObject(id);
    tasksArr.push(task);
    addTaskToDatabase(id, task);
  } else {
    console.log("Task already exists or the input fields are empty");
  }
}

/**
 * Creates a task object from input values.
 * @returns {Object} The created task object.
 */
function createTaskObject(id) {
  return {
    id: id,
    column: selectedColumn,
    status: "ToDo",
    assigned_to: [...selectedContactsNames],
    category: getCategoryInput(),
    due_date: getDateInput(),
    description: getDescriptionInput(),
    priority: capitalizeFirstLetter(selectedPrio),
    subtasks: getSubtasksArray(),
    title: getTitleInput(),
  };
}

/**
 * Gets the value of the title input.
 * @returns {string} The title input value.
 */
function getTitleInput() {
  return document.getElementById("add-task-title").value;
}

/**
 * Gets the value of the date input.
 * @returns {string} The date input value.
 */
function getDateInput() {
  return document.getElementById("add-task-due-date").value;
}

/**
 * Gets the selected category input.
 * @returns {string} The selected category.
 */
function getCategoryInput() {
  return document.getElementById("category").value;
}

/**
 * Gets the value of the description input.
 * @returns {string} The description input value.
 */
function getDescriptionInput() {
  return document.getElementById("add-task-description").value;
}

/**
 * Gets the assigned contacts.
 * @returns {Array} The assigned contacts.
 */
function getAssignedTo() {
  return mapArrayToObject(selectedContactsNames);
}

/**
 * Gets the list of subtasks.
 * @returns {Array} The subtasks.
 */
function getSubtasks() {
  return mapArrayToObject(subtasks);
}

/**
 * Checks if the task can be saved.
 * @returns {boolean} True if the task can be saved, false otherwise.
 */
function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput);
}

/**
* Checks whether a task with the given title already exists in the task list.
*
* @param {Array<{ title: string }>} tasksArr - Array of task objects.
* @param {string} title - Title to check for duplicates.
* @returns {boolean} `true` if a task with the same title exists, otherwise `false`.
*/
function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some(task => task.title === title);
}

/**
 * Validates a required field using if...else logic.
 * @param {string} fieldId - ID of the input field.
 * @param {string} warningId - ID of the warning element.
 */
function validateField(fieldId, warningId) {
  const field = document.getElementById(fieldId);
  const warning = document.getElementById(warningId);

  if (field.value.trim() === "") {
    field.style.border = "1px solid red";
    warning.classList.remove("dp-none");
  } else {
    field.style.border = "";
    warning.classList.add("dp-none");
  }
}

/**
 * Runs validation on required form fields.
 */
function showFieldRequired() {
  validateField("add-task-title", "required-title");
  validateField("add-task-due-date", "required-date");
  validateField("category", "required-category");
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
    <p>Task added to board</p>
    <img src="./assets/icons/added-to-board.svg" alt="Board image" />
  </div>`;
}

/**
 * Redirects the user to the boards page after a 1-second delay.
 */
function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board/board.html";
  }, 1000);
}

/**
 * Saves a task to the database by ID.
 * @param {string} id - Task ID.
 * @param {Object} task - Task data.
 */
async function addTaskToDatabase(id, task) {
  try {
    await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.error("Fehler beim Schreiben in die Datenbank:", error);
  }
}

/**
 * Shows an error if the task already exists.
 */
function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}

/**
 * Converts an array into an object with array indices as keys.
 * @param {Array} array - The array to convert.
 * @returns {Object} - The resulting object.
 */
function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

/**
 * Generates a unique ID by incrementing a global counter.
 * @returns {string} - The new unique ID.
 */
function generateUniqueId() {
  currentMaxId += 1;
  return String(currentMaxId);
}

/**
 * Loads tasks from Firebase and sets the global task array and ID counter.
 * @param {string} [path="tasks"] - The Firebase path to fetch tasks from.
 */
async function loadTasks(path = "tasks") {
  try {
    const data = await fetchPathData();
    if (data) {
      tasksArr = Object.values(data);
      const ids = Object.keys(data).map(id => Number(id)).filter(id => !isNaN(id));
      currentMaxId = ids.length ? Math.max(...ids) : 3;
    } else {
      tasksArr = [];
      currentMaxId = 3;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks aus Firebase:", error);
  }

  /**
 * Fetches data from the given Firebase path.
 * @returns {Promise<Object|null>} - Parsed JSON data or null.
 */
  async function fetchPathData() {
    const response = await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/${path}.json`);
    const data = await response.json();
    return data;
  }
}

/**
 * Displays login information (guest or user avatar) in the UI.
 */
async function showLoggedInInfo() {
  try {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/login.json");
    const loginInfo = await response.json();
    if (loginInfo?.[0]?.isGuestLoggedIn) {
      document.getElementById("initialLetter").innerText = "G";
    } else {
      const avatar = loginInfo?.[0]?.userLoggedIn?.avatar || "G";
      document.getElementById("initialLetter").innerText = avatar;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Login-Info:", error);
    document.getElementById("initialLetter").innerText = "?";
  }
}

/**
 * Highlights the currently active navigation menu item based on URL.
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
 * @returns {string} - String with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts global subtasks array into an array of subtask objects.
 * @returns {Array<Object>} - Array of subtasks with title and completed status.
 */
function getSubtasksArray() {
  return subtasks.map(title => ({ title: title, completed: false }));
}

/**
 * Initializes the application when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  init();
});
