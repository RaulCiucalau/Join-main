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
  const task = tasks.find(t => t.id == taskId);
  if (!contact || !task) return;
  if (!task.assigned_to) task.assigned_to = [];
  const contactName = contact.name;
  const isAssigned = task.assigned_to.includes(contactName);
  const contactText = document.getElementById(`contactName${index}`);
  const contactElement = document.getElementById(`contactId${index}`);
  const checkBoxIcon = document.getElementById(`checkBox${index}`);
  isAssigned ? unassignContact(task, contactName, contactText, contactElement, checkBoxIcon)
             : assignContact(task, contactName, contactText, contactElement, checkBoxIcon);
  renderChosenAvatars(taskId);
}

/**
 * Removes a contact from the task and updates the UI.
 */
function unassignContact(task, name, textEl, containerEl, iconEl) {
  const pos = task.assigned_to.indexOf(name);
  task.assigned_to.splice(pos, 1);
  textEl.style.color = "black";
  containerEl.style.backgroundColor = "white";
  iconEl.src = "../assets/icons/btn-unchecked.svg";
}

/**
 * Adds a contact to the task and updates the UI.
 */
function assignContact(task, name, textEl, containerEl, iconEl) {
  task.assigned_to.push(name);
  textEl.style.color = "white";
  containerEl.style.backgroundColor = "#2a3647";
  iconEl.src = "../assets/icons/btn-checked.svg";
}


/**
 * Renders the selected avatars for a given task.
 * @param {string|number} taskId - The ID of the task.
 */
function renderChosenAvatars(taskId) {
  const container = document.getElementById("assignee-selected-avatars");
  container.innerHTML = "";
  const task = getTaskById(taskId);
  if (!task || !Array.isArray(task.assigned_to)) return;
  const visibleContacts = getVisibleContacts(task);
  const avatarHtml = generateAvatarHtml(visibleContacts);
  const extraCount = visibleContacts.length - 4;
  container.innerHTML = avatarHtml + generateExtraAvatar(extraCount);
}


/**
 * Retrieves a task by its ID.
 * @param {string|number} taskId - The ID of the task to find.
 * @returns {Object|undefined} The task object if found, otherwise undefined.
 */
function getTaskById(taskId) {
  return tasks.find(t => String(t.id) === String(taskId));
}


/**
 * Filters contacts that are assigned to the given task.
 * @param {Object} task - The task object with the assigned_to field.
 * @returns {Array<Object>} A list of matching contact objects.
 */
function getVisibleContacts(task) {
  return contacts.filter(contact => task.assigned_to.includes(contact.name));
}

/**
 * Generates HTML for up to 4 contact avatars.
 * @param {Array<Object>} contacts - List of contact objects.
 * @returns {string} HTML string for the avatars.
 */
function generateAvatarHtml(contacts) {
  return contacts
    .slice(0, 4)
    .map(contact =>
      `<div class="selected-avatars" style="background-color:${contact.color};">${contact.avatar}</div>`
    )
    .join("");
}

/**
 * Generates HTML for the extra avatar count (e.g., "+2").
 * @param {number} extraCount - The number of extra contacts beyond 4.
 * @returns {string} HTML string for the extra avatar count or empty string.
 */
function generateExtraAvatar(extraCount) {
  return extraCount > 0
    ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>`
    : "";
}