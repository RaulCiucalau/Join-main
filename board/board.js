/** @type {boolean} Indicates whether the "Add Task" dialog is currently open. */
let isDialogOpen = false;

/** 
 * @type {Object<string, string>}
 * Maps priority levels to their corresponding icon image paths.
 */
let priorityImg = {
    "Low": "../assets/img/board_icons/priority_low.svg",
    "Medium": "../assets/img/board_icons/priority_medium.svg",
    "Urgent": "../assets/img/board_icons/priority_urgent.svg"
};

/**
 * @type {{id: string, label: string}[]} 
 * Status identifiers used to categorize tasks.
 */
const statusIds = [
    { id: "ToDo", label: "to do" },
    { id: "InProgress", label: "in progress" },
    { id: "AwaitFeedback", label: "awaiting feedback" },
    { id: "Done", label: "done" }
];

/** @type {string|null} ID of the task currently being dragged. */
let currentDraggedTaskId;

/**
 * Initializes the application: loads data, includes HTML, and renders components.
 */
async function init() {
    await onloadFunc();
    includeHTML();
    renderCards(tasks);
    renderBigTaskDialog(tasks);
    renderEditTaskDialog(tasks);
}

/**
 * Waits for an element with ID 'initialLetter' to be present in the DOM,
 * then executes the callback.
 * @param {Function} callback - Function to call when the element is found.
 */
function waitForInitialLetterElement(callback) {
    const observer = new MutationObserver(() => {
        const el = document.getElementById("initialLetter");
        if (el) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Opens the Add Task dialog or redirects to a separate page on small screens.
 */
function openAddTaskDialog() {
    const dialogContainer = document.getElementById('addTaskDialog');
    const dialog = dialogContainer.querySelector('.dialog-add-task');
    const isSmallScreen = window.matchMedia("(max-width: 1035px)").matches;
    if (isSmallScreen) {
        window.location.href = "../add_task.html";
    } else if (!isDialogOpen) {
        dialogContainer.classList.remove('d-none');
        dialog.style.animation = 'slideInFromRight 0.4s forwards';
        isDialogOpen = true;
    }
}

/**
 * Toggles the visibility of the Add Task dialog with animation.
 */
function toggleAddTaskDialog() {
    const dialogContainer = document.getElementById('addTaskDialog');
    const dialog = dialogContainer.querySelector('.dialog-add-task');
    if (!isDialogOpen) {
        dialogContainer.classList.remove('d-none');
        dialog.style.animation = 'slideInFromRight 0.4s forwards';
        isDialogOpen = true;
    } else {
        dialog.style.animation = 'slideOutToRight 0.4s forwards';
        setTimeout(() => {
            dialogContainer.classList.add('d-none');
            isDialogOpen = false;
        }, 400);
    }
}

/**
 * Closes the Add Task dialog with animation and clears the form.
 * @param {Event} event - The event that triggered this action.
 */
function closeAddTaskDialog(event) {
    const dialog = document.querySelector('.dialog-add-task');
    clearTaskForm();
    dialog.style.animation = 'slideOutToRight 0.4s forwards';
    setTimeout(() => {
        document.getElementById('addTaskDialog').classList.add('d-none');
        isDialogOpen = false;
    }, 400);
}

/**
 * Prevents event propagation.
 * @param {Event} event - The event to stop.
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Renders all tasks grouped by status.
 * @param {Array<Object>} tasks - Array of task objects.
 */
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

/**
 * Calculates the completion percentage of subtasks.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @returns {number} Completion percentage.
 */
function getProgressPercentage(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completed / subtasks.length) * 100);
}

/**
 * Returns formatted progress text.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @returns {string} Progress text (e.g., '2/5 Subtasks').
 */
function getProgressText(subtasks) {
    if (!subtasks || subtasks.length === 0) return '0/0 Subtasks';
    const completed = subtasks.filter(subtask => subtask.completed).length;
    return `${completed}/${subtasks.length} Subtasks`;
}

/**
 * Starts dragging a task card.
 * @param {string} taskId - ID of the task being dragged.
 */
function startDragging(taskId) {
    let draggableElement = document.getElementById(`dragTask${taskId}`);
    currentDraggedTaskId = taskId;
    draggableElement.classList.add("dragging");
    draggableElement.addEventListener('dragend', () => {
        draggableElement.classList.remove("dragging");
        currentDraggedTaskId = null;
    }, { once: true });
}

/**
 * Allows a drop action and visually highlights the drop area.
 * @param {DragEvent} event 
 * @param {string} taskId 
 */
function allowDrop(event, taskId) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-highlight");
    let draggableElement = document.getElementById(`dragTask${taskId}`);
    if (draggableElement) {
        draggableElement.classList.remove("dragging");
    }
}

