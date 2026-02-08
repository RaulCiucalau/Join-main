/**
 * Returns the HTML string for the "Task added to board" log message.
 * @returns {string} HTML for the log message.
 */
function getLogHtml() {
  return `
    <div class="added-to-board-msg">
      <p>Task added to board</p>
      <img src="./assets/icons/added-to-board.svg" alt="Board image" />
    </div>
  `;
}

/**
 * Generates a dropdown item HTML string for a contact selection list.
 *
 * @param {number} i - Index of the contact in the global `contacts` array.
 * @returns {string} HTML string for a contact dropdown list item.
 */
function contactListDropDownTemplate(i) {
  return `<div class="contactListElement" id="${i}" onclick="toggleContactSelection(${i})">
              <div class="contact">
              <span class="avatar" style="background-color: ${contacts[i].color}">${contacts[i].avatar}</span>
              <span>${contacts[i].name}</span>
              </div>
              <div><img id="btn-checkbox-${i}" src="/assets/icons/btn-unchecked.svg" alt="Button Unchecked"/></div>
              </div>`;
}

/**
 * Generates the HTML for a subtask item in view mode.
 * @param {Object} subtaskObject - The subtask object containing at least a title property.
 * @returns {string} HTML string for the subtask item.
 */
function getSubtaskHtml(subtaskObject) {
  return `
    <span class="subtask-text">• ${subtaskObject.title}</span>
    <div class="subtask-list-item-btns dp-none">
      <img src="/assets/icons/edit.svg" class="subtask-edit-icons" title="Edit">
      <img src="/assets/icons/delete.svg" class="subtask-edit-icons" title="Delete">
    </div>
  `
}

/**
 * Generates the HTML for a subtask item in edit mode.
 * @param {string} currentText - The current text of the subtask being edited.
 * @returns {string} HTML string for the editable subtask item.
 */
function getEditSubtaskHtml(currentText) {
  return `
    <input type="text" class="subtask-edit-input" value="${currentText}">
    <div class="subtask-list-item-btns">
      <img src="./assets/icons/delete.svg" class="subtask-edit-icons" title="Delete">
      <div class="subtask-list-item-separator-2"></div>
      <img src="./assets/icons/check.svg" class="subtask-edit-icons" title="Save">
    </div>
  `
}

/**
 * Generates the HTML template for a category dropdown item.
 * @param {number} indexCategory - The index of the category in the array.
 * @returns {string} - The HTML string for the category dropdown item.
 */
function categoryDropDownTemplate(indexCategory) {
  return `<div class="categoryListElement" onclick="selectCategory(${indexCategory})">
            <span class="category">${category[indexCategory]}</span>
            </div>`;
}