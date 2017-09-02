const BaseEntity = require("./baseEntity");

class Round extends BaseEntity {

    constructor(onRoundUpdate, startDelay){
        const defaultState = {
            roundStartDate: null,
            hasStarted: false
        };

        super(defaultState, onRoundUpdate);

        this._startDelay = startDelay || 5000;
    }

    startRound(cb) {
        setTimeout(() => {
            this.applyEvent({type: Round.EventType.START_ROUND});
            if(cb) cb();
        }, this._startDelay);

        this.applyEvent({
            type: Round.EventType.REQUEST_START_ROUND,
            payload: {
                roundStartDate: new Date(new Date().getTime() + this._startDelay)
            }
        });
    }


    _reducer(state, {type, payload}){
        switch(type){
            case Round.EventType.REQUEST_START_ROUND:
                return Object.assign({}, state, {roundStartDate: payload.roundStartDate});
            case Round.EventType.START_ROUND:
                return Object.assign({}, state, {hasStarted: true});
            default: return Object.assign({}, state);
        }
    }
};

Round.EventType = {
    REQUEST_START_ROUND: "REQUEST_START_ROUND",
    START_ROUND: "START_ROUND"
};

module.exports = Round;