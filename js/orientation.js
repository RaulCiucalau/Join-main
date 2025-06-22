function checkOrientation() {
  const warning = document.getElementById('landscapeOverlay');
  const maxWidth = 1000;

  if (window.innerWidth <= maxWidth && window.matchMedia("(orientation: landscape)").matches) {
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }
}

window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);