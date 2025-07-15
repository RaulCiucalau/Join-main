let selectedContactsId = [];         // Stores selected contact indexes
let selectedContactsName = [];       // Stores selected contact names
let subtaskIdCount = 0;              // Counter for subtask IDs
let selectedPrioritys = "";          // Stores selected priority string
let currentTaskIds = null;           // ID of the task currently being edited
let subtaskIcons = document.querySelector('dialogSubtaskEdit'); // DOM reference (possible typo in selector)

/**
 * Visually selects a task priority and stores it.
 * @param {string} prio - One of 'urgent', 'medium', or 'low'.
 */
function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach(p => {
    document.getElementById(`prios-img-${p}`).src = `../assets/icons/priority-${p}.svg`;
    document.getElementById(`prios-btn-${p}`).style.backgroundColor = "white";
    document.getElementById(`prios-btn-${p}`).style.color = "black";
  });
  document.getElementById(`prios-img-${prio}`).src = `../assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prios-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prios-btn-${prio}`).style.color = "white";
  selectedPrioritys = prio;
  updateTaskPrioritys(prio);
}

/**
 * Wrapper for selecting priority from a toggle event.
 * @param {string} prio - Selected priority level.
 */
function togglePrioritys(prio) {
  selectPrio(prio);
}

/**
 * Updates the priority value in the current task object.
 * @param {string} prio - Priority string.
 */
function updateTaskPrioritys(prio) {
  const task = tasks.find(t => t.id === currentTaskId);
  if (task) {
    task.priority = prio;
  }
}

/**
 * Returns the color associated with a priority.
 * @param {string} prio - One of 'urgent', 'medium', or 'low'.
 * @returns {string} - Hex color code.
 */
function getPrioColors(prio) {
  switch (prio) {
    case "urgent":
      return "#FF3D00";
    case "medium":
      return "#FFA800";
    case "low":
      return "#7AE229";
    default:
      return "white";
  }
}

/**
 * Toggles visibility of the edit task dialog.
 */
function toggleEditTaskDialog() {
  let editDialog = document.getElementById('editTaskDialog');
  editDialog.classList.toggle('d-none-edit-dialog');
}

/**
 * Renders the edit task dialog for a specific task.
 * @param {Array} tasks - Array of all task objects.
 * @param {number|string} taskId - ID of the task to edit.
 */
function renderEditTaskDialog(tasks, taskId) {
  currentTaskIds = taskId;
  let container = document.getElementById('editTaskDialog');
  container.innerHTML = tasks.map(getEditTaskDialog).join('');
  renderAssigneeList(taskId);
  renderChosenAvatars(taskId);
}

/**
 * Opens and populates the edit dialog for a specific task by its ID.
 * @param {number|string} taskId - Task ID.
 */
function openEditTaskDialogById(taskId) {
  currentTaskIds = taskId;
  const task = tasks.find(task => task.id === taskId);
  const bigDialog = document.getElementById('bigTaskDialog');
  const editDialog = document.getElementById('editTaskDialog');
  bigDialog.classList.add('d-none-big-dialog');
  editDialog.innerHTML = getEditTaskDialog(task);
  editDialog.classList.remove('d-none-edit-dialog');
  renderPriorityFromAPI(task);
  renderChosenAvatars(taskId);
}

/**
 * Applies the saved priority value to the UI for an existing task.
 * @param {Object} task - Task object.
 */
function renderPriorityFromAPI(task) {
  if (!task || !task.priority) return;
  const prio = task.priority.toLowerCase();
  const validPrios = ["urgent", "medium", "low"];
  if (validPrios.includes(prio)) {
    selectPrio(prio);
  }
}

/**
 * Returns HTML for rendering all subtasks in edit mode.
 * @param {Object} task - Task object.
 * @returns {string} - HTML string.
 */
function renderSubtasksToEdit(task) {
  return buildSubtasksToEditHTML(task);
}

/**
 * Enables editing mode for a specific subtask.
 * @param {number|string} taskId - Task ID.
 * @param {number} subtaskIndex - Index of subtask to edit.
 */
