function init() {
    includeHTML();
  }

  function includeHTML() {
    if (typeof w3 !== 'undefined' && w3.includeHTML) {
        w3.includeHTML();
      } else {
        return;
      }
  }