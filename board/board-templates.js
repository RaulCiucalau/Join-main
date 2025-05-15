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
                    <div class="progress-bar" style="width: 50%;"></div>
                </div>
                <p class="progress-text">1/2 Subtasks</p>
            </div>
            <div class="contacts-priority-container">
                <div class="contacts-container">
                    <img class="profile-badge" src="../assets/img/board_icons/badge_anja.svg" alt="Profile Badge">
                    <img class="profile-badge margin-left-contacts" src="../assets/img/board_icons/badge_david.svg" alt="Profile Badge">
                    <img class="profile-badge margin-left-contacts" src="../assets/img/board_icons/badge_eva.svg" alt="Profile Badge">
                </div>
                <img class="priority-symbol" src="../assets/img/board_icons/priority_urgent.svg" alt="Priority symbol">
            </div>
        </div>
    </div>
    `;
}