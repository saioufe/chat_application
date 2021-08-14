const path = require("path")
const express = require("express")
const http = require("http")
const app = express()
app.use(express.json())
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { add, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const port = process.env.PORT || 3000
const server = http.createServer(app)

const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, "../public")
app.use(express.static(publicDirectoryPath))

//let count = 0

io.on('connection', (socket) => {




    socket.on("join", ({ username, room }, callback) => {


        const { error, user } = add({ id: socket.id, username, room })


        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", generateMessage(user.username, "Welcome to the chat"))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has Joined`))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('profine is not allowed !')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()

    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${coords.lat},${coords.long}`))
        callback()
    })

    socket.on('disconnect', (socket) => {

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateMessage(`${user.username} has left`))
        }

    })
})


server.listen(port, () => {
    console.log("server is connected to port : " + port)
})
