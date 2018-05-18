var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
})

socket.on("newMessage", function (message) {
    console.log('====================================');
    console.log(message);
    console.log('====================================');
})

socket.on('disconnect', function () {
    console.log('disconnected to server');
})
