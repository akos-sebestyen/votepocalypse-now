module.exports = class Player{
    constructor(playerId, playerName){
        this.playerId = playerId;
        this.playerName = playerName;
        this.hasJoined = false;
    }
}