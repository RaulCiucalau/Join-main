function init() {
    onloadFunc();
    includeHTML();
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