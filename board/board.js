let isDialogOpen = false;
let profileBadges = {
    "Anton Mayer": "../assets/img/board_icons/badge_anton.svg",
    "Anja Schulz": "../assets/img/board_icons/badge_anja.svg",
    "Benedikt Ziegler": "../assets/img/board_icons/badge_benedikt.svg",
    "David Eisenberg": "../assets/img/board_icons/badge_david.svg",
    "Eva Fischer": "../assets/img/board_icons/badge_eva.svg",
    "Emmanuel Mauer": "../assets/img/board_icons/badge_emmanuel.svg",
    "Marcel Bauer": "../assets/img/board_icons/badge_Marcel.svg",
    "Tatjana Wolf": "../assets/img/board_icons/badge_Tatjana.svg",
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
    renderEditTaskDialog(tasks);
}

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

function closeAddTaskDialog(event) {
  const dialog = document.querySelector('.dialog-add-task');
  dialog.style.animation = 'slideOutToRight 0.4s forwards';
  setTimeout(() => {
    document.getElementById('addTaskDialog').classList.add('d-none');
    isDialogOpen = false;
  }, 400);
}

function stopPropagation(event) {
  event.stopPropagation();
}

function toggleBigTaskDialog() {
    let bigDialog = document.getElementById('bigTaskDialog')
    bigDialog.classList.toggle('d-none-big-dialog');
}

function closeBigDialog() {
    const container = document.getElementById('bigTaskDialog');
    container.classList.remove('open');
    container.classList.add('closing');
    setTimeout(() => {
        container.classList.remove('closing');
        container.classList.add('d-none-big-dialog')
    }, 100);
}

function openDialog() {
    const container = document.getElementById('bigTaskDialog');
    container.classList.remove('closing');
    container.classList.add('open');
    container.classList.remove('d-none-big-dialog');
}

function openBigTaskDialogById(taskId) {
    const task = tasks.find(task => task.id === taskId);
    const bigDialog = document.getElementById('bigTaskDialog');
    bigDialog.innerHTML = getBigTaskDialog(task);
    bigDialog.classList.remove('closing');
    bigDialog.classList.add('open');
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
  if (!Array.isArray(assignedList) || contacts.length === 0) return '';
  
  return assignedList.map(name => {
    const contact = contacts.find(c => c.name === name);
    if (!contact) return '';
    return `
      <span class="profile-badge margin-left-contacts" style="background-color: ${contact.color}">${contact.avatar}</span>
    `;
  }).join('');
}

function renderAssignedContactsBigDialog(assignedList) {
    if (!Array.isArray(assignedList)) return '';
    return assignedList
        .map(name => {
            const badgeSrc = profileBadges[name];
            if (!badgeSrc) return '';
            return `
                <div class="contact-item">
                    <img class="profile-badge" src="${badgeSrc}" alt="${name}'s Badge">
                    <span class="contact-name">${name}</span>
                </div>
            `;
        })
        .join('');
}

function renderPriority(priority) {
    const normalized = priority.toLowerCase();
    const validPriority = Object.keys(priorityImg).find(p => p.toLowerCase() === normalized);
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
    let draggableElement = document.getElementById(`dragTask${taskId}`);
    currentDraggedTaskId = taskId;
    draggableElement.classList.add("dragging");
    draggableElement.addEventListener('dragend', () => {
        draggableElement.classList.remove("dragging");
        currentDraggedTaskId = null;
    }, { once: true });
}

function allowDrop(event, taskId) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-highlight");
    let draggableElement = document.getElementById(`dragTask${taskId}`);
    draggableElement.classList.remove("dragging");
}

function removeHighlight(event) {
    event.currentTarget.classList.remove("drag-highlight");
}

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
        return '<p class="dialog-card-typography-content">No subtasks.</p>';
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
            task.description.toLowerCase().includes(inputText) ||
            task.category.toLowerCase().includes(inputText)
        );
    });
    renderCards(filteredTasks);
}

async function toggleSubtaskCompletion(event) {
    const taskId = event.target.dataset.taskId;
    const subtaskId = event.target.dataset.subtaskId;
    const completedUrl = `${BASE_URL}tasks/${taskId}/subtasks/${subtaskId}/completed.json`;
    const subtasksUrl = `${BASE_URL}tasks/${taskId}/subtasks.json`;
    try {
        const resGet = await fetch(completedUrl);
        if (!resGet.ok) throw new Error('Fehler beim GET Subtask Status');
        const completed = await resGet.json();
        const newCompleted = !completed;
        event.target.src = newCompleted
            ? '../assets/img/board_icons/checked_button.svg'
            : '../assets/img/board_icons/unchecked_button.svg';
        const resPut = await fetch(completedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCompleted),
        });
        if (!resPut.ok) throw new Error('Fehler beim PUT Subtask Status');
        const resSubtasks = await fetch(subtasksUrl);
        if (!resSubtasks.ok) throw new Error('Fehler beim Laden der Subtasks');
        const subtasks = await resSubtasks.json();
        const completedCount = subtasks.filter(subtask => subtask.completed === true).length;
        const totalCount = subtasks.length;
        const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
        const progressBarFill = document.getElementById(`progressBar-${taskId}`);
        if (progressBarFill) {
            progressBarFill.style.width = `${progressPercent}%`;
        }
        updateSubtasksText({ id: taskId }, subtasks);
    } catch (error) {
        console.error('Fehler beim Toggle:', error);
    }
}

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

function redirectToAddTask() {
    window.location.href = "../add_task.html";
}

async function deleteTask(task) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${task.id}.json`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Fetch-Fehler:', error);
    }
}

async function deleteTaskById(id) {
    await deleteTask({ id });
    closeBigTaskDialog();
    await onloadFunc();
    renderCards(tasks);
}

function closeBigTaskDialog() {
    document.getElementById("bigTaskDialog").classList.add("d-none-big-dialog");
}