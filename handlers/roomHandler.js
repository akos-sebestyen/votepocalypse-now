const Game = require("../entities/game");

const rooms = require('../rooms');
const roomGenerator = require('../roomGenerator');

module.exports = class RoomHandler{
    constructor(socket, room){
        this.socket = socket;
        this.room = room;

        this.socket.on('NAME_UPDATED', this.onNameUpdated.bind(this));
        this.socket.on('NAME_CONFIRMED', this.onNameConfirmed.bind(this));
        this.socket.on('REQUEST_GAME_START', this.onRequestGameStart.bind(this));
        this.socket.on('QUESTION_SET', this.onQuestionSet.bind(this));
        this.socket.on('CAST_VOTE', this.onCastVote.bind(this));
    }

    get player(){
        return this.room.players.get(this.socket.id);
    }

    emitToRoom(type, payload){
        this.socket.to(this.room.roomId).emit(type, payload);
        this.socket.emit(type, payload);
    }

    getClientGameState(){
        const players = this.room.playersArr;
        const gameStartDate = this.room.game.gameStartDate;
        const gameState = this.room.game.state;
        const currentPlayer = this.room.players.get(this.socket.id);
        return { players, currentPlayer, gameStartDate, gameState };
    }

    onNameUpdated({roomId, name}){
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(this.socket.id);

        player.playerName = name;
        console.log('name updated', roomId, name);
        this.socket.to(roomId).emit('PLAYERS_UPDATED', {players: Array.from(room.players.values())})
    };

    getCurrentPlayer() {
        return this.room.players.get(this.socket.id);
    }

    onCastVote({vote}) {
        const currentPlayer = this.getCurrentPlayer();
        const currentRound = this.room.getCurrentRound();
        console.log("vote cast", currentPlayer.playerName, vote);

        currentRound.castVote(currentPlayer.playerId, vote);
    }

    onQuestionSet({option1, option2}){
        const currentRound = this.room.getCurrentRound();
        const currentPlayer = this.getCurrentPlayer() || {};

        console.log(`${currentPlayer.playerName} set options: ${option1},${option2}`);
        currentRound.setQuestion(option1, option2);
    };

    onNameConfirmed({roomId}){
        const room = rooms[roomId];
        if(!room) return;

        const player = room.players.get(this.socket.id);

        player.hasJoined = true;
        console.log('player joined', roomId);
        this.emitToRoom('PLAYERS_UPDATED', {players: room.playersArr});
    };

    onRequestGameStart(){
        if(this.room.game.gameStartDate){
            console.log(`Game start already requested for ${this.room.game.gameStartDate.toISOString()}`);
            return;
        }

        this.room.game.subscribe('on-game-start', ({state}) => {
            console.log("Game is starting", state);

            const currentRound = this.room.getCurrentRound();

            currentRound.subscribe('notify-client-round', ({type, state}) => {
                const currentRound = this.room.getCurrentRound();

                if(state.hasEnded){
                    Object.assign(state, {
                        winningPlayers: currentRound.getWinningPlayers(),
                        losingPlayers: currentRound.getLosingPlayers(),
                        winningOption: currentRound.getWinningOption()
                    });
                }
                this.emitToRoom('ROUND_UPDATED', {type, state});
            });

            const otherPlayers = this.room.playersArr.filter((player) => player.playerId !== this.player.playerId);

            const currPlayerId = this.player.playerId;
            const otherPlayerIds = otherPlayers.map((player) => player.playerId);

            console.log('currPlayerId', currPlayerId);
            console.log('otherPlayerIds', otherPlayerIds);

            currentRound.startRound(currPlayerId, otherPlayerIds);
        }, Game.EventType.START_GAME);

        this.room.game.subscribe('notify-client', ({type, state}) => {
            this.emitToRoom('GAME_STATE_UPDATED', {type, state});
        });

        console.log(`${this.player.playerName} wants to start the game`);
        this.room.game.startGame();
        console.log(`Game starting at ${this.room.game.state.gameStartDate.toISOString()}`);
    };
};