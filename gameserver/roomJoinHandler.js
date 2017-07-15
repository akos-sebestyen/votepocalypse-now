const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');
const Room = require('./room');
const Player = require('./player');
const Game = require('./game');

module.exports = class RoomJoinHandler{
    constructor(socket){
        this.socket = socket;

        this.socket.on('CREATE_ROOM', this.createRoom.bind(this));
        this.socket.on('JOIN_ROOM', this.joinRoom.bind(this));
        this.socket.on('NAME_UPDATED', this.onNameUpdated.bind(this));
        this.socket.on('NAME_CONFIRMED', this.onNameConfirmed.bind(this));
        this.socket.on('REQUEST_GAME_START', this.onRequestGameStart.bind(this));
        this.socket.on('disconnect', this.onUserDisconnection.bind(this));
    }

    onUserDisconnection(){
        console.log('user disconnected');

        for(let key of Object.keys(rooms)){
            if(!rooms.hasOwnProperty(key)) continue;
            if(rooms[key].players.get(this.socket.id)){
                console.log(
                    "user left room",
                    rooms[key].players.delete(this.socket.id)
                );
            }
        }
    }

    createRoom(playerName) {
        console.log(playerName);

        const roomId = roomGenerator.generateName();

        this.socket.join(roomId);

        const room = new Room(roomId, new Game());

        rooms[roomId] = room;
        console.log(rooms);

        this.socket.emit('ROOM_CREATED', roomId);
    };

    joinRoom({roomId, playerName}){
        const room = rooms[roomId];

        if(!room) {
            this.socket.emit('ROOM_NOT_FOUND', roomId);
            return;
        }

        // only really join the room as a player if there is a player name
        const isPlayerJoin = playerName === "";
        let currentPlayer;
        if(isPlayerJoin){
            currentPlayer = new Player(this.socket.id, playerName);
            room.players.set(this.socket.id, currentPlayer);
        }

        this.socket.join(roomId);
        this.socket.emit('ROOM_JOINED', {isPlayerJoin, currentPlayer, players: Array.from(room.players.values())});
    };

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