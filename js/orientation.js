/**
 * Checks the orientation of the device and applies a CSS class to display
 * an overlay if the device is mobile and in landscape mode.
 *
 * - Mobile devices are defined as having a viewport width less than 934px.
 * - Landscape mode is determined by comparing the viewport width and height.
 *
 * If both conditions are true, the 'dp-landscape-overlay' class is added
 * to the element with ID 'landscapeOverlay'. Otherwise, the class is removed.
 */
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
