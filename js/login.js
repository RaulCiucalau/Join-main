function init(){

    // animationJoinSign()
}

function redirectToGuestView() {
    location.replace("summary/summary.html");
}

function animationJoinSign(){
    let animationJoinSign = document.getElementById('overlay-animation');

    animationJoinSign.classList.toggle('d_none');
}