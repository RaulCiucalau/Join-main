function includeHTML() {
    if (typeof w3 !== 'undefined' && w3.includeHTML) {
        w3.includeHTML();
        waitForInitialLetterElement(loadAvatarForHeader);
      } else {
        return;
      }
  }