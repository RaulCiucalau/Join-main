let subtask = []; 
let subtaskIdCounter = 0; 
let currentTaskId = 3; // ← oder dynamisch setzen

document.addEventListener('DOMContentLoaded', () => {
  const subtaskInput = document.getElementById('subtask');
  const cancelIcon = document.getElementById('cancel-task-img');
  const acceptIcon = document.getElementById('accept-task-img');
  const separator = document.getElementById('small-separator');
  const addIcon = document.getElementById('add-subtask-img');

  subtaskInput.addEventListener('input', () => {
    if (subtaskInput.value.trim().length > 0) {
      cancelIcon.classList.remove('dp-none');
      acceptIcon.classList.remove('dp-none');
      separator.classList.remove('dp-none');
      addIcon.classList.add('dp-none');
    } else {
      cancelIcon.classList.add('dp-none');
      acceptIcon.classList.add('dp-none');
      separator.classList.add('dp-none');
      addIcon.classList.remove('dp-none');
    }
  });

  cancelIcon.addEventListener('click', () => {
    subtaskInput.value = '';
    cancelIcon.classList.add('dp-none');
    acceptIcon.classList.add('dp-none');
    separator.classList.add('dp-none');
    addIcon.classList.remove('dp-none');
  });

  acceptIcon.addEventListener('click', () => {
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText.length > 0) {
      addSubtaskToList(subtaskText);
      subtaskInput.value = '';
      cancelIcon.classList.add('dp-none');
      acceptIcon.classList.add('dp-none');
      separator.classList.add('dp-none');
      addIcon.classList.remove('dp-none');
    }
  });
});

function addSubtaskToList(text) {
  const list = document.getElementById('subtask-list');

  // Objekt erzeugen und speichern
  const subtaskObject = {
    id: subtaskIdCounter.toString(),
    taskId: currentTaskId.toString(),
    title: text, 
    completed: false
  };
  subtask.push(subtaskObject);
  subtaskIdCounter++;

  // HTML generieren
  const item = document.createElement('div');
  item.className = 'subtask-list-item';

  item.innerHTML = `
    <span class="subtask-text">• ${text}</span>
    <div class="subtask-list-item-btns dp-none">
      <img src="../assets/icons/edit.svg" class="subtask-edit-icons" title="Edit">
      <img src="../assets/icons/delete.svg" class="subtask-edit-icons" title="Delete">
    </div>
  `;

  const btnContainer = item.querySelector('.subtask-list-item-btns');
  const editBtn = btnContainer.querySelector('img[title="Edit"]');
  const deleteBtn = btnContainer.querySelector('img[title="Delete"]');

  item.addEventListener('mouseenter', () => {
    btnContainer.classList.remove('dp-none');
  });

  item.addEventListener('mouseleave', () => {
    btnContainer.classList.add('dp-none');
  });

  deleteBtn.addEventListener('click', () => {
    list.removeChild(item);
    subtask = subtask.filter(s => s.title !== text); // optional: besser mit ID löschen
  });

  editBtn.addEventListener('click', () => {
    const currentText = item.querySelector('.subtask-text').innerText.slice(2);
    item.innerHTML = `
      <input type="text" class="subtask-edit-input" value="${currentText}">
      <div class="subtask-list-item-btns">
        <img src="../assets/icons/check.svg" class="subtask-edit-icons" title="Save">
        <img src="../assets/icons/cancel.svg" class="subtask-edit-icons" title="Cancel">
      </div>
    `;

    const saveBtn = item.querySelector('img[title="Save"]');
    const cancelBtn = item.querySelector('img[title="Cancel"]');
    const input = item.querySelector('input');

    saveBtn.addEventListener('click', () => {
      const newText = input.value.trim();
      if (newText.length > 0) {
        // Update im Array
        const st = subtask.find(s => s.title === currentText);
        if (st) st.title = newText;

        list.removeChild(item);
        addSubtaskToList(newText);
      }
    });

    cancelBtn.addEventListener('click', () => {
      list.removeChild(item);
      addSubtaskToList(currentText);
    });
  });

  list.appendChild(item);
}

function getSubtasksArray() {
  return subtask;
}
