/**
 * Builds the HTML for the contact avatars and extra count badge.
 * @param {Array<Object>} visibleContacts - Contacts to display (max 4).
 * @param {number} extraCount - How many more contacts are hidden.
 * @returns {string} - HTML string.
 */
function buildAssignedContactsHTML(visibleContacts, extraCount) {
  const avatarsHtml = visibleContacts.map(contact => `
    <span class="profile-badge margin-left-contacts" style="background-color: ${contact.color}">${contact.avatar}</span>
  `).join('');

  const extraHtml = extraCount > 0
    ? `<span class="profile-badge margin-left-contacts extra-avatar-color">+${extraCount}</span>`
    : '';

  return avatarsHtml + extraHtml;
}

/**
 * Builds HTML for assigned contacts in big dialog view.
 * @param {Array<Object>} contactList - Array of contact objects to render.
 * @returns {string} - HTML string.
 */
function buildAssignedContactsBigDialogHTML(contactList) {
  return contactList.map(contact => `
    <div class="contact-item">
      <div class="avatar profile-badge" style="background-color: ${contact.color}">
        ${contact.avatar}
      </div>
      <span class="contact-name">${contact.name}</span>
    </div>
  `).join('');
}

/**
 * Builds HTML for subtasks with checkboxes.
 * @param {Array<Object>} subtasks - List of subtasks from a task.
 * @returns {string} - HTML string for rendering subtasks.
 */
function buildSubtasksHTML(subtasks) {
  return subtasks.map(subtask => {
    const isCompleted = subtask.completed === true;
    const checkboxIcon = isCompleted
      ? '../assets/img/board_icons/checked_button.svg'
      : '../assets/img/board_icons/unchecked_button.svg';

    return `
      <div class="dialog-card-subtask-checkbox">
        <img 
          class="checkbox-icon-task"
          data-task-id="${subtask.taskId}" 
          data-subtask-id="${subtask.id}" 
          onclick="toggleSubtaskCompletion(event)" 
          src="${checkboxIcon}" 
          alt="${isCompleted ? 'Checked' : 'Unchecked'} Button"
        >
        <p class="dialog-card-typography-content font-size-16">${subtask.title}</p>
      </div>
    `;
  }).join('');
}