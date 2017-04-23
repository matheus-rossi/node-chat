const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./../utils/message")
const { isRealString } = require("./../utils/validation");
const { Users } = require("./../utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user Connected");

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and Room name required");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit("updateUserList", users.getUserList(params.room));

        socket.emit("newMessage", generateMessage("Admin", "Welcome to chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} joined.`));
        callback();
    });

    socket.on("createMessage", (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on("createLocationMessage", (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

    })

    socket.on("disconnect", () => {
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Chat Running! on ${port}`)
})