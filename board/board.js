let profileBadges = {
    "Anton": "../assets/img/board_icons/badge_anton.svg",
    "Anja": "../assets/img/board_icons/badge_anja.svg",
    "Benedikt": "../assets/img/board_icons/badge_benedikt.svg",
    "David": "../assets/img/board_icons/badge_david.svg",
    "Eva": "../assets/img/board_icons/badge_eva.svg",
    "Emmanuel": "../assets/img/board_icons/badge_emmanuel.svg",
    "Marcel": "../assets/img/board_icons/badge_Marcel.svg",
    "Tatjana": "../assets/img/board_icons/badge_Tatjana.svg",
};
let priorityImg = {
    "Low": "../assets/img/board_icons/priority_low.svg",
    "Medium": "../assets/img/board_icons/priority_medium.svg",
    "Urgent": "../assets/img/board_icons/priority_urgent.svg"
}
const statusIds = [
    { id: "ToDo", label: "to do" },
    { id: "InProgress", label: "in progress" },
    { id: "AwaitFeedback", label: "awaiting feedback" },
    { id: "Done", label: "done" }
];
let currentDraggedTaskId;

async function init() {
    await onloadFunc();
    includeHTML();
    renderCards(tasks);
    renderBigTaskDialog(tasks);
}

function openAddTaskDialog() {
    let dialog = document.getElementById('addTaskDialog');
    dialog.classList.toggle('d-none');
}

function toggleAddTaskDialog() {
    let dialog = document.getElementById('addTaskDialog')
    dialog.classList.toggle('d-none');
}

function toggleBigTaskDialog() {
    let bigDialog = document.getElementById('bigTaskDialog')
    bigDialog.classList.toggle('d-none-big-dialog');
}

function openBigTaskDialogById(taskId) {
    const task = tasks.find(task => task.id === taskId);
    const bigDialog = document.getElementById('bigTaskDialog');
    bigDialog.innerHTML = getBigTaskDialog(task);
    bigDialog.classList.remove('d-none-big-dialog');
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderCards(tasks) {
    statusIds.forEach(({ id, label }) => {
        const container = document.getElementById(`status${id}`);
        container.innerHTML = '';
        const tasksArray = Object.values(tasks || {}).filter(task => task && task.status !== undefined);
        const filteredTasks = tasksArray.filter(task => task.status === id);
        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="task-card no-cursor-pointer">
                    <div class="empty-task dashed-border">No tasks ${label}</div>
                </div>
            `;
        } else {
            filteredTasks.forEach(task => {
                container.innerHTML += getCardsTemplate(task);
            });
        }
    });
}


function getLabelClass(category) {
    return category.toLowerCase().replace(/\s+/g, '-') + '-label';
}

function renderAssignedContacts(assignedList) {
    return assignedList
        .map(name => {
            const validName = Object.keys(profileBadges).find(badgeName => badgeName === name);
            return `<img class="profile-badge margin-left-contacts" src="${profileBadges[validName]}" alt="Profile Badge">`;
        })
        .join('');
}

function renderPriority(priority) {
    const validPriority = Object.keys(priorityImg).find(p => p === priority);
    return `<img class="priority-symbol" src="${priorityImg[validPriority]}" alt="Priority symbol">`
}

function getProgressPercentage(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completed / subtasks.length) * 100);
}

function getProgressText(subtasks) {
    if (!subtasks || subtasks.length === 0) return '0/0 Subtasks';
    const completed = subtasks.filter(subtask => subtask.completed).length;
    return `${completed}/${subtasks.length} Subtasks`;
}

function startDragging(taskId) {
    currentDraggedTaskId = taskId;
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-highlight");
}

function removeHighlight(event) {
    event.currentTarget.classList.remove("drag-highlight");
}

async function moveTo(event, newStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-highlight");
    const task = tasks.find(t => t.id === currentDraggedTaskId);
    if (task && task.status !== newStatus) {
        task.status = newStatus;
        await updateTaskInDatabase(task);
        renderCards(tasks);
    }
    currentDraggedTaskId = null;
}

async function updateTaskInDatabase(task) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${task.id}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: task.status })
        });
    } catch (error) {
        console.error('Fetch-Fehler:', error);
    }
}

function renderBigTaskDialog(tasks) {
    let container = document.getElementById('bigDialog');
    container.innerHTML = '';
    tasks.forEach(task => {
        container.innerHTML += getBigTaskDialog(task);
    });
}

function renderSubtasks(task) {
    if (!task.subtasks || task.subtasks.length === 0) {
        return '<p class="dialog-card-typography-content">No subtasks available.</p>';
    }
    return task.subtasks.map(subtask => {
        const isCompleted = subtask.completed === true;
        const checkboxIcon = isCompleted
            ? '../assets/img/board_icons/checked_button.svg'
            : '../assets/img/board_icons/unchecked_button.svg';
        return `
            <div class="dialog-card-subtask-checkbox">
                <img 
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

function searchTasks() {
    let inputText = document.getElementById('findTaskInput').value.toLowerCase().trim();
    const filteredTasks = tasks.filter(task => {
        return (
            task.title.toLowerCase().includes(inputText) ||
            task.description.toLowerCase().includes(inputText)
        );
    });
    renderCards(filteredTasks);
}

async function toggleSubtaskCompletion(event) {
    const taskId = event.target.dataset.taskId;
    const subtaskId = event.target.dataset.subtaskId;
    const url = `${BASE_URL}tasks/${taskId}/subtasks/${subtaskId}/completed.json`;
    const res = await fetch(url);
    const completed = await res.json();
    const newCompleted = !completed;
    event.target.src = newCompleted
        ? '../assets/img/board_icons/checked_button.svg'
        : '../assets/img/board_icons/unchecked_button.svg';
    await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompleted),
    }); 
}