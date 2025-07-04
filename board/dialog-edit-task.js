let selectedContactsId = [];         // Stores selected contact indexes
let selectedContactsName = [];       // Stores selected contact names
let subtaskIdCount = 0;              // Counter for subtask IDs
let selectedPrioritys = "";          // Stores selected priority string
let currentTaskIds = null;           // ID of the task currently being edited
let subtaskIcons = document.querySelector('dialogSubtaskEdit'); // DOM reference (possible typo in selector)

/**
 * Renders the dropdown list of contacts for assignment to a specific task.
 * @param {number|string} taskId - ID of the task to assign contacts to.
 */
function renderAssigneeList(taskId) {
  const assignedTo = tasks[taskId]?.assigned_to || [];
  const container = document.getElementById("assignee-dropdown-list");
  container.innerHTML = "";
  if (!contacts || contacts.length === 0) return;
  resetSelectedContacts(taskId);
  contacts.forEach((contact, i) => {
    const isAssigned = assignedTo.includes(contact.name);
    container.innerHTML += contactListTemplate(contact, i, isAssigned, taskId);
    if (isAssigned) addToSelected(contact.name, i);
  });
  applySelectedStyles(taskId);
}

/**
 * Clears selected contacts arrays.
 */
function resetSelectedContacts() {
  selectedContactsId = [];
  selectedContactsNames = [];
}

/**
 * Adds a contact to the selected contacts arrays.
 * @param {string} name - Name of the contact.
 * @param {number} index - Index of the contact in the contacts array.
 */
function addToSelected(name, index) {
  selectedContactsId.push(index);
  selectedContactsName.push(name);
}

/**
 * Applies selected visual styles to contacts assigned to a task.
 * @param {number|string} taskId - Task ID.
 */
function applySelectedStyles(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (!task || !task.assigned_to) return;
  task.assigned_to.forEach(name => {
    const contactIndex = contacts.findIndex(c => c.name === name);
    if (contactIndex !== -1) {
      const el = document.getElementById(`contactId${contactIndex}`);
      const icon = document.getElementById(`checkBox${contactIndex}`);
      if (el && icon) {
        el.style.backgroundColor = "#2a3647";
        el.style.color = "white";
        icon.src = "../assets/icons/btn-checked.svg";
      }
    }
  });
}

/**
 * Toggles the visibility of the assignee dropdown list.
 * @param {Event} event - DOM event.
 * @param {number|string} taskId - ID of the task.
 */
function toggleAssigneeDropdown(event, taskId) {
  event.stopPropagation();
  const task = tasks[taskId];
  if (document.getElementById("assignee-img-up").classList.contains("dp-none")) {
    document.getElementById("assignee-img-up").classList.remove("dp-none");
    document.getElementById("assignee-img-down").classList.add("dp-none");
    document.getElementById("assignee-input").classList.add("border-show-menu");
    document.getElementById("assignee-input").classList.add("hover-border");
    document.getElementById("assignee-dropdown-list").classList.remove("dp-none");
    renderAssigneeList(taskId);
  } else {
    closeDropDownList();
    document.getElementById("assignee-input").classList.add("hover-border");
    document.getElementById("assignee-input").classList.remove("border-show-menu");
  }
}

/**
 * Closes the assignee dropdown and clears its content.
 */
function closeDropDownList() {
  document.getElementById("assignee-dropdown-list").classList.add("dp-none");
  document.getElementById("assignee-img-up").classList.add("dp-none");
  document.getElementById("assignee-img-down").classList.remove("dp-none");
  document.getElementById("assignee-dropdown-list").innerHTML = "";
}

/**
 * Toggles a contact’s assigned state (assign/unassign).
 * @param {number} index - Contact index.
 * @param {number|string} taskId - Task ID.
 */
function toggleContactChosed(index, taskId) {
  const contact = contacts[index];
  if (!contact) return;
  const task = tasks.find(t => t.id == taskId);
  if (!task) return;

  if (!task.assigned_to) {
    task.assigned_to = [];
  }
  const contactName = contact.name;
  const isAlreadyAssigned = task.assigned_to.includes(contactName);
  const contactText = document.getElementById(`contactName${index}`);
  const contactElement = document.getElementById(`contactId${index}`);
  const checkBoxIcon = document.getElementById(`checkBox${index}`);
  if (isAlreadyAssigned) {
    // Remove from assigned_to
    const pos = task.assigned_to.indexOf(contactName);
    task.assigned_to.splice(pos, 1);
    contactText.style.color = "black";
    contactElement.style.backgroundColor = "white";
    checkBoxIcon.src = "../assets/icons/btn-unchecked.svg";
  } else {
    // Add to assigned_to
    task.assigned_to.push(contactName);
    contactText.style.color = "white";
    contactElement.style.backgroundColor = "#2a3647";
    checkBoxIcon.src = "../assets/icons/btn-checked.svg";
  }
  renderChosenAvatars(taskId);
}

/**
 * Displays avatars of selected contacts under the assignee field.
 * @param {number|string} taskId - Task ID.
 */
function renderChosenAvatars(taskId) {
  const container = document.getElementById("assignee-selected-avatars");
  container.innerHTML = "";
  const task = tasks.find(t => String(t.id) === String(taskId));
   if (!task || !Array.isArray(task.assigned_to)) return;
  if (!task) return;
  const visibleContacts = contacts.filter(contact =>
    task.assigned_to.includes(contact.name)
  );
  const avatarHtml = visibleContacts
    .slice(0, 4)
    .map(contact =>
      `<div class="selected-avatars" style="background-color:${contact.color};">${contact.avatar}</div>`
    )
    .join("");
  const extraCount = visibleContacts.length - 4;
  container.innerHTML =
    avatarHtml +
    (extraCount > 0
      ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>`
      : "");
}

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
  const task = tasks.find(t => String(t.id) === String(taskId));
  const input = document.getElementById('inputSubtaskEdit').value;
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
