/**
 * Builds HTML for editable subtasks with edit/delete buttons.
 * @param {Object} task - Task object containing subtasks.
 * @returns {string} - HTML string of subtasks ready for edit.
 */
function buildSubtasksToEditHTML(task) {
  return task.subtasks.map((subtask, index) => `
    <div 
      onmouseenter="mouseOverSubtaskEdit(this)" 
      onmouseleave="mouseLeaveSubtaskEdit(this)" 
      id="dialogSubtaskEdit" 
      class="edit-dialog-subtask hover"
    >
      <span class="subtask-text">• ${subtask.title}</span>
      <div id="subtaskEditBtns" class="subtask-list-item-btns subtask-icons-d-none">
        <img 
          onclick="editSelectedSubtask(${task.id}, ${index})" 
          src="./assets/icons/edit.svg" 
          class="subtask-edit-page-icons pointer" 
          title="Edit"
        >
        <img 
          onclick="deleteSelectedTask(${task.id}, ${index})" 
          src="./assets/icons/delete.svg" 
          class="subtask-edit-page-icons pointer" 
          title="Delete"
        >
      </div>
    </div>
  `).join('');
}

/**
 * Builds HTML for editing a specific subtask in-place.
 * @param {Object} task - The full task object.
 * @param {number} subtaskIndex - Index of the subtask being edited.
 * @param {Object} subtask - The subtask object itself.
 * @returns {string} - HTML string for the subtask edit input and buttons.
 */
function buildEditSubtaskHTML(task, subtaskIndex, subtask) {
  return `
    <div class="input-container-subtask">
      <input id="inputSubtaskEdit" type="text" class="subtask-edit-input" value="${subtask.title}">
      <div class="subtask-list-item-btns">
        <img 
          onclick="deleteSelectedTask(${task.id}, ${subtaskIndex})" 
          src="./assets/icons/delete.svg" 
          class="subtask-edit-page-icons pointer" 
          title="Delete"
        >
        <img
          id="saveBtn" 
          onclick="saveSelectedTask(${task.id}, ${subtaskIndex})" 
          src="./assets/icons/check.svg" 
          class="subtask-edit-page-icons pointer" 
          title="Save"
        >
      </div>
    </div>    
  `;
}