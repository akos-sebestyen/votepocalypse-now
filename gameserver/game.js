class Game{

    constructor(onGameStateUpdateCb, gameStartDelay){
        this.hasStarted = false;
        this.onGameStateUpdateCb = onGameStateUpdateCb;

        this._startDelay  = gameStartDelay || 15000;
        this._defaultState = {
            roundIndex: null,
            rounds: [],
            hasStarted: false,
            gameStartDate: null
        };

        this._eventHistory = [];

        this.state = Object.assign({}, this._defaultState);
    }

    get eventHistory(){
        return this._eventHistory.slice(0);
    }

    applyEvent(action){
        this._eventHistory.push(Object.assign(action, {timestamp: new Date()}));
        const state = this._gameStateReducer(this.state, action);
        this.state = state;
        if(this.onGameStateUpdateCb) this.onGameStateUpdateCb({type: action.type, state});
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

    _gameStateReducer(state, {type, payload}){
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