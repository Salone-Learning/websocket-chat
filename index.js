var express = require('express')
var http = require('http')
var sio = require('socket.io');

app = express()
server = http.Server(app)
io = sio(server)

var connectedUsers = 0

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    connectedUsers++
    console.log('A user has joined. Total Users: ' + connectedUsers);
    socket.broadcast.emit('system', 'A user has joined');

    socket.on('message', (msg) => {
        console.log('Message: ' + msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('typing', (msg) => {
        console.log('User is typing');
        socket.broadcast.emit('typing', msg);
    });

    socket.on('disconnect', () => {
        connectedUsers--
        console.log('A user has left. Total Users: ' + connectedUsers);
        socket.broadcast.emit('system', 'A user has left');
    });
});

server.listen(3000, () => {
    console.log('Chat app listening on :3000')
})
