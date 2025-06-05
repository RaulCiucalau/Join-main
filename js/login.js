function init(){


}

function redirectToGuestView() {
    location.replace("summary/summary.html");
}


setTimeout(animationJoinSign, 2800);

function animationJoinSign(){
    let animationJoinSign = document.getElementById('overlay-animation');

    animationJoinSign.classList.toggle('d_none');
}
