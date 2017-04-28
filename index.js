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

io.on('connection', function(socket){
    connectedUsers++
    console.log('A user has joined. Total Users: ' + connectedUsers);

    socket.on('disconnect', function(){
        connectedUsers--
        console.log('A user has left. Total Users: ' + connectedUsers);
    });
});

server.listen(3000, function(){
    console.log('Chat app listening on :3000')
})
