/**
 * Toggles the visibility of the big task dialog by adding/removing a CSS class.
 */
function toggleBigTaskDialog() {
    let bigDialog = document.getElementById('bigTaskDialog')
    bigDialog.classList.toggle('d-none-big-dialog');
}

/**
 * Closes the big task dialog with a fade-out animation.
 */
function closeBigDialog() {
    const container = document.getElementById('bigTaskDialog');
    container.classList.remove('open');
    container.classList.add('closing');
    setTimeout(() => {
        container.classList.remove('closing');
        container.classList.add('d-none-big-dialog')
    }, 100);
}

/**
 * Opens the big task dialog with fade-in animation.
 */
function openDialog() {
    const container = document.getElementById('bigTaskDialog');
    container.classList.remove('closing');
    container.classList.add('open');
    container.classList.remove('d-none-big-dialog');
}

/**
 * Opens a specific task dialog by task ID and fills it with task content.
 * If the task is not found, retries after a short delay (max 5 attempts).
 * @param {number|string} taskId - The ID of the task to display.
 * @param {number} [attempt=1] - Current attempt number.
 */
function openBigTaskDialogById(taskId, attempt = 1) {
    const task = tasks.find(task => String(task.id) === String(taskId));
    const bigDialog = document.getElementById('bigTaskDialog');
    if (!task) {
        if (attempt < 5) {
            setTimeout(() => openBigTaskDialogById(taskId, attempt + 1), 200);
        } else {
            bigDialog.innerHTML = getTaskNotFoundHtml();
        }
        return;
    }
    bigDialog.innerHTML = getBigTaskDialog(task);
    bigDialog.classList.remove('closing');
    bigDialog.classList.add('open');
    bigDialog.classList.remove('d-none-big-dialog');
}

/**
 * Prevents an event from bubbling up to parent elements.
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Returns a CSS class name based on the category name.
 * @param {string} category - The category name.
 * @returns {string} - A valid CSS class name.
 */
function getLabelClass(category) {
    return category.toLowerCase().replace(/\s+/g, '-') + '-label';
}

/**
 * Renders a compact list of up to 4 assigned contact avatars.
 * @param {string[]} assignedList - List of assigned contact names.
 * @returns {string} - HTML string of the avatar elements.
 */
function renderAssignedContacts(assignedList) {
    if (!Array.isArray(assignedList) || contacts.length === 0) return '';
    const visibleContacts = contacts.filter(c => assignedList.includes(c.name));
    const maxVisible = visibleContacts.slice(0, 4);
    const extraCount = visibleContacts.length - 4;
    return buildAssignedContactsHTML(maxVisible, extraCount);
}

/**
 * Renders full contact info for assigned contacts in the big dialog.
 * @param {string[]} assignedList - List of assigned contact names.
 * @returns {string} - HTML string of the contact items.
 */
function renderAssignedContactsBigDialog(assignedList) {
  if (!Array.isArray(assignedList)) return '';
  const contactList = assignedList
    .map(name => contacts.find(c => c.name === name))
    .filter(Boolean);
  return buildAssignedContactsBigDialogHTML(contactList);
}

/**
 * Renders a priority icon based on task priority.
 * @param {string} priority - Task priority (e.g., "Low", "Medium", "Urgent").
 * @returns {string} - HTML string of the priority icon.
 */
function renderPriority(priority) {
    const normalized = priority.toLowerCase();
    const validPriority = Object.keys(priorityImg).find(p => p.toLowerCase() === normalized);
    return getPriorityIconHtml(priorityImg[validPriority]);
}

/**
 * Renders a list of tasks into the big dialog container.
 * @param {Object[]} tasks - Array of task objects to render.
 */
function renderBigTaskDialog(tasks) {
    let container = document.getElementById('bigDialog');
    container.innerHTML = '';
    tasks.forEach(task => {
        container.innerHTML += getBigTaskDialog(task);
    });
}

/**
 * Renders subtasks for a given task.
 * @param {Object} task - The task object with subtasks.
 * @returns {string} - HTML string for the subtasks section.
 */
function renderSubtasks(task) {
  if (!task.subtasks || task.subtasks.length === 0) {
    return getNoSubtasksHtml();
  }
  return buildSubtasksHTML(task.subtasks);
}

/**
 * Deletes a task from the database using the task object.
 * @param {Object} task - The task object with an `id` property.
 */
async function deleteTask(task) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${task.id}.json`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Delete failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error while deleting task:', error);
    }
}

/**
 * Deletes a task by its ID and updates the UI accordingly.
 * @param {number|string} id - The ID of the task to delete.
 */
async function deleteTaskById(id) {
    await deleteTask({ id });
    const index = tasks.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    closeBigTaskDialog();
    renderCards(tasks);
}

/**
 * Closes the big task dialog immediately (no animation).
 */
function closeBigTaskDialog() {
    document.getElementById("bigTaskDialog").classList.add("d-none-big-dialog");
}