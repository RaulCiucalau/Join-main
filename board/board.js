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