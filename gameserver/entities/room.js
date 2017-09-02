module.exports = class Room {
    constructor(roomId, game){
        this.game = game;
        this.roomId = roomId;
        this.players = new Map();
    }

    get playersArr() {
        return Array.from(this.players.values());
    }
};