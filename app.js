if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

var button = document.getElementById("notifications");
button.addEventListener('click', function(e) {
    Notification.requestPermission().then(function(result) {
        if(result === 'granted') {
            randomNotification();
        }
    });
});

function randomNotification() {
    var randomItem = Math.floor(Math.random()*courses.length);
    var notifTitle = courses[randomItem].topic;
    var notifBody = 'Costs £' +courses[randomItem].price+'.';
    var notifImg = '/'+courses[randomItem].image+'.jpg';
    var options = {
        body: notifBody,
        icon: notifImg
    }
    var notif = new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
}