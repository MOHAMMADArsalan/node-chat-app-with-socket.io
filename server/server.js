const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io")

const { generateMessage, generatLocationMessage } = require("./utils/message")
const { isRealString } = require("./utils/validations")
const app = express();

const server = http.createServer(app);
const io = socketIO(server);
const { Users } = require("./utils/users");
const PORT = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public');
const users = new Users();

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log("New User Connected !!!!! ");



    socket.on("join", function (params, callback) {
        const { room, name } = params
        if (!isRealString(name) || !isRealString(room)) {
            return callback("name and room are required")
        }
        socket.join(room)
        users.removeUser(socket.id)
        users.addUser(socket.id, name, room);
        // io.emit -> io.to('The Office Fans').emit("");
        // socket.broadcast.emit() ->socket.broadcast.to("The Office Fans").emit()
        io.to(room).emit("updateUserList", users.getUserList(room))
        socket.emit("newMessage", generateMessage("Admin", "Welcome to chat app"))

        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} has Joined`))
        callback();
    })

    socket.on("createMessage", function (message, callback) {
        // broadcast message to every user even user itself too.
        // io.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: Date.now()
        // })
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))
        }
        // send message to every user expect this user
        callback()
    })

    socket.on("sendLocationMessage", function (location) {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newLocationMessage", generatLocationMessage(user.name, location.latitude, location.longitude))
        }
       
    })
    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left`))
        }

        console.log("User disconnected !!!!! ");
    })

})

server.listen(PORT, () => {
    console.log("server is running on PORT" + PORT)
})