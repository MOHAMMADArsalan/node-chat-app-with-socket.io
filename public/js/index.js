var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
})

socket.on("newMessage", function (message) {
    const li = jQuery("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    jQuery("#messages").append(li);
})




jQuery('#message-form').on("submit", function (e) {
    e.preventDefault();
    socket.emit("createMessage", {
        from: "Arsalan",
        text: jQuery('#message').val()
    }, function (data) {
        console.log(data)
    })
})

socket.on('disconnect', function () {
    console.log('disconnected to server');
})