function editSelectedSubtask(taskId, subtaskIndex) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  const subtask = task.subtasks[subtaskIndex];
  const subtaskElements = document.querySelectorAll('.edit-dialog-subtask');
  const container = subtaskElements[subtaskIndex];
  container.removeAttribute('onmouseenter');
  container.removeAttribute('onmouseleave');
  container.classList.remove('hover');
  container.innerHTML = buildEditSubtaskHTML(task, subtaskIndex, subtask);
}

/**
 * Shows subtask edit/delete buttons on hover.
 * @param {HTMLElement} element - DOM element of the subtask.
 */
function mouseOverSubtaskEdit(element) {
  const btns = element.querySelector('.subtask-list-item-btns');
  btns.classList.remove('subtask-icons-d-none');
}

/**
 * Hides subtask buttons on mouse leave.
 * @param {HTMLElement} element - DOM element of the subtask.
 */
function mouseLeaveSubtaskEdit(element) {
  const btns = element.querySelector('.subtask-list-item-btns');
  btns.classList.add('subtask-icons-d-none');
}

/**
 * Deletes a subtask from a task.
 * @param {number|string} taskId - Task ID.
 * @param {number} subtaskIndex - Index of the subtask to delete.
 */
function deleteSelectedTask(taskId, subtaskIndex) {
  const container = document.getElementById('subtasksList');
  const task = tasks.find(t => String(t.id) === String(taskId));
  task.subtasks.splice(subtaskIndex, 1);
  container.innerHTML = renderSubtasksToEdit(task);
}

/**
 * Saves changes made to a subtask title.
 * @param {number|string} taskId - Task ID.
 * @param {number} subtaskIndex - Index of the subtask to save.
 */
function saveSelectedTask(taskId, subtaskIndex) {
  const inputElement = document.getElementById('inputSubtaskEdit');
  const input = inputElement.value.trim();
  const saveBtn = document.getElementById('saveBtn');
  if (!input) {
    saveBtn.disabled = true;
    return;
  }
  const task = tasks.find(t => String(t.id) === String(taskId));
  const container = document.getElementById('subtasksList');
  task.subtasks[subtaskIndex].title = input;
  container.innerHTML = renderSubtasksToEdit(task);
}


/**
 * Saves all input values from the edit form to the task object.
 * @param {number|string} taskId - Task ID.
 */
function saveEditInputFields(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  const titleInput = document.getElementById(`editedTitle-${taskId}`).value;
  const descriptionInput = document.getElementById(`editedDescription-${taskId}`).value;
  const dateInput = document.getElementById(`editedDate-${taskId}`).value;
  task.title = titleInput;
  task.description = descriptionInput;
  task.due_date = dateInput;
  task.priority = selectedPrioritys;
  if (selectedContactsNames && selectedContactsNames.length > 0) {
    if (!task.assigned_to) {
      task.assigned_to = [];
    }
    selectedContactsNames.forEach(name => {
      if (!task.assigned_to.includes(name)) {
        task.assigned_to.push(name);
      }
    });
  }
}

/**
 * Updates task data in Firebase using PUT request.
 * @param {number|string} taskId - Task ID.
 */
