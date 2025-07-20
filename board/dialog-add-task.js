/**
 * Stores all task objects loaded from the database.
 * @type {Array}
 */
let tasksArr = [];

/**
 * Keeps track of the highest used task ID to ensure unique IDs.
 * @type {number}
 */
let currentMaxId = 3;

/**
 * Currently selected task column (e.g., "to-do").
 * @type {string}
 */
let selectedPrio = "medium";
let selectedColumn = "to-do";

/**
 * Loads contact data from Firebase at the given path.
 * Adds initials as avatar letters for each contact.
 * @param {string} path - Firebase path for contacts (e.g., "contacts", "contactList").
 */
async function loadContacts(path) {
  try {
    const data = await fetchResponse();
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

/**
 * Returns the first and (optionally) second initial of a user's name.
 * @param {Object} user - The user object with a name property.
 * @returns {{secondLetter: string|undefined, firstLetter: string}}
 */
function constFirstLetter(user) {
  const firstLetter = user.name.charAt(0).toUpperCase();
  const secondLetter = user.name.split(" ")[1]?.[0]?.toUpperCase();
  return { secondLetter, firstLetter };
}

/**
 * Returns a user object with an avatar property set to initials.
 * @param {Object} user - The user object.
 * @param {string|undefined} secondLetter - The second initial (if any).
 * @param {string} firstLetter - The first initial.
 * @returns {Object} The user object with avatar property.
 */
function returnUser(user, secondLetter, firstLetter) {
  return {
    ...user,
    avatar: secondLetter ? `${firstLetter}${secondLetter}` : firstLetter
  };
}

/**
 * Fetches all contacts from Firebase and returns the data object.
 * @returns {Promise<Object>} The contacts data from Firebase.
 */
async function fetchResponse() {
  const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/contacts.json");
  const data = await response.json();
  return data;
}
}

/**
 * Initializes the add-task dialog by loading contacts, tasks, user info, and highlighting the menu.
 * @async
 */
async function init() {
  await loadContacts("contactList");
  await loadTasks("tasks");
  await showLoggedInInfo();
  highlightMenuActual();
}

/**
 * Handles the creation of a new task: validates inputs, saves the task, and updates the UI.
 */
function createTask() {
  if (areInputsEmpty()) {
    showFieldRequired();
  } else if (!canSaveTask()) {
    errorTaskAlreadyExists();
  } else {
    saveTaskInputs();
    document.getElementById('addTaskDialog').classList.add('d-none');
    renderCards(tasks);
  }
}

/**
 * Saves the task inputs, generates a new ID, creates the task object, and stores it in Firebase.
 */
function saveTaskInputs() {
  if (canSaveTask()) {
    let maxId = 0;
    for (let i = 0; i < tasks.length; i++) {
      const currentId = parseInt(tasks[i].id);
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    };
    newId(maxId);
  } else {
    console.log("Task already exists or the input fields are empty");
  }

  function newId(maxId) {
    let newId = maxId + 1;
    const task = createTaskObject(newId);
    tasks.push(task);
    addTaskToDatabase(newId, task);
  }
}

/**
 * Builds a new task object using form inputs.
 * @param {number} id - Unique task ID.
 * @returns {Object} Task object.
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
 * Gets the task title from input.
 * @returns {string}
 */
function getTitleInput() {
  return document.getElementById("add-task-title").value;
}

/**
 * Gets the due date from input.
 * @returns {string}
 */
function getDateInput() {
  return document.getElementById("add-task-due-date").value;
}

/**
 * Gets the category from input.
 * @returns {string}
 */
function getCategoryInput() {
  return document.getElementById("category").value;
}


/**
 * Gets the description from input.
 * @returns {string}
 */
function getDescriptionInput() {
  return document.getElementById("add-task-description").value;
}



/**
 * Converts the selected contact names array to an object with numeric keys.
 * @returns {Object} Object mapping indices to contact names.
 */
function getAssignedTo() {
  return mapArrayToObject(selectedContactsNames);
}

/**
 * Gets the current list of subtasks as an array of objects.
 * @returns {Array<Object>}
 */
function getSubtasks() {
  return mapArrayToObject(subtasks);
}

/**
 * Checks if task inputs are valid and the title is not a duplicate.
 * @returns {boolean}
 */
function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput);
}

/**
 * Checks if any required input fields are empty or invalid.
 * @returns {boolean}
 */
function areInputsEmpty() {
  const t = (id) => document.getElementById(id),
    d = t("add-task-due-date"),
    [e, p] = t("required-date").querySelectorAll("p");
  let i = !t("add-task-title").value.trim() || !t("category").value.trim(),
    v = d.value,
    today = new Date();
  today.setHours(0, 0, 0, 0);
  [e, p, t("required-date")].forEach(el => el.classList.add("dp-none"));
  if (!v) {
    requiredDateFalse(e, t("required-date"), () => { i = true; });
  } else if (new Date(v) < today) {
    requiredDate(p, t("required-date"), d, () => { i = true; });
  }
  return i;
}

/**
 * Shows required date warning for missing due date input.
 * @param {HTMLElement} e - The first warning paragraph element.
 * @param {HTMLElement} requiredDateEl - The required date container element.
 * @param {Function} setInvalid - Callback to set the invalid state.
 */
function requiredDateFalse(e, requiredDateEl, setInvalid) {
  e.classList.remove("dp-none");
  requiredDateEl.classList.remove("dp-none");
  setInvalid();
}

/**
 * Shows required date warning for past due date input and highlights the field.
 * @param {HTMLElement} p - The second warning paragraph element.
 * @param {HTMLElement} requiredDateEl - The required date container element.
 * @param {HTMLElement} d - The due date input element.
 * @param {Function} setInvalid - Callback to set the invalid state.
 */
function requiredDate(p, requiredDateEl, d, setInvalid) {
  p.classList.remove("dp-none");
  requiredDateEl.classList.remove("dp-none");
  d.style.border = "1px solid red";
  setInvalid();
}

/**
 * Checks if a task with the same title already exists.
 * @param {Array} tasksArr - Array of tasks.
 * @param {string} title - Task title to check.
 * @returns {boolean}
 */
function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some(task => task.title === title);
}

/**
 * Shows required field warnings for empty or invalid task input fields.
 */
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

/**
 * Redirects the user to the board page after a short delay.
 */
function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board/board.html";
  }, 1000);
}

/**
 * Sends the new task to Firebase using its ID as the key.
 * @param {number|string} id - Task ID.
 * @param {Object} task - Task object to store.
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
 * Clears the task form, resets subtasks, priorities, contacts, and removes required field warnings.
 */
function clearTaskForm() {
  subtasks = [];
  clearInputs();
  unselectPrio("urgent");
  unselectPrio("low");
  selectPrio("medium");
  selectedContacts = [];
  selectedContactsNames = [];
  removeFieldRequired();
}

/**
 * Clears all input fields in the add task form.
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
 * Removes required field warnings and resets input borders to default.
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
 * Displays an error message if a task with the same title already exists.
 */
function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}