/**
 * Removes drop highlight.
 * @param {Event} event 
 */
function removeHighlight(event) {
    event.currentTarget.classList.remove("drag-highlight");
}

/**
 * Moves a task to a new status after drop.
 * @param {Event} event 
 * @param {string} newStatus - New status for the task.
 */
async function moveTo(event, newStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-highlight");
    const task = tasks.find(t => t.id === currentDraggedTaskId);
    const draggedElement = document.getElementById(`dragTask${currentDraggedTaskId}`);
    if (draggedElement) {
        draggedElement.classList.remove("dragging");
    }
    if (task && task.status !== newStatus) {
        task.status = newStatus;
        await updateTaskInDatabase(task);
        renderCards(tasks);
    }
    currentDraggedTaskId = null;
}

/**
 * Updates a task's status in the backend.
 * @param {Object} task - Task object to update.
 */
async function updateTaskInDatabase(task) {
    try {
        await fetch(`${BASE_URL}tasks/${task.id}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: task.status })
        });
    } catch (error) {
        console.error('Fetch-Fehler:', error);
    }
}

/**
 * Filters tasks based on input text and re-renders the task cards.
 */
function searchTasks() {
    let inputText = document.getElementById('findTaskInput').value.toLowerCase().trim();
    const filteredTasks = tasks.filter(task => {
        return (
            task.title.toLowerCase().includes(inputText) ||
            task.description.toLowerCase().includes(inputText) ||
            task.category.toLowerCase().includes(inputText)
        );
    });
    renderCards(filteredTasks);
}

/**
 * Toggles the completion state of a subtask and updates the backend and UI.
 * @param {Event} event - The event triggered by clicking the checkbox icon.
 */
async function toggleSubtaskCompletion(event) {
    const taskId = event.target.dataset.taskId;
    const subtaskId = event.target.dataset.subtaskId;
    try {
        const completed = !(await (await fetch(`${BASE_URL}tasks/${taskId}/subtasks/${subtaskId}/completed.json`)).json());
        const subtask = await (await fetch(`${BASE_URL}tasks/${taskId}/subtasks/${subtaskId}.json`)).json();
        if (!subtask) return console.error(`Subtask ${subtaskId} not found`);
        subtask.completed = completed;
        event.target.src = completed 
            ? '../assets/img/board_icons/checked_button.svg' 
            : '../assets/img/board_icons/unchecked_button.svg';
        await fetch(`${BASE_URL}tasks/${taskId}/subtasks/${subtaskId}.json`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subtask)
        });
        const subtasks = await (await fetch(`${BASE_URL}tasks/${taskId}/subtasks.json`)).json();
        const progress = subtasks.filter(s => s.completed).length / subtasks.length * 100;
        document.getElementById(`progressBar-${taskId}`).style.width = `${Math.round(progress)}%`;
        updateSubtasksText({ id: taskId }, subtasks);
        const index = tasks.findIndex(t => t.id == taskId);
        if (index !== -1) tasks[index].subtasks = subtasks;
    } catch (e) {
        console.error('Fehler beim Toggle:', e);
    }
}

/**
 * Updates the textual representation of subtask progress.
 * @param {{id: string}} task - The task object.
 * @param {Array<Object>} subtasks - Array of subtasks.
 * @returns {string} Progress text.
 */
function updateSubtasksText(task, subtasks) {
    const progressBarElement = document.getElementById(`progress-bar-text-${task.id}`);
    if (!subtasks || subtasks.length === 0) {
        if (progressBarElement) {
            progressBarElement.innerHTML = '0/0 Subtasks';
        }
        return '0/0 Subtasks';
    }
    const completed = subtasks.filter(subtask => subtask.completed).length;
    const text = `${completed}/${subtasks.length} Subtasks`;
    if (progressBarElement) {
        progressBarElement.innerHTML = text;
    }
    return text;
}

/**
 * Redirects the user to the Add Task page.
 */
function redirectToAddTask() {
    window.location.href = "../add_task.html";
}
