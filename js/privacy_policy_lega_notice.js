/**
 * Initializes the application by including external HTML content.
 * This is typically called on page load to set up shared components (e.g., header, sidebar).
 * 
 * @returns {void}
 */
function init() {
    includeHTML();
}

/**
 * Waits for the DOM element with ID "initialLetter" to appear in the document,
 * then executes the provided callback function.
 *
 * This uses a `MutationObserver` to monitor DOM changes, allowing for delayed
 * loading of dynamic content.
 *
 * @param {Function} callback - The function to execute once the element is found.
 * @returns {void}
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
