describe('Round', function() {
    const {expect, use} = require("chai");
    const sinon = require("sinon");
    const sinonChai = require("sinon-chai");
    use(sinonChai);

    const Round = require('../entities/round');

    let round;

    beforeEach(() => {
        round = new Round();
    });

    it('provide a history of round events', () => {
        expect(round.eventHistory).to.have.length(0);
        round.applyEvent({type: "FAKE_EVENT"});
        expect(round.eventHistory).to.have.length(1);
    });

    it('apply unrecognized event, but change round state', () => {
        round.applyEvent({type: "FAKE_EVENT"});
        expect(round.eventHistory).to.have.length(1);
        expect(round.state).to.eql(round._defaultState);
    });

    const startRound = (spy, askingPlayerId, endCb) => {
        const spyCb = ({type, state}) => {
            spy({type, state});
            if(type === Round.EventType.START_ROUND){
                if(endCb) endCb();
            }
        };

        round = new Round(spyCb, 5, 5);

        round.startRound(askingPlayerId);
    };

    const setQuestion = (onAction, option1, option2) => {
        const askingPlayerId = "player1";

        const spy = sinon.spy(onAction);

        startRound(spy, askingPlayerId, () => {
            round.setQuestion(option1, option2);
        });
    };

    it('start a round', (cb) => {
        const askingPlayerId = "player1";
        const onAction = ({type, state}) => {
            if (type === Round.EventType.REQUEST_START_ROUND) {
                expect(state.roundStartDate).to.exist;
                expect(state.hasStarted).to.eql(false);
                expect(state.askingPlayerId).to.eql(askingPlayerId);
                expect(round.eventHistory).to.have.length(1);
            }
            if (type === Round.EventType.START_ROUND) {
                expect(state.hasStarted).to.eql(true);
                expect(round.eventHistory).to.have.length(2);
                expect(spy).to.have.been.calledTwice;
            }

        };
        const spy = sinon.spy(onAction);

        startRound(spy, askingPlayerId, cb);
    });

    it('set a question for the round', (cb) => {
        const option1 = "eat a hamburger";
        const option2 = "eat a hotdog";

        const onAction = ({type, state}) => {
            if (type === Round.EventType.SET_QUESTION_OPTIONS) {
                expect(state.option1).to.eql(option1);
                expect(state.option2).to.eql(option2);
                cb();
            }
        };

        setQuestion(onAction, option1, option2);
    });

    it('set a should start and end voting', (cb) => {
        const option1 = "eat a hamburger";
        const option2 = "eat a hotdog";

        const onAction = ({type, state}) => {
            if (type === Round.EventType.BEGIN_VOTING) {
                expect(state.canVote).to.eql(true);
            }

            if (type === Round.EventType.END_VOTING) {
                expect(state.canVote).to.eql(false);
                cb();
            }
        };
        setQuestion(onAction, option1, option2);
    });

    it('cast a vote once voting has begun', (cb) => {
        const option1 = "eat a hamburger";
        const option2 = "eat a hotdog";

        const onAction = ({type, state}) => {
            if (type === Round.EventType.BEGIN_VOTING) {
                round.castVote("player2", "option1");
                round.castVote("player3", "option1");
                round.castVote("player4", "option2");
            }

            if (type === Round.EventType.END_VOTING) {
                const votes = round.eventHistory.filter((event) => event.type === Round.EventType.CAST_VOTE);
                expect(votes).to.have.length(3);
                cb();
            }
        };

        setQuestion(onAction, option1, option2);
    });
});