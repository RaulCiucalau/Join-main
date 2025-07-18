/**
 * Displays a temporary message on the page to indicate 
 * that a task has been added to the board.
 * 
 * Updates the inner HTML of the element with ID "log"
 * to show a success message and an image.
 */
function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
    <p>Task added to board</p>
    <img src="../assets/icons/added-to-board.svg" alt="Board image" />
  </div>`;
}