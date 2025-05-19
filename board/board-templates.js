function getCardsTemplate(task) {
    return `
    <div draggable="true" ondragstart="startDragging('${task.id}')" class="task-card" onclick="openBigTaskDialogById('${task.id}')">
        <div class="status-card">
            <div class="${getLabelClass(task.category)} typography-label">${task.category}</div>
            <div class="card-text">
                <p class="typography-card-title">${task.title}</p>
                <p class="typography-card-subtitle">${task.description}</p>
            </div>
            <div class="progress-container">
                <div class="progress-bar-container">
                    <div id="progressBarId" class="progress-bar" style="width: ${getProgressPercentage(task.subtasks)}%;"></div>
                </div>
                <p class="progress-text">${getProgressText(task.subtasks)}</p>
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

        <p class="dialog-card-title">${task.title}</p>
        <p class="dialog-card-typography-content">${task.description}</p>

        <div class="dialog-card-date-section">
            <p class="dialog-card-typography-content font-blue">Due date:</p>
            <p class="dialog-card-typography-content">${task.due_date}</p>
        </div>

        <div class="dialog-card-priority-section">
            <p class="dialog-card-typography-content font-blue">Priority:</p>
            <div class="dialog-card-priority-type">
                <p class="dialog-card-typography-content">${task.priority}</p>
                <img src="../assets/img/board_icons/priority_${task.priority.toLowerCase()}.svg" alt="Priority ${task.priority}">
            </div>
        </div>

        <div class="dialog-card-contacts">
            <p class="dialog-card-typography-content font-blue margin-bottom8">Assigned To:</p>
            <div class="dialog-card-contacts-list">
                ${renderAssignedContacts(task.assigned_to)}
            </div>
        </div>

        <div class="dialog-card-subtasks">
            <p class="dialog-card-typography-content font-blue margin-bottom8">Subtasks</p>
            ${renderSubtasks(task)}
        </div>

        <div class="dialog-card-btns-bottom">
            <div class="dialog-card-btn" onclick="deleteTask('${task.id}')">
                <img class="blue-filter" src="../assets/img/board_icons/delete_button.svg" alt="Delete">
                <p>Delete</p>
            </div>
            <div class="dialog-card-separator"></div>
            <div class="dialog-card-btn" onclick="editTask('${task.id}')">
                <img class="blue-filter" src="../assets/img/board_icons/edit_button.svg" alt="Edit">
                <p>Edit</p>
            </div>
        </div>
    </div>
    `;
}
