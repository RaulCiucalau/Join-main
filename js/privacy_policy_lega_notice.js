function init() {
    includeHTML();
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