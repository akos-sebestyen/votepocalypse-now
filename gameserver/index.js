const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');
const RoomJoinHandler = require('./handlers/roomJoinHandler');

app.get('/', function(req, res){
    res.send("hello world");
});

io.on('connection', function(socket){
    console.log('user connected');
    const handler = new RoomJoinHandler(socket);
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});