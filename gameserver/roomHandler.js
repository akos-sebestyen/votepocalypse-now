const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');

module.exports = class RoomHandler{
    constructor(socket, room){
        this.socket = socket;
        this.room = room;

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