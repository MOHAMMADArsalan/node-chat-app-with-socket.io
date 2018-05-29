var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
})

socket.on("newMessage", function (message) {
    const formatedTime = moment(message.createdAt).format("h:mm a");
    const li = jQuery("<li></li>");
    li.text(`${message.from} ${formatedTime}: ${message.text}`);
    jQuery("#messages").append(li);
})

socket.on("newLocationMessage", function (message) {
    const formatedTime = moment(message.createdAt).format("h:mm a");
    
    const li = jQuery("<li></li>");
    const a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from} ${formatedTime}: `);
    a.attr("href", message.url);
    li.append(a);
    jQuery("#messages").append(li);
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
