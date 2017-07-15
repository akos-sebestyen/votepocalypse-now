const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');
const Room = require('./room');
const Player = require('./player');
const Game = require('./game');


// TODO NOT DONE YET.
// todo figure out a clever way to hook into this handler from the other handler that makes sense...
module.exports = class RoomHandler{
    constructor(socket){
        this.socket = socket;

        this.socket.on('NAME_UPDATED', this.onNameUpdated.bind(this));
        this.socket.on('NAME_CONFIRMED', this.onNameConfirmed.bind(this));
        this.socket.on('REQUEST_GAME_START', this.onRequestGameStart.bind(this));
    }

    onNameUpdated({roomId, name}){
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(this.socket.id);

        player.playerName = name;
        console.log('name updated', roomId, name);
        this.socket.to(roomId).emit('PLAYERS_UPDATED', {players: Array.from(room.players.values())})
    };

    onNameConfirmed({roomId}){
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(this.socket.id);

        player.hasJoined = true;
        console.log('player joined', roomId);
        this.socket.to(roomId).emit('PLAYERS_UPDATED', {players: Array.from(room.players.values())})
    };

    onRequestGameStart(){

    };
};