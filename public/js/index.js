var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
})

socket.on("newMessage", function (message) {

    const template = jQuery('#message-template').html();
    const formatedTime = moment(message.createdAt).format("h:mm a");
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });

    jQuery("#messages").append(html);
})

socket.on("newLocationMessage", function (message) {
    const locationTemplate = jQuery("#location-message-template").html();
    const formatedTime = moment(message.createdAt).format("h:mm a");
    const html = Mustache.render(locationTemplate, {
        from: message.from,
        createdAt: formatedTime,
        url: message.url
    })
    jQuery("#messages").append(html);
})


jQuery('#message-form').on("submit", function (e) {
    e.preventDefault();
    const messageTextBox = jQuery('#message');
    socket.emit("createMessage", {
        from: "Arsalan",
        text: messageTextBox.val()
    }, function (data) {
        messageTextBox.val('')
    })
})

const locationButton = jQuery("#send-location");
locationButton.on("click", function () {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }
    locationButton.attr("disabled", "disabled").text("Send location...")
    navigator.geolocation.getCurrentPosition(function (location) {
        locationButton.removeAttr("disabled").text("Send location")
        socket.emit("sendLocationMessage", {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        })

    }, function (e) {
        locationButton.removeAttr("disabled").text("Send location")
        alert("Unable to fetch location")
    })
})
socket.on('disconnect', function () {
    console.log('disconnected to server');
})
