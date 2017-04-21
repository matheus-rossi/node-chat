const socket = io()

socket.on("connect", function() {
    console.log("Connected to Server");
});

socket.on("disconnect", function() {
    console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
    let formatedTime = moment(message.createdAt).format("h:mm a");
    let template = $("#message-template").html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });
    $("#messages").append(html);
});

socket.on("newLocationMessage", function(message) {
    let formatedTime = moment(message.createdAt).format("h:mm a");
    let template = $("#location-message-template").html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime,
        url: message.url
    });
    $("#messages").append(html);
})


$("#message-form").on("submit", function(e) {
    e.preventDefault();
    var messageTextBox = $("[name=message]");
    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val("");
    });
});

var locationButton = $("#send-location");

locationButton.on("click", function() {
    if (!navigator.geolocation) {
        return alert("Geolocation not suported by your browser");
    }
    locationButton.attr("disabled", "disabled").text("Sending Location ...");
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr("disabled").text("Send Location");
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        console.log("Unable to fetch location");
        locationButton.removeAttr("disabled").text("Send Location");
    })

});