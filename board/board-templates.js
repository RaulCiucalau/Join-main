function getCardsTemplate(task) {
    return `
    <div id="dragTask${task.id}" draggable="true" ondragstart="startDragging('${task.id}')" class="task-card" onclick="openBigTaskDialogById('${task.id}')">
        <div class="status-card">
            <div class="${getLabelClass(task.category)} typography-label">${task.category}</div>
            <div class="card-text">
                <p class="typography-card-title">${task.title}</p>
                <p class="typography-card-subtitle">${task.description}</p>
            </div>
            <div class="progress-container">
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
                <img class="blue-filter" src="../assets/img/board_icons/delete_button.svg" alt="Delete">
                <p>Delete</p>
            </div>
            <div class="dialog-card-separator"></div>
            <div class="dialog-card-btn" onclick="openEditTaskDialogById('${task.id}')">
                <img class="blue-filter" src="../assets/img/board_icons/edit_button.svg" alt="Edit">
                <p>Edit</p>
            </div>
        </div>
    </div>
    `;
}

function contactListTemplate(contact, index, isAssigned) {
  const checkboxIcon = isAssigned ? "btn-checked.svg" : "btn-unchecked.svg";
  return `
    <div id="${index}" class="contact-item" onclick="toggleContactSelection(${index})">
        <span>${contact.name}</span>
        <img id="btn-checkbox-${index}" src="../assets/icons/${checkboxIcon}" alt="checkbox">
    </div>
  `;
}


function getEditTaskDialog(task) {
    return `
    <div onclick="stopPropagation(event)" id="editDialog" class="dialog-card">
            <div class="dialog-card-header flex-end">
                <img onclick="toggleEditTaskDialog()" class="close-btn" src="../assets/img/board_icons/close_button.svg" alt="">
            </div>
            <div class="content-edit-task-dialog">
                <div class="dialog-edit-title">
                    <p class="dialog-card-typography-content font-blue">Title</p>
                    <input id="editedTitle" value="${task.title}" class="standard-input-edit-task hover-active-border" type="text">
                </div>
                <div class="dialog-edit-description">
                    <p class="dialog-card-typography-content font-blue">Description</p>
                    <textarea id="editedDescription" class="description-input-edit-task hover-active-border" cols="60" rows="20"
                        name="content">${task.description}</textarea>
                </div>
                <div class="dialog-edit-due-date">
                    <p class="dialog-card-typography-content font-blue">Due Date</p>
                    <input id="editedDate" value="${task.due_date}" type="date" id="add-task-due-date"  class="standard-input-edit-task hover-active-border" type="text">
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
                        <input type="text" id="assignee-input" class="selection" placeholder="Select contacts to assign"
                        onclick="toggleAssigneeDropdown(event, ${task.id})" />
                        <img id="assignee-img-down" class="assigned-to-img dropdown-img"
                        src="../assets/icons/arrow_drop_down.svg" alt="Select contact dropdown arrow"
                        onclick="toggleAssigneeDropdown(event, ${task.id})">
                        <img id="assignee-img-up" class="assigned-to-img dropdown-img dp-none"
                        src="../assets/icons/arrow_drop_down_up.svg" alt="Select contact dropdown arrow"
                        onclick="toggleAssigneeDropdown(event, ${task.id})">
                        <div class="drop-down-contact-list dp-none" id="assignee-dropdown-list">
                        </div>
                        <div id="assignee-selected-avatars">
                        </div>
                    </div>
                </div>
                <div class="dialog-edit-subtasks">
                    <p class="dialog-card-typography-content font-blue">Subtasks</p>
                    <div class="input-container-add-subtask hover-active-border">
                        <input onclick="showBtnToAddSubtask()" id="newSubtaskInput" class="noborder-input standard-input-edit-task" type="text" placeholder="Add new Subtask">
                        <div class="btns-new-subtask visibility-hidden">
                            <img onclick="cancelBtnAddSubtask()" src="../assets/icons/cancel.svg" class="subtask-edit-page-icons pointer" title="Cancel">
                            <img onclick="addNewSubtaskToList(${task.id})" src="../assets/icons/check.svg" class="subtask-edit-page-icons pointer" title="Save">
                        </div>
                    </div>
                    <div id="subtasksList">
                        ${renderSubtasksToEdit(task)}
                    </div>
                </div>
            </div>
            <div class="edit-task-btn-container">
                <img onclick="updateTaskDatainAPI(${task.id})" class="edit-task-ok-btn" src="../assets/img/board_icons/edit_task_ok_btn.svg" alt="">
            </div>
        </div>
    `
}
