/**
 * Checks the current window orientation and device width to determine
 * if a landscape overlay should be displayed on mobile devices.
 *
 * Adds the CSS class `dp-landscape-overlay` to the element with ID `landscapeOverlay`
 * if the device is in landscape mode and the viewport width is less than 934px.
 * Removes the class otherwise.
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

/**
 * Initializes orientation checking once the DOM content is loaded.
 * Also attaches the orientation checker to the window resize event.
 */
window.addEventListener('DOMContentLoaded', () => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
});
