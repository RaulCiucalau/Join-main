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

let currentDraggedElement;

async function init() {
    await onloadFunc();
    includeHTML();
    renderCards(tasks);
}

function openAddTaskDialog() {
    let dialog = document.getElementById('addTaskDialog');
    dialog.classList.toggle('d-none');
}

function toggleDialog() {
    let dialog = document.getElementById('addTaskDialog')
    dialog.classList.toggle('d-none');
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderCards(tasks) {
    const statusIds = ["ToDo", "InProgress", "AwaitFeedback", "Done"];
    statusIds.forEach((status) => {
        const container = document.getElementById(`status${status}`);
        container.innerHTML = '';
    });
    tasks.forEach(task => {
        const container = document.getElementById(`status${task.status}`);
        container.innerHTML += getCardsTemplate(task);
    });
}

function getLabelClass(category) {
    return category.toLowerCase().replace(/\s+/g, '-') + '-label';
}

function startDragging(id) {
    currentDraggedElement = id;
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