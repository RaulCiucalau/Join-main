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

  function returnUser(user, secondLetter, firstLetter) {
    return {
      ...user,
      avatar: secondLetter ? `${firstLetter}${secondLetter}` : firstLetter
    };
  }

  function constFirstLetter(user) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    const secondLetter = user.name.split(" ")[1]?.[0]?.toUpperCase();
    return { secondLetter, firstLetter };
  }

  async function fetchResponseFirebase() {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/contacts.json");
    const data = await response.json();
    return data;
  }
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

function areInputsEmpty() {
  const t = (id) => document.getElementById(id),
        d = t("add-task-due-date"),
        [e, p] = t("required-date").querySelectorAll("p");
  let { v, i, today } = letAddTaskTitle();
  [e, p, t("required-date")].forEach(el => el.classList.add("dp-none"));
  if (!v) {
    requiredDateTrue();
  } else if (new Date(v) < today) {
    requiredDate();
  }
  return i;

  function requiredDateTrue() {
    e.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    i = true;
  }

  function letAddTaskTitle() {
    let i = !t("add-task-title").value.trim() || !t("category").value.trim(), v = d.value, today = new Date();
    today.setHours(0, 0, 0, 0);
    return { v, i, today };
  }

  function requiredDate() {
    p.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    d.style.border = "1px solid red";
    i = true;
  }
}

function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some(task => task.title === title);
}

function showFieldRequired() {
  if (document.getElementById("add-task-title").value.trim() === "") {
    document.getElementById("add-task-title").style.border = "1px solid red";
    document.getElementById("required-title").classList.remove("dp-none");
  }
  if (document.getElementById("add-task-due-date").value.trim() === "") {
    document.getElementById("required-date").classList.remove("dp-none");
    document.getElementById("add-task-due-date").style.border = "1px solid red";
  }
  if (document.getElementById("category").value.trim() === "") {
    document.getElementById("category").style.border = "1px solid red";
    document.getElementById("required-category").classList.remove("dp-none");
  }
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
    <p>Task added to board</p>
    <img src="./assets/icons/added-to-board.svg" alt="Board image" />
  </div>`;
}

function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board/board.html";
  }, 1000);
}

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
 * Clears the task form inputs.
 */
function clearTaskForm() {
  subtasks = [];
  clearInputs();
  unselectPrio("urgent");
  unselectPrio("low");
  selectedContacts = [];
  selectedContactsNames = [];
  removeFieldRequired();
}

/**
 * Clears all input fields.
 */
function clearInputs() {
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask").value = "";
  document.getElementById("add-task-title").value = "";
  document.getElementById("add-task-due-date").value = "";
  document.getElementById("add-task-description").value = "";
  document.getElementById("selected-avatars").innerHTML = "";
  document.getElementById("category").value = "";
  document.getElementById("assigned-to").value = "";
}

/**
 * Removes the required field indication.
 * @param {HTMLElement} element - The element to update.
 */
function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("add-task-due-date").style.border = "1px solid #d1d1d1";
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}

/**
 * Shows an error if the task already exists.
 */
function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}

/**
 * Changes the icon to blue.
 * @param {HTMLElement} element - The element to update.
 */
function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

/**
 * Changes the icon to black.
 * @param {HTMLElement} element - The element to update.
 */
function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
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
