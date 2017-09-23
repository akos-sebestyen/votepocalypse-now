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

    getRound(roundId){
        return this.roundStore.get(roundId);
    }
};