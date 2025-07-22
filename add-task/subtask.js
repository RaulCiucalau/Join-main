/**
 * Array holding all subtasks for the current task.
 * @type {Array<Object>}
 */
let subtask = []; 
 
/**
 * Counter for generating unique subtask IDs.
 * @type {number}
 */
let subtaskIdCounter = 0; 
 
/**
 * The ID of the current task to which subtasks belong.
 * @type {number}
 */
let currentTaskId = 3;

document.addEventListener('DOMContentLoaded', () => {
  const { subtaskInput, cancelIcon, acceptIcon, separator, addIcon } = constSubtaskInput();
  initSubtaskInputListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon);
  initCancelIconListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon);
  initAcceptIconListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon);
});

/**
 * Initializes the input event listener for the subtask input field.
 */
function initSubtaskInputListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon) {
  subtaskInput.addEventListener('input', () => {
    if (subtaskInput.value.trim().length > 0) {
      showCancelAcceptIcons(cancelIcon, acceptIcon, separator, addIcon);
    } else {
      showAddIcon(cancelIcon, acceptIcon, separator, addIcon);
    }
  });
}

/**
 * Initializes the click event listener for the cancel icon.
 */
function initCancelIconListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon) {
  cancelIcon.addEventListener('click', () => {
    subtaskInput.value = '';
    showAddIcon(cancelIcon, acceptIcon, separator, addIcon);
  });
}

/**
 * Initializes the click event listener for the accept icon.
 */
function initAcceptIconListener(subtaskInput, cancelIcon, acceptIcon, separator, addIcon) {
  acceptIcon.addEventListener('click', () => {
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText.length > 0) {
      addSubtaskToList(subtaskText);
      subtaskInput.value = '';
      showAddIcon(cancelIcon, acceptIcon, separator, addIcon);
    }
  });
}

/**
 * Shows only the add icon and hides cancel, accept, and separator icons for the subtask input.
 * @param {HTMLElement} cancelIcon - The cancel icon element.
 * @param {HTMLElement} acceptIcon - The accept icon element.
 * @param {HTMLElement} separator - The separator element.
 * @param {HTMLElement} addIcon - The add icon element.
 */
function showAddIcon(cancelIcon, acceptIcon, separator, addIcon) {
  cancelIcon.classList.add('dp-none');
  acceptIcon.classList.add('dp-none');
  separator.classList.add('dp-none');
  addIcon.classList.remove('dp-none');
}

/**
 * Shows cancel and accept icons, hides add icon.
 * @param {HTMLElement} cancelIcon
 * @param {HTMLElement} acceptIcon
 * @param {HTMLElement} separator
 * @param {HTMLElement} addIcon
 */
function showCancelAcceptIcons(cancelIcon, acceptIcon, separator, addIcon) {
  cancelIcon.classList.remove('dp-none');
  acceptIcon.classList.remove('dp-none');
  separator.classList.remove('dp-none');
  addIcon.classList.add('dp-none');
}

/**
 * Returns references to subtask input and icon elements.
 * @returns {{subtaskInput: HTMLElement, cancelIcon: HTMLElement, acceptIcon: HTMLElement, separator: HTMLElement, addIcon: HTMLElement}}
 */
function constSubtaskInput() {
  const subtaskInput = document.getElementById('subtask');
  const cancelIcon = document.getElementById('cancel-task-img');
  const acceptIcon = document.getElementById('accept-task-img');
  const separator = document.getElementById('small-separator');
  const addIcon = document.getElementById('add-subtask-img');
  return { subtaskInput, cancelIcon, acceptIcon, separator, addIcon };
}


/**
 * Adds a new subtask to the list and renders it.
 * @param {string} text - The subtask text.
 */
function addSubtaskToList(text) {
  const subtaskObject = createSubtaskObject(text);
  subtask.push(subtaskObject);
  subtaskIdCounter++;
  const item = createSubtaskElement(subtaskObject);
  addSubtaskEventListeners(item, subtaskObject);
  document.getElementById('subtask-list').appendChild(item);
}

/**
 * Creates a subtask object.
 * @param {string} text - The subtask text.
 * @returns {Object} The subtask object.
 */
function createSubtaskObject(text) {
  return {
    id: subtaskIdCounter.toString(),
    taskId: currentTaskId.toString(),
    title: text,
    completed: false
  };
}

/**
 * Creates the DOM element for a subtask.
 * @param {Object} subtaskObject - The subtask object.
 * @returns {HTMLElement} The subtask DOM element.
 */
function createSubtaskElement(subtaskObject) {
  const item = document.createElement('div');
  item.className = 'subtask-list-item';
  item.innerHTML = getSubtaskHtml(subtaskObject);
  return item;
}

/**
 * Adds event listeners for edit, delete, mouseenter, and mouseleave to a subtask DOM element.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */
function addSubtaskEventListeners(item, subtaskObject) {
  const list = document.getElementById('subtask-list');
  const btnContainer = item.querySelector('.subtask-list-item-btns');
  const editBtn = btnContainer.querySelector('img[title="Edit"]');
  const deleteBtn = btnContainer.querySelector('img[title="Delete"]');
  item.addEventListener('mouseenter', () => btnContainer.classList.remove('dp-none'));
  item.addEventListener('mouseleave', () => btnContainer.classList.add('dp-none'));
  deleteBtn.addEventListener('click', () => {
    list.removeChild(item);
    subtask = subtask.filter(s => s.id !== subtaskObject.id);
  });
  editBtn.addEventListener('click', () => enterEditMode(item, subtaskObject));
}

/**
 * Switches a subtask DOM element to edit mode and handles save/delete actions.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */

/**
 * Switches a subtask DOM element to edit mode and binds save/delete actions.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */
function enterEditMode(item, subtaskObject) {
  renderEditSubtask(item, subtaskObject.title);
  bindEditSubtaskEvents(item, subtaskObject);
}

/**
 * Renders the edit mode UI for a subtask.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {string} currentText - The current subtask text.
 */
function renderEditSubtask(item, currentText) {
  item.innerHTML = getEditSubtaskHtml(currentText);
}

/**
 * Binds save and delete events for a subtask in edit mode.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */
function bindEditSubtaskEvents(item, subtaskObject) {
  const list = document.getElementById('subtask-list');
  const saveBtn = item.querySelector('img[title="Save"]');
  const deleteBtnEdit = item.querySelector('img[title="Delete"]');
  const input = item.querySelector('input');
  saveBtn.addEventListener('click', () => saveEditedSubtask(input, item, subtaskObject));
  deleteBtnEdit.addEventListener('click', () => deleteEditedSubtask(item, subtaskObject));
}

/**
 * Handles saving an edited subtask.
 * @param {HTMLInputElement} input - The input element for the subtask text.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */
function saveEditedSubtask(input, item, subtaskObject) {
  const list = document.getElementById('subtask-list');
  const newText = input.value.trim();
  if (newText.length > 0) {
    const st = subtask.find(s => s.id === subtaskObject.id);
    if (st) st.title = newText;
    list.removeChild(item);
    addSubtaskToList(newText);
  }
}

/**
 * Handles deleting a subtask in edit mode.
 * @param {HTMLElement} item - The subtask DOM element.
 * @param {Object} subtaskObject - The subtask object.
 */
function deleteEditedSubtask(item, subtaskObject) {
  const list = document.getElementById('subtask-list');
  list.removeChild(item);
  subtask = subtask.filter(s => s.id !== subtaskObject.id);
}

/**
 * Returns the array of current subtasks for the task being edited or created.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getSubtasksArray() {
  return subtask;
}
