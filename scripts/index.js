countdownElem = document.getElementById('countdown');

setInterval(() => {
    eventTime = new Date(2019, 8, 10, 11);
    currTime = new Date();
    var diff = eventTime - currTime; // ms
    var day, hour, minute, seconds;
    seconds = Math.floor(diff / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    countdownElem.innerText = '' + day + ' ' + hour + ' ' + minute + ' ' + seconds;
}, 1000);
