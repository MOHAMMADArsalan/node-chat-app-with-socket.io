var socket = io();

function scrollToBottom() {
    // messages 
    const messages = jQuery("#messages");
    const newMessage = jQuery("#messages li:last-child");
    // Heights

    const clientHeight = messages.prop("clientHeight");
    const scrollTop = messages.prop("scrollTop");
    const scrollHeight = messages.prop("scrollHeight");
    const newMessageInnerHeight = newMessage.innerHeight();
    const lastMessageInnerHeight = newMessage.prev().innerHeight();
    if ((clientHeight + scrollTop + newMessageInnerHeight + lastMessageInnerHeight) >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}
socket.on('connect', function () {
    const params = jQuery.deparam(window.location.search);
    socket.emit("join", params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        } else {
            console.log("no error")
        }
    })

})
socket.on('disconnect', function () {
    console.log('disconnected to server');
})

socket.on("updateUserList", function (users) {
    console.log(users)
    const ol = jQuery("<ol></ol>");


    users.forEach(function (user) {
        ol.append(jQuery("<li></li>").text(user))
    })

    jQuery("#users").html(ol)
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
    scrollToBottom()
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
    scrollToBottom()

})


jQuery('#message-form').on("submit", function (e) {
    e.preventDefault();
    const messageTextBox = jQuery('#message');
    socket.emit("createMessage", {
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
});

