const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');

class Room{
    constructor(roomId){
        this.roomId = roomId;
        this.players = new Map();
    }
}

class Player{
    constructor(playerId, playerName){
        this.playerId = playerId;
        this.playerName = playerName;
        this.hasJoined = false;
    }
}

app.get('/', function(req, res){
    res.send("hello world");
});



io.on('connection', function(socket){
    console.log('user connected');
    const createRoom = (playerName) => {
        console.log(playerName);

        const roomId = roomGenerator.generateName();

        socket.join(roomId);

        const room = new Room(roomId);

        rooms[roomId] = room;
        console.log(rooms);

        socket.emit('ROOM_CREATED', roomId);
    };

    const joinRoom = ({roomId, playerName}) => {
        const room = rooms[roomId];

        if(!room) {
            socket.emit('ROOM_NOT_FOUND', roomId);
            return;
        }

        // only really join the room as a player if there is a player name
        const isPlayerJoin = playerName === "";
        let currentPlayer;
        if(isPlayerJoin){
            currentPlayer = new Player(socket.id, playerName);
            room.players.set(socket.id, currentPlayer);
        }

        socket.join(roomId);
        socket.emit('ROOM_JOINED', {isPlayerJoin, currentPlayer, players: Array.from(room.players.values())});
    };

    const onNameUpdated = ({roomId, name}) => {
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(socket.id);

        player.playerName = name;
        console.log('name updated', roomId, name);
        socket.to(roomId).emit('PLAYERS_UPDATED', {players: Array.from(room.players.values())})
    };

    const onNameConfirmed = ({roomId}) => {
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(socket.id);

        player.hasJoined = true;
        console.log('player joined', roomId);
        socket.to(roomId).emit('PLAYERS_UPDATED', {players: Array.from(room.players.values())})
    };

    socket.on('disconnect', function(){
        console.log('user disconnected');

        for(let key of Object.keys(rooms)){
            if(!rooms.hasOwnProperty(key)) continue;
            if(rooms[key].players.get(socket.id)){
                console.log(
                    "user left room",
                    rooms[key].players.delete(socket.id)
                );
            }
        }
    });

    socket.on('CREATE_ROOM', createRoom);
    socket.on('JOIN_ROOM', joinRoom);
    socket.on('NAME_UPDATED', onNameUpdated);
    socket.on('NAME_CONFIRMED', onNameConfirmed);
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});