const BaseEntity = require("./baseStatefulEntity");
const Round = require('./round');

class Game extends BaseEntity {

    constructor(rounds, gameStartDelay){
        const roundIds = rounds.map((round) => round.id);
        const defaultState = {
            roundIds,
            roundIndex: null,
            hasStarted: false,
            gameStartDate: null
        };

        super(defaultState);

        this._startDelay  = gameStartDelay || 5000;

        this.state = Object.assign({}, this._defaultState);
    }

    startGame(cb){
        setTimeout(() => {
            this.applyEvent({type: Game.EventType.START_GAME});
            if(cb) cb();
        }, this._startDelay);

        this.applyEvent({
            type: Game.EventType.REQUEST_START_GAME,
            payload: {
                gameStartDate: new Date(new Date().getTime() + this._startDelay)
            }
        });
    }

    _reducer(state, {type, payload}){
        switch(type){
            case Game.EventType.REQUEST_START_GAME:
                return Object.assign({}, state, {gameStartDate: payload.gameStartDate});
            case Game.EventType.START_GAME:
                return Object.assign({}, state, {roundIndex:0, hasStarted: true});

            default: return Object.assign({}, state);
        }
    }
};

Game.EventType = {
    REQUEST_START_GAME: "REQUEST_START_GAME",
    START_GAME: "START_GAME"
};

module.exports = Game;