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

    const startRound =  (cb) => {
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
            }
        };

        const spy = sinon.spy(onAction);

        round = new Round(spy, 5);

        round.startRound(askingPlayerId, () => {
            expect(spy).to.have.been.calledTwice;
            cb();
        });
    };

    it('start a round', (cb) => {
        startRound(cb);
    });

    it('set a question for the round', (cb) => {
        startRound(()=>{
            const question = "Would you rather eat a burger or eat a hot dog";
            const option1 = "eat a burger";
            const option2 = "eat a hotdog";
            round.setQuestion(question, option1, option2);
            expect(round.state.question).to.eql(question);
            expect(round.state.option1).to.eql(option1);
            expect(round.state.option2).to.eql(option2);
            cb();
        })
    });
});