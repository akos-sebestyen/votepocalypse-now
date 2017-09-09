const BaseEntity = require("./baseEntity");

class Round extends BaseEntity {

    constructor(onRoundUpdate, startDelay, roundLengthMs){
        const defaultState = {
            askingPlayerId: null,
            roundStartDate: null,
            hasStarted: false,
            hasEnded: false,
            option1: null,
            option2: null
        };

        super(defaultState, onRoundUpdate);

        this._voteMap = new Map();
        this._votersSet = null;

        this._startDelay = startDelay || 5000;
        this._roundLengthMs = roundLengthMs || 30000;
    }

    startRound(askingPlayerId, restOfPlayers, cb) {
        setTimeout(() => {
            this.applyEvent({type: Round.EventType.START_ROUND});
            if(cb) cb();
        }, this._startDelay);

        this.applyEvent({
            type: Round.EventType.REQUEST_START_ROUND,
            payload: {
                askingPlayerId,
                restOfPlayers,
                roundStartDate: new Date(new Date().getTime() + this._startDelay)
            }
        });
    }

    setQuestion(option1, option2) {
        this.applyEvent({
            type: Round.EventType.SET_QUESTION_OPTIONS,
            payload: {option1, option2}
        });

        setTimeout(() => {
            const roundEndDate = new Date().getTime() + this._roundLengthMs;

            this.applyEvent({
                type: Round.EventType.BEGIN_VOTING,
                payload: { roundEndDate }
            });
        }, this._startDelay);
    }

    castVote(votingPlayerId, vote) {
        if(!votingPlayerId) throw new Error("must including voting player id");
        if(!this.state.canVote) throw new Error("voting has not begun yet");
        if(!(vote === "option1" || vote === "option2")) throw new Error("vote must be option1 or option2");
        if(!this._votersSet.has(votingPlayerId)) throw new Error("voter must be registered");

        this.applyEvent({
            type: Round.EventType.CAST_VOTE,
            payload: { votingPlayerId, vote }
        });

        // if everyone has voted, trigger to end round
        if(Array.from(this._votersSet.keys()).every((key) => this._voteMap.has(key))){
            this.applyEvent({type: Round.EventType.END_VOTING});
        }
    }

    getWinningOption() {
        if(!this.state.hasEnded) throw new Error("no winner yet, round has not ended");

        let option1Tally = 0;
        let option2Tally = 0;

        Array.from(this._voteMap.entries()).forEach(([playerId, vote]) => {
            if(vote === "option1") return option1Tally++;
            option2Tally++;
        });

        if(option1Tally > option2Tally) {
            return "option1";
        } else if (option1Tally === option2Tally){
            return "tie"
        }
        return "option2";
    }

    getWinningPlayers() {
        if(!this.state.hasEnded) throw new Error("no winner yet, round has not ended");

        const winningOption = this.getWinningOption();

        return Array.from(this._voteMap.entries()).reduce((acc, [playerId, vote]) => {
            if(vote === winningOption) acc.push(playerId);
            return acc;
        }, []);
    }

    getLosingPlayers() {
        if(!this.state.hasEnded) throw new Error("no winner yet, round has not ended");

        const winningOption = this.getWinningOption();

        return Array.from(this._voteMap.entries()).reduce((acc, [playerId, vote]) => {
            if(vote !== winningOption) acc.push(playerId);
            return acc;
        }, []);
    }

    _reducer(state, {type, payload}){
        switch(type){
            case Round.EventType.REQUEST_START_ROUND:
                this._votersSet = new Set(payload.restOfPlayers);
                return Object.assign({}, state, {
                    askingPlayerId: payload.askingPlayerId,
                    roundStartDate: payload.roundStartDate
                });
            case Round.EventType.START_ROUND:
                return Object.assign({}, state, {hasStarted: true});
            case Round.EventType.CAST_VOTE:
                this._voteMap.set(payload.votingPlayerId, payload.vote);
                return Object.assign({}, state);
            case Round.EventType.SET_QUESTION_OPTIONS:
                return Object.assign({}, state, {
                    option1: payload.option1,
                    option2: payload.option2
                });
            case Round.EventType.BEGIN_VOTING:
                return Object.assign({}, state, {
                    canVote: true,
                    roundEndDate: payload.roundEndDate
                });
            case Round.EventType.END_VOTING:
                return Object.assign({}, state, {
                    canVote: false,
                    hasEnded: true
                });
            default: return Object.assign({}, state);
        }
    }
};

Round.EventType = {
    REQUEST_START_ROUND: "REQUEST_START_ROUND",
    START_ROUND: "START_ROUND",
    SET_QUESTION_OPTIONS: "SET_QUESTION_OPTIONS",
    BEGIN_VOTING: "BEGIN_VOTING",
    CAST_VOTE: "CAST_VOTE",
    END_VOTING: "END_VOTING",
};

module.exports = Round;