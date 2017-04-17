const socket = io()

socket.on("connect", function() {
    console.log("Connected to Server");

    socket.emit("createMessage", {
        from: "Matt",
        text: "Hello"
    });
});

socket.on("disconnect", function() {
    console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
    console.log("newMessage", message)
})