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

    it('start a round', (cb) => {
        const onAction = ({type, state}) => {
            if(type === Round.EventType.REQUEST_START_ROUND){
                expect(state.roundStartDate).to.exist;
                expect(state.hasStarted).to.eql(false);
                expect(round.eventHistory).to.have.length(1);
            }
            if(type === Round.EventType.START_ROUND){
                expect(state.hasStarted).to.eql(true);
                expect(round.eventHistory).to.have.length(2);
            }
        };

        const spy = sinon.spy(onAction);

        round = new Round(spy, 50);

        round.startRound(() => {
            expect(spy).to.have.been.calledTwice;
            cb();
        });
    });
});