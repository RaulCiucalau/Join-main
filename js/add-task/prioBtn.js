/**
 * Stores the currently selected priority.
 * @type {string}
 */
let selectedPrio;

/**
 * Selects a priority button and updates its style.
 * @param {string} prio - The priority to select ("urgent", "medium", or "low").
 */
function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach((p) => unselectPrio(p));
  document.getElementById(`prio-img-${prio}`).src = `./assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prio-btn-${prio}`).style.color = "white";
  selectedPrio = `${prio}`;
}

/**
 * Unselects a priority button and resets its style.
 * @param {string} prio - The priority to unselect ("urgent", "medium", or "low").
 */
function unselectPrio(prio) {
  document.getElementById(`prio-img-${prio}`).src = `./assets/icons/priority-${prio}.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = "white";
  document.getElementById(`prio-btn-${prio}`).style.color = "black";
  selectedPrio = "";
}

/**
 * Toggles the selection state of a priority button.
 * @param {string} prio - The priority to toggle ("urgent", "medium", or "low").
 */
function togglePrio(prio) {
  if (document.getElementById(`prio-btn-${prio}`).style.color === "white") {
    unselectPrio(prio);
  } else {
    selectPrio(prio);
  }
}

/**
 * Gets the color associated with a priority.
 * @param {string} prio - The priority ("urgent", "medium", or "low").
 * @returns {string} - The color associated with the priority.
 */
function getPrioColor(prio) {
  switch (prio) {
    case "urgent":
      return "#FF3D00";
    case "medium":
      return "#FFA800";
    case "low":
      return "#7AE229";
    default:
      return "white";
  }
}
