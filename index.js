var express = require('express')
var http = require('http')
var sio = require('socket.io');

app = express()
server = http.Server(app)
io = sio(server)

var connectedUsers = 0
var socketMap = {}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    socket.on('login', (msg) => {
        var user = msg

        if (user) {
            connectedUsers++
            socketMap[socket.id] = user

            console.log(user + ' has joined. Total Users: ' + connectedUsers);
            socket.broadcast.emit('system', user + ' has joined');
        }
    })

    socket.on('message', (msg) => {
        var values = msg.split(":")
        var user = values[0]
        var message = values[1]

        console.log('User: ' + user + ' Message: ' + msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('typing', (msg) => {
        var user = msg

        console.log(user + ' is typing');
        socket.broadcast.emit('typing', msg);
    });

    socket.on('logout', (msg) => {
        var user = msg

        console.log(user + ' has left. Total Users: ' + connectedUsers);
        socket.broadcast.emit('system', user + ' has left');
    })

    socket.on('disconnect', () => {
        var user = socketMap[socket.id]

        if (user) {
            connectedUsers--
            console.log(user + ' has left. Total Users: ' + connectedUsers);
            socket.broadcast.emit('system', user + ' has left');
        }
    });
});

server.listen(3000, () => {
    console.log('Chat app listening on :3000')
})