async function updateTaskDatainAPI(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  const dateInputId = `editedDate-${taskId}`;
  const titleInputId = `editedTitle-${taskId}`;
  const isValidTitle = isTitleValid(titleInputId);
  const isValidDate = isDueDateValid(dateInputId);
  if (!isValidDate || !isValidTitle) return;
  saveEditInputFields(taskId);
  try {
    await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/tasks/${task.id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.error("Fehler beim Schreiben in die Datenbank:", error);
  }
  removeEditDialog();
  renderCards(tasks);
  hideProgressBarsForTasksWithoutSubtasks(tasks)
}

/**
 * Hides the edit task dialog.
 */
function removeEditDialog() {
  let container = document.querySelector('.dialog-container');
  container.classList.add('d-none-edit-dialog');
}

/**
 * Adds a new subtask to a task based on input field value.
 * @param {number|string} taskId - Task ID.
 */
function addNewSubtaskToList(taskId) {
  const inputContainer = document.querySelector('.btns-new-subtask');
  const task = tasks.find(t => String(t.id) === String(taskId));
  const text = document.getElementById('newSubtaskInput').value;
  const container = document.getElementById('subtasksList');
  const maxSubtaskId = task.subtasks.reduce((max, subtask) => {
    return Math.max(max, parseInt(subtask.id) || 0);
  }, 0);
  const newSubtaskId = maxSubtaskId + 1
  if (!text) return;
  const subtaskObject = {
    id: newSubtaskId.toString(),
    taskId: taskId,
    title: text,
    completed: false
  };
  task.subtasks.push(subtaskObject);
  document.getElementById('newSubtaskInput').value = '';
  container.innerHTML = renderSubtasksToEdit(task);
  inputContainer.classList.add('visibility-hidden');
}

/**
 * Shows the buttons for confirming/canceling new subtask addition.
 */
function showBtnToAddSubtask() {
  const container = document.querySelector('.btns-new-subtask');
  container.classList.remove('visibility-hidden');
}

/**
 * Cancels subtask creation and resets input field.
 */
function cancelBtnAddSubtask() {
  const container = document.querySelector('.btns-new-subtask');
  const input = document.getElementById('subtaskContainer');
  document.getElementById('newSubtaskInput').value = '';
  container.classList.add('visibility-hidden');
  input.classList.remove('blue-border-input');
}

/**
 * Adds a new subtask when Enter key is pressed.
 * @param {number|string} taskId - Task ID.
 */
function createSubtaskOnEnter(taskId) {
  if (event.key === "Enter") {
    addNewSubtaskToList(taskId)
    showBtnToAddSubtask();
  }
}

/**
 * Validates if the due date in the input field is within acceptable range.
 * Shows an error if the date is in the past or exceeds the year 2130.
 *
 * @param {string} inputId - The ID of the input element containing the date.
 * @returns {boolean} True if the date is valid, false otherwise.
 */
function isDueDateValid(inputId) {
  const input = document.getElementById(inputId);
  const errorMessageId = `${inputId}-error`;
  const today = new Date().toISOString().split("T")[0];
  let existingError = document.getElementById(errorMessageId);
  if (existingError) existingError.remove();
  const inputDate = new Date(input.value);
  const inputYear = inputDate.getFullYear();
  if (input.value < today) {
    showDateError(input, errorMessageId, "Date cannot be in the past");
    return false;
  }
  if (inputYear > 2130) {
    showDateError(input, errorMessageId, "The selected date exceeds the maximum allowed year (2130)");
    return false;
  }
  return true;
}

/**
 * Displays a styled error message below an input element.
 *
 * @param {HTMLInputElement} input - The input element where the error occurred.
 * @param {string} errorMessageId - The ID to assign to the error message element.
 * @param {string} message - The error message text to display.
 */
function showDateError(input, errorMessageId, message) {
  const errorText = document.createElement("p");
  errorText.id = errorMessageId;
  errorText.textContent = `${message}`;
  errorText.style.color = "red";
  errorText.style.fontSize = "0.85rem";
  errorText.style.marginTop = "4px";
  input.insertAdjacentElement("afterend", errorText);
}

/**
 * Validates if the input field contains a non-empty title.
 * Shows an error message if the field is empty or contains only whitespace.
 *
 * @param {string} inputId - The ID of the input element to validate.
 * @returns {boolean} True if the title is valid, false otherwise.
 */
function isTitleValid(inputId) {
  const input = document.getElementById(inputId);
  const errorMessageId = `${inputId}-error`;
  let existingError = document.getElementById(errorMessageId);
  if (existingError) existingError.remove();
  if (!input.value.trim()) {
    const errorText = document.createElement("p");
    errorText.id = errorMessageId;
    errorText.textContent = "This field is required";
    errorText.style.color = "red";
    errorText.style.fontSize = "0.85rem";
    errorText.style.marginTop = "4px";
    input.insertAdjacentElement("afterend", errorText);
    return false;
  }

  return true;
}