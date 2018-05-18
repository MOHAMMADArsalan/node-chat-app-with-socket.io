const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io")
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New User Connected !!!!! ");

    socket.on("createMessage", function (message) {

        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: Date.now()
        })

    })
    socket.on("disconnect", () => {
        console.log("User disconnected !!!!! ");
    })

})

server.listen(PORT, () => {
    console.log("server is running on PORT" + PORT)
})