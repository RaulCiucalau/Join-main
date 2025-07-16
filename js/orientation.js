function checkOrientation() {
    const overlay = document.getElementById('landscapeOverlay');
    const isMobile = window.innerWidth < 934;
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isMobile && isLandscape) {
        overlay.classList.add('dp-landscape-overlay');
    } else {
        overlay.classList.remove('dp-landscape-overlay');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
});
