/**
 * Checks if any required task input (title, category, or due date) is empty or invalid.
 * 
 * @returns {boolean} `true` if any required input is invalid; otherwise `false`.
 */
function areInputsEmpty() {
    const get = (id) => document.getElementById(id);
    const title = get("add-task-title");
    const category = get("category");
    const dueDate = get("add-task-due-date");

    const titleOrCategoryInvalid = isTextInputInvalid(title, category);
    const dueDateInvalid = validateDueDate(dueDate);

    return titleOrCategoryInvalid || dueDateInvalid;
}

/**
 * Validates that text inputs (title and category) are not empty.
 * 
 * @param {HTMLInputElement} title - The title input field.
 * @param {HTMLInputElement} category - The category input field.
 * @returns {boolean} `true` if either input is empty; otherwise `false`.
 */
function isTextInputInvalid(title, category) {
    return !title.value.trim() || !category.value.trim();
}

/**
 * Validates the due date input for being non-empty and not in the past.
 * 
 * @param {HTMLInputElement} dueDate - The due date input field.
 * @returns {boolean} `true` if the due date is invalid; otherwise `false`.
 */
function validateDueDate(dueDate) {
    const box = document.getElementById("required-date");
    const [emptyMsg, pastMsg] = box.querySelectorAll("p");
    hideDateWarnings([emptyMsg, pastMsg, box]);
    dueDate.style.border = "";
    const value = dueDate.value.trim();
    const today = getToday();
    if (!value) return showEmptyDateWarning(emptyMsg, box);
    if (new Date(value) < today) return showPastDateWarning(pastMsg, box, dueDate);
    return false;
}

/**
 * Hides all date-related validation warnings.
 * 
 * @param {HTMLElement[]} elements - An array of elements to hide.
 */
function hideDateWarnings(elements) {
    elements.forEach(el => el.classList.add("dp-none"));
}

/**
 * Displays warning when due date is empty.
 * 
 * @param {HTMLElement} msg - The warning paragraph element.
 * @param {HTMLElement} box - The container element for warnings.
 * @returns {boolean} Always returns `true` (input is invalid).
 */
function showEmptyDateWarning(msg, box) {
    msg.classList.remove("dp-none");
    box.classList.remove("dp-none");
    return true;
}

/**
 * Displays warning when due date is in the past.
 * 
 * @param {HTMLElement} msg - The warning paragraph element.
 * @param {HTMLElement} box - The container element for warnings.
 * @param {HTMLInputElement} input - The due date input element.
 * @returns {boolean} Always returns `true` (input is invalid).
 */
function showPastDateWarning(msg, box, input) {
    msg.classList.remove("dp-none");
    box.classList.remove("dp-none");
    input.style.border = "1px solid red";
    return true;
}

/**
 * Gets today's date at 00:00:00 for date comparison.
 * 
 * @returns {Date} A date object representing today.
 */
function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Marks the due date as missing and shows corresponding warning.
 */
function requiredDateTrue() {
    e.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    i = true;
}

/**
* Retrieves validation flags and current values for title, category, and due date.
*
* @returns {{ v: string, i: boolean, today: Date }} v = due date value,
* i = is invalid flag, today = today's date at midnight.
*/
function letAddTaskTitle() {
    let i = !t("add-task-title").value.trim() || !t("category").value.trim(), v = d.value, today = new Date();
    today.setHours(0, 0, 0, 0);
    return { v, i, today };
}

/**
* Marks the due date as invalid (in the past) and shows corresponding warning.
*/
function requiredDate() {
    p.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    d.style.border = "1px solid red";
    i = true;
}