/**
 * Stores all tasks loaded from the database.
 * @type {Array<Object>}
 */
let tasks = [];

/**
 * Stores all contacts loaded from the database.
 * @type {Array<Object>}
 */
let contacts = [];

/**
 * Base URL for Firebase Realtime Database.
 * @type {string}
 */
const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads tasks and contacts from the database, processes subtasks.
 * Called on initial page load.
 * @async
 * @returns {Promise<void>}
 */
async function onloadFunc() {
    tasks = [];
    let { tasksKeysArrays, tasksResponse } = await letTasks();
    for (let index = 0; index < tasksKeysArrays.length; index++) {
        let { data, taskId } = letTaskIdData(index);
        if (data === null) continue;
        let subtasksArray = [];
        if (data.subtasks) {
            subtasksArray = Object.entries(data.subtasks).map(([subtaskId, subtask]) => pullSubtask(subtask, subtaskId, taskId));
        }
        tasks.push(lookForUserData(taskId, data, subtasksArray));
    }
    await contactsFetch();

    /**
     * Creates a subtask object with its ID and parent task ID.
     * @param {Object} subtask - The subtask data.
     * @param {string} subtaskId - The subtask ID.
     * @param {string} taskId - The parent task ID.
     * @returns {Object} The subtask object with IDs.
     */
    function pullSubtask(subtask, subtaskId, taskId) {
        return {
            ...subtask,
            id: subtaskId,
            taskId: taskId
        };
    }

    /**
     * Creates a task object with all relevant data and subtasks.
     * @param {string} taskId - The task ID.
     * @param {Object} data - The task data.
     * @param {Array} subtasksArray - Array of subtask objects.
     * @returns {Object} The task object.
     */
    function lookForUserData(taskId, data, subtasksArray) {
        return {
            id: taskId,
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            due_date: data.due_date,
            assigned_to: data.assigned_to,
            status: data.status,
            subtasks: subtasksArray
        };
    }

    /**
     * Fetches all tasks from the database and returns keys and response.
     * @returns {Promise<{tasksKeysArrays: Array<string>, tasksResponse: Object}>}
     */
    async function letTasks() {
        let tasksResponse = await fetchData("tasks");
        let tasksKeysArrays = Object.keys(tasksResponse);
        return { tasksKeysArrays, tasksResponse };
    }

    /**
     * Returns the data and ID for a task at a given index.
     * @param {number} index - The index in the tasksKeysArrays.
     * @returns {{data: Object, taskId: string}}
     */
    function letTaskIdData(index) {
        let taskId = tasksKeysArrays[index];
        let data = tasksResponse[taskId];
        return { data, taskId };
    }
}

/**
 * Fetches data from a specific path in the Firebase Realtime Database.
 * @async
 * @param {string} path - The path (e.g., "tasks", "contacts") to fetch from.
 * @returns {Promise<Object>} Parsed JSON response.
 */
async function fetchData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

/**
 * Loads contacts from the database and populates the `contacts` array.
 * @async
 * @returns {Promise<void>}
 */
async function contactsFetch() {
    let contactsResponse = await fetchData("contacts");
    if (!contactsResponse) return;
    let contactKeysArray = Object.keys(contactsResponse);
    for (let index = 0; index < contactKeysArray.length; index++) {
        let contactId = contactKeysArray[index];
        let data = contactsResponse[contactId];
        if (data === null) continue;
        contacts.push({
            id: contactId,
            name: data.name,
            e_mail: data.e_mail,
            phone: data.phone,
            color: data.color,
            avatar: data.avatar
        });
    }
}
