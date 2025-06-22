/**
 * Includes external HTML fragments into the current document using `w3.includeHTML`.
 * After inclusion, it waits for the element with ID `initialLetter` to exist in the DOM,
 * and then executes `loadAvatarForHeader`.
 * 
 * This function relies on the `w3` object being defined (e.g., from W3Schools' `w3.js`).
 * 
 * @returns {void}
 */
function includeHTML() {
    if (typeof w3 !== 'undefined' && w3.includeHTML) {
        w3.includeHTML();
        waitForInitialLetterElement(loadAvatarForHeader);
      } else {
        return;
      }
  }