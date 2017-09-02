const BaseEntity = require("./baseEntity");

class Round extends BaseEntity {

    constructor(onRoundUpdate, startDelay){
        const defaultState = {
            askingPlayerId: null,
            roundStartDate: null,
            hasStarted: false,
            question: null,
            option1: null,
            option2: null
        };

        super(defaultState, onRoundUpdate);

        this._startDelay = startDelay || 5000;
    }

    startRound(askingPlayerId, cb) {
        setTimeout(() => {
            this.applyEvent({type: Round.EventType.START_ROUND});
            if(cb) cb();
        }, this._startDelay);

        this.applyEvent({
            type: Round.EventType.REQUEST_START_ROUND,
            payload: {
                askingPlayerId,
                roundStartDate: new Date(new Date().getTime() + this._startDelay)
            }
        });
    }

    setQuestion(question, option1, option2) {
        this.applyEvent({
            type: Round.EventType.SET_QUESTION,
            payload: {question, option1, option2}
        })
    }

    _reducer(state, {type, payload}){
        switch(type){
            case Round.EventType.REQUEST_START_ROUND:
                return Object.assign({}, state, {
                    askingPlayerId: payload.askingPlayerId,
                    roundStartDate: payload.roundStartDate
                });
            case Round.EventType.START_ROUND:
                return Object.assign({}, state, {hasStarted: true});
            case Round.EventType.SET_QUESTION:
                return Object.assign({}, state, {
                    question: payload.question,
                    option1: payload.option1,
                    option2: payload.option2
                });
            default: return Object.assign({}, state);
        }
    }
};

Round.EventType = {
    REQUEST_START_ROUND: "REQUEST_START_ROUND",
    START_ROUND: "START_ROUND",
    SET_QUESTION: "SET_QUESTION"
};

module.exports = Round;