/**
 * Generates the HTML template for a task card displayed on the board.
 *
 * @param {Object} task - The task object containing details to render.
 * @param {string} task.id - Unique task ID.
 * @param {string} task.category - Task category (used for label).
 * @param {string} task.title - Title of the task.
 * @param {string} task.description - Description of the task.
 * @param {Array} task.subtasks - Array of subtasks for the task.
 * @param {Array} task.assigned_to - Array of assigned user objects.
 * @param {string} task.priority - Priority level ('Urgent', 'Medium', etc.).
 * @returns {string} HTML string representing the task card.
 */
function getCardsTemplate(task) {
    return `
    <div id="dragTask${task.id}" draggable="true" ondragstart="startDragging('${task.id}')" class="task-card" onclick="openBigTaskDialogById('${task.id}')">
        <div class="status-card">
            <div class="${getLabelClass(task.category)} typography-label">${task.category}</div>
            <div class="card-text">
                <p class="typography-card-title">${task.title}</p>
                <p class="typography-card-subtitle">${task.description}</p>
            </div>
            <div id="progressBarContainer-${task.id}" class="progress-container">
                <div class="progress-bar-container">
                    <div id="progressBar-${task.id}" class="progress-bar" style="width: ${getProgressPercentage(task.subtasks)}%;"></div>
                </div>
                <p id="progress-bar-text-${task.id}" class="progress-text">${getProgressText(task.subtasks)}</p>
            </div>
            <div class="contacts-priority-container">
                <div class="contacts-container">
                    ${renderAssignedContacts(task.assigned_to)}
                </div>
                ${renderPriority(task.priority)}
            </div>
        </div>
    </div>
    `;
}

/**
 * Returns the HTML template for the full-screen dialog view of a task.
 *
 * @param {Object} task - The task object containing details to render.
 * @returns {string} HTML string for the detailed task dialog view.
 */
function getBigTaskDialog(task) {
    return `
    <div onclick="stopPropagation(event)" id="bigDialog" class="dialog-card">
        <div class="dialog-card-header">
            <label class="${getLabelClass(task.category)} typography-label">${task.category}</label>
            <img onclick="toggleBigTaskDialog()" class="close-btn" src="../assets/img/board_icons/close_button.svg" alt="Close">
        </div>
        <div class="dialog-card-content">
            <p class="dialog-card-title">${task.title}</p>
            <p class="dialog-card-typography-content margin-bottom24">${task.description}</p>
            <div class="dialog-card-date-section margin-bottom24">
                <p class="dialog-card-typography-content font-blue">Due date:</p>
                <p class="dialog-card-typography-content">${task.due_date}</p>
            </div>
            <div class="dialog-card-priority-section margin-bottom24">
                <p class="dialog-card-typography-content font-blue">Priority:</p>
                <div class="dialog-card-priority-type">
                    <p class="dialog-card-typography-content">${task.priority}</p>
                    <img src="../assets/img/board_icons/priority_${task.priority.toLowerCase()}.svg" alt="Priority ${task.priority}">
                </div>
            </div>
            <div class="dialog-card-contacts">
                <p class="dialog-card-typography-content font-blue margin-bottom8">Assigned To:</p>
                <div class="dialog-card-contacts-list">
                    ${renderAssignedContactsBigDialog(task.assigned_to)}
                </div>
            </div>
            <div class="dialog-card-subtasks">
                <p class="dialog-card-typography-content font-blue margin-bottom8">Subtasks</p>
                ${renderSubtasks(task)}
            </div>
        </div>
        <div class="dialog-card-btns-bottom">
            <div class="dialog-card-btn" onclick="deleteTaskById('${task.id}')">
                <img class="" src="../assets/img/board_icons/delete_button.svg" alt="Delete">
                <p>Delete</p>
            </div>
            <div class="dialog-card-separator"></div>
            <div class="dialog-card-btn" onclick="openEditTaskDialogById('${task.id}')">
                <img class="" src="../assets/img/board_icons/edit_button.svg" alt="Edit">
                <p>Edit</p>
            </div>
        </div>
    </div>
    `;
}

/**
 * Creates a contact selection item with a checkbox for assignment.
 *
 * @param {Object} contact - Contact object.
 * @param {number} index - Index of the contact in the list.
 * @param {boolean} isAssigned - Whether the contact is already assigned.
 * @param {string|number} taskId - Task ID to link contact selection.
 * @returns {string} HTML string representing the contact item.
 */
function contactListTemplate(contact, index, isAssigned, taskId) {
    const checkboxIcon = isAssigned ? "btn-checked.svg" : "btn-unchecked.svg";
    return `
    <div id="contactId${index}" class="contactListElement" onclick="toggleContactChosed(${index}, '${taskId}')">
        <div class="contact">
            <span class="avatar" style="background-color: ${contact.color}">${contact.avatar}</span>
            <span id="contactName${index}">${contact.name}</span>
        </div>
        <img id="checkBox${index}" src="../assets/icons/${checkboxIcon}" alt="checkbox">
    </div>
  `;
}

/**
 * Generates the HTML template for the editable task dialog window.
 *
 * @param {Object} task - The task object to populate the edit form.
 * @param {string} task.id - Unique ID of the task.
 * @param {string} task.title - Task title to prefill in the form.
 * @param {string} task.description - Task description.
 * @param {string} task.due_date - Due date of the task.
 * @param {string} task.priority - Priority level ('Urgent', 'Medium', 'Low').
 * @param {Array} task.assigned_to - Array of assigned user objects.
 * @param {Array} task.subtasks - Array of subtask objects.
 * @returns {string} HTML string for the editable task dialog.
 */
function getEditTaskDialog(task) {
    return `
    <div onclick="stopPropagation(event)" id="editDialog" class="dialog-card">
            <div class="dialog-card-header flex-end">
                <img onclick="toggleEditTaskDialog()" class="close-btn" src="../assets/img/board_icons/close_button.svg" alt="">
            </div>
            <div class="content-edit-task-dialog">
                <div class="dialog-edit-title">
                    <p class="dialog-card-typography-content font-blue">Title</p>
                    <input id="editedTitle-${task.id}" value="${task.title}" class="standard-input-edit-task hover-active-border" type="text" required>
                </div>
                <div class="dialog-edit-description">
                    <p class="dialog-card-typography-content font-blue">Description</p>
                    <textarea id="editedDescription-${task.id}" class="description-input-edit-task hover-active-border" cols="60" rows="20"
                        name="content">${task.description}</textarea>
                </div>
                <div class="dialog-edit-due-date">
                    <p class="dialog-card-typography-content font-blue">Due Date</p>
                    <input id="editedDate-${task.id}" value="${task.due_date}" type="date" class="standard-input-edit-task hover-active-border" type="date" min="${new Date().toISOString().split('T')[0]}" max="2130-12-31" required>
                </div>
                <div class="dialog-edit-priority">
                    <div class="select-priority frame-39">
                        <label class="dialog-card-typography-content font-blue" for="priority">Priority</label>
                        <div class="priority-btns">
                            <div class="priority-btn" id="prios-btn-urgent" onclick="togglePrioritys('urgent')">
                                <p>Urgent</p>
                                <img id="prios-img-urgent" class="priority-img" src="../assets/icons/priority-urgent.svg"
                                    alt="Priority Urgent" />
                            </div>
                            <div class="priority-btn" id="prios-btn-medium" onclick="togglePrioritys('medium')">
                                <p>Medium</p>
                                <img id="prios-img-medium" class="priority-img" src="../assets/icons/priority-medium.svg"
                                    alt="Priority Medium" />
                            </div>
                            <div class="priority-btn" id="prios-btn-low" onclick="togglePrioritys('low')">
                                <p>Low</p>
                                <img id="prios-img-low" class="priority-img" src="../assets/icons/priority-low.svg"
                                    alt="Priority Low" />
                            </div>
                        </div>
                    </div>
                </div>   
                <div class="dialog-edit-assigned">
                    <div class="assigned-to-section frame-39">
                        <label class="dialog-card-typography-content font-blue">Assigned to</label>
                        <div class="assigned-to-input-container">
                            <input type="text" id="assignee-input" class="selection hover-border" placeholder="Select contacts to assign"
                                onclick="toggleAssigneeDropdown(event, ${task.id})" />
                            <img id="assignee-img-down" class="assigned-to-img"
                                src="../assets/icons/arrow_drop_down.svg" alt="Select contact dropdown arrow"
                                onclick="toggleAssigneeDropdown(event, ${task.id})">
                            <img id="assignee-img-up" class="assigned-to-img dp-none"
                                src="../assets/icons/arrow_drop_down_up.svg" alt="Select contact dropdown arrow"
                                onclick="toggleAssigneeDropdown(event, ${task.id})">
                        </div>
                        <div class="drop-down-contact-list dp-none" id="assignee-dropdown-list">
                        </div>
                        <div id="assignee-selected-avatars">
                        </div>
                    </div>
                </div>
                <div class="dialog-edit-subtasks">
                    <p class="dialog-card-typography-content font-blue">Subtasks</p>
                    <div id="subtaskContainer" class="input-container-add-subtask hover-active-border">
                        <input onkeydown="createSubtaskOnEnter(${task.id})" onclick="showBtnToAddSubtask()" id="newSubtaskInput" class="noborder-input standard-input-edit-task" type="text" placeholder="Add new Subtask">
                        <div class="btns-new-subtask visibility-hidden">
                            <img onclick="cancelBtnAddSubtask()" src="../assets/icons/cancel.svg" class="subtask-edit-page-icons pointer" title="Cancel">
                            <img onclick="addNewSubtaskToList(${task.id})" src="../assets/icons/check.svg" class="subtask-edit-page-icons pointer" title="Save">
                        </div>
                    </div>
                    <div id="subtasksList" class="subtasks-list-container">
                        ${renderSubtasksToEdit(task)}
                    </div>
                </div>
            </div>
            <div class="edit-task-btn-container">
                <svg onclick="updateTaskDatainAPI(${task.id})" class="edit-task-ok-btn" width="90" height="58" viewBox="0 0 90 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect class="hover-blue-svg" x="0.682129" y="0.396729" width="89" height="57" rx="10" fill="#2A3647"/>
                    <path d="M32.0443 28.7604C32.0443 30.4258 31.7286 31.8428 31.0973 33.0111C30.4708 34.1794 29.6157 35.0718 28.5319 35.6883C27.4531 36.2998 26.24 36.6055 24.8927 36.6055C23.5355 36.6055 22.3174 36.2973 21.2386 35.6808C20.1598 35.0643 19.3071 34.1719 18.6807 33.0036C18.0543 31.8353 17.7411 30.4209 17.7411 28.7604C17.7411 27.0949 18.0543 25.678 18.6807 24.5097C19.3071 23.3413 20.1598 22.4514 21.2386 21.8399C22.3174 21.2234 23.5355 20.9152 24.8927 20.9152C26.24 20.9152 27.4531 21.2234 28.5319 21.8399C29.6157 22.4514 30.4708 23.3413 31.0973 24.5097C31.7286 25.678 32.0443 27.0949 32.0443 28.7604ZM28.7706 28.7604C28.7706 27.6815 28.609 26.7717 28.2858 26.031C27.9676 25.2902 27.5177 24.7284 26.936 24.3456C26.3544 23.9628 25.6733 23.7714 24.8927 23.7714C24.1122 23.7714 23.4311 23.9628 22.8494 24.3456C22.2677 24.7284 21.8153 25.2902 21.4921 26.031C21.174 26.7717 21.0149 27.6815 21.0149 28.7604C21.0149 29.8392 21.174 30.749 21.4921 31.4898C21.8153 32.2305 22.2677 32.7923 22.8494 33.1751C23.4311 33.558 24.1122 33.7494 24.8927 33.7494C25.6733 33.7494 26.3544 33.558 26.936 33.1751C27.5177 32.7923 27.9676 32.2305 28.2858 31.4898C28.609 30.749 28.7706 29.8392 28.7706 28.7604ZM37.2552 33.1006L37.2627 29.2898H37.725L41.394 24.9422H45.0407L40.1114 30.6993H39.3582L37.2552 33.1006ZM34.3766 36.3967V21.124H37.5535V36.3967H34.3766ZM41.5357 36.3967L38.165 31.4077L40.2829 29.1631L45.257 36.3967H41.5357Z" fill="white"/>
                    <mask id="mask0_75609_16286" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="49" y="16" width="25" height="25">
                        <rect x="49.6821" y="16.8967" width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_75609_16286)">
                        <path d="M59.2328 32.0467L67.7078 23.5717C67.9078 23.3717 68.1453 23.2717 68.4203 23.2717C68.6953 23.2717 68.9328 23.3717 69.1328 23.5717C69.3328 23.7717 69.4328 24.0092 69.4328 24.2842C69.4328 24.5592 69.3328 24.7967 69.1328 24.9967L59.9328 34.1967C59.7328 34.3967 59.4995 34.4967 59.2328 34.4967C58.9662 34.4967 58.7328 34.3967 58.5328 34.1967L54.2328 29.8967C54.0328 29.6967 53.937 29.4592 53.9453 29.1842C53.9537 28.9092 54.0578 28.6717 54.2578 28.4717C54.4578 28.2717 54.6953 28.1717 54.9703 28.1717C55.2453 28.1717 55.4828 28.2717 55.6828 28.4717L59.2328 32.0467Z" fill="white"/>
                    </g>
                </svg>
            </div>
    `
}
