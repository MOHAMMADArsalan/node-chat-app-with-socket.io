const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io")

const { generateMessage } = require("./utils/message")

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New User Connected !!!!! ");

    socket.emit("newMessage", generateMessage("Admin", "Welcome to chat app"))

    socket.broadcast.emit("newMessage", generateMessage("Admin", "Welcome to new User in chat app"))



    socket.on("createMessage", function (message, callback) {
        // broadcast message to every user even user itself too.
        // io.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: Date.now()
        // })

        // send message to every user expect this user

        io.emit("newMessage", generateMessage(message.from, message.text))
        callback("This message is from Server")
    })
    socket.on("disconnect", () => {
        console.log("User disconnected !!!!! ");
    })

})

server.listen(PORT, () => {
    console.log("server is running on PORT" + PORT)
})