function getCardsTemplate(task) {
    return `
    <div draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
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