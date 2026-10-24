let video, btn, time, advance, back, fulls, as, now, total, cont
video = document.getElementById('myvideo');
btn = document.getElementById('play-pause');
time = document.getElementById('time');
advance = document.getElementById('movetimeahead');
back = document.getElementById('movetimeback');
fulls = document.getElementById('fulls');
as = document.getElementById('as');
now = document.getElementById('now');
total = document.getElementById('total');
cont = document.getElementById('cont');


fulls.addEventListener('click',full2);
btn.addEventListener('click',playPause);
video.addEventListener('timeupdate',tiempo);
advance.addEventListener('click',advancetime)
back.addEventListener('click',backtime);
video.addEventListener('click',playPause);
document.addEventListener('keydown',tecla);
document.addEventListener('keydown',tiempo2);
document.addEventListener('keyup',full);
document.addEventListener('dblclick', swipes);
function swipes(e) {
    document.exitFullscreen();
}
document.addEventListener('touchstart', swipe);
document.addEventListener('touchmove', swipe);
function swipe(e) {
    if (e.targetTouches[0].pageX > xi + 150) {
        video.currentTime=video.currentTime+10;
    }
    if (e.targetTouches[0].pageX < xi + 150) {
        video.currentTime=video.currentTime-10;
    }
}
function full(e) {
    if (e.keyCode==70) {
        
    if(!fullScreen){
        cont.requestFullscreen();
    }
    else{
        document.exitFullscreen(); 
    }
}
}
function full2(e) {

        if (!fullScreen) {
            cont.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
}
function tiempo2(e) {
    if (e.keyCode==39) {
        advancetime();
    }
    else if(e.keyCode==37){
        backtime(); 
    }
}
function tecla(e) {
    console.log(e);
    if (e.keyCode==32) {
        playPause();
    }
    
}
function advancetime() {
    video.currentTime=video.currentTime+5;
}
function backtime() {
    video.currentTime = video.currentTime - 5;
}
function playPause() {
    if(video.paused){
        btn.innerHTML='||'; 
        video.play();
    }
    else{
        btn.innerHTML='>';
        video.pause();
    }
}
    var jeje1=document.getElementById('jeje1');
    var jeje2=document.getElementById('jeje2');
    var osi=video.currentTime;
function tiempo() {

    var timepos= video.currentTime/video.duration;
    time.style.width=timepos*100+'%';
    range.value=video.currentTime*1;

    if (video.currentTime>=60) {
        osi=video.currentTime-60;
    }
    else{
        osi=video.currentTime;
    }
    if(video.currentTime<9.5){
        jeje2.innerHTML='0'+osi.toFixed(0);
    }
    else if(video.duration>=9.5){
    jeje2.innerHTML=osi.toFixed(0);
    }
    jeje1.innerHTML='0';
}
var range = document.getElementById('range');
range.min = 0;
range.max = 239.258412;
range.value=0;
console.log(range.max.type);
range.onchange = function a() {
    video.currentTime=range.value*1;
}

// var intervalo=setInterval(tiempo,400);