const socket = io()

function scrollToBottom() {
    //Selector
    let messages = $("#messages");
    let newMessage = messages.children("li:last-child");
    // Heights
    let clientHeight = messages.prop("clientHeight");
    let scrollTop = messages.prop("scrollTop");
    let scrollHeight = messages.prop("scrollHeight");
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function() {
    console.log("Connected to Server");
    const params = $.deparam(window.location.search);

    socket.emit("join", params, function(err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        } else {
            console.log("no error");
        }
    });
});

socket.on("updateUserList", function(users) {
    let ol = $("<ol></ol>");

    users.forEach(function(user) {
        ol.append($("<li></li>").text(user));
    });

    $("#users").html(ol);
})

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
    scrollToBottom();
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
    scrollToBottom();
})


$("#message-form").on("submit", function(e) {
    e.preventDefault();
    var messageTextBox = $("[name=message]");
    socket.emit("createMessage", {
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