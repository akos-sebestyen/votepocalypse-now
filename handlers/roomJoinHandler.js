const rooms = require('../rooms');
const roomGenerator = require('../roomGenerator');
const Room = require('../entities/room');
const Player = require('../entities/player');
const Game = require('../entities/game');
const Round = require('../entities/round');
const RoomHandler = require('./roomHandler');

module.exports = class RoomJoinHandler{
    constructor(socket){
        this.socket = socket;
        this._roomHandler = null;

        this.socket.on('CREATE_ROOM', this.createRoom.bind(this));
        this.socket.on('JOIN_ROOM', this.joinRoom.bind(this));
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

        const rounds = [];

        for(let i = 0; i < 4; i++){
            const round = new Round();
            rounds.push(round);
        }

        const game = new Game(rounds);
        const room = new Room(roomId, game);

        rounds.forEach((round) => room.roundStore.set(round.id, round));

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

        if(!this._roomHandler) {
            this._roomHandler = new RoomHandler(this.socket, room);
        } else {
            this._roomHandler.room = room;
        }

        this.socket.emit('ROOM_JOINED', this._roomHandler.getClientGameState());
    };
};