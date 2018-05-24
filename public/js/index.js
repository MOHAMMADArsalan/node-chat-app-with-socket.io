var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
})

socket.on("newMessage", function (message) {
    const li = jQuery("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    jQuery("#messages").append(li);
})

socket.on("newLocationMessage", function (message) {
    const li = jQuery("<li></li>");
    const a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from} `);
    a.attr("href", message.url);
    li.append(a);
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


jQuery("#send-location").on("click", function () {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(function (location) {
        console.log(location)
        socket.emit("sendLocationMessage", {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        })

    }, function (e) {
        alert("Unable to fetch location")
    })
})
socket.on('disconnect', function () {
    console.log('disconnected to server');
})
