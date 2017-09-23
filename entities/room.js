module.exports = class Room {
    constructor(roomId, game){
        this.game = game;
        this.roomId = roomId;
        this.players = new Map();
        this.roundStore = new Map();
    }

    get playersArr() {
        return Array.from(this.players.values());
    }

    getCurrentRound(){
        const {roundIndex, roundIds} = this.game.state;
        return this.roundStore.get(roundIds[roundIndex]);
    }

    getRound(roundId){
        return this.roundStore.get(roundId);
    }
};