describe('Game', function() {
    const {expect, use} = require("chai");
    const sinon = require("sinon");
    const sinonChai = require("sinon-chai");
    use(sinonChai);

    const Game = require('../entities/game');

    let game;

    beforeEach(() => {
        game = new Game(undefined, 50);
    });

    it('begin with an empty game state', () => {
        expect(game.state).to.eql(game._defaultState);
    });

    it('provide a history of game events', () => {
        expect(game.eventHistory).to.have.length(0);
        game.applyEvent({type: "FAKE_EVENT"});
        expect(game.eventHistory).to.have.length(1);
    });

    it('apply unrecognized event, but change game state', () => {
        game.applyEvent({type: "FAKE_EVENT"});
        expect(game.eventHistory).to.have.length(1);
        expect(game.state).to.eql(game._defaultState);
    });

    it('start a game', (cb) => {

        const onAction = ({type, state}) => {
            if(type === Game.EventType.REQUEST_START_GAME){
                expect(state.gameStartDate).to.exist;
                expect(state.hasStarted).to.eql(false);
                expect(game.eventHistory).to.have.length(1);
            }
            if(type === Game.EventType.START_GAME){
                expect(state.roundIndex).to.eql(0);
                expect(state.hasStarted).to.eql(true);
                expect(game.eventHistory).to.have.length(2);
            }
        };

        const spy = sinon.spy(onAction);

        game = new Game(spy, 50);

        game.startGame(() => {
            expect(spy).to.have.been.calledTwice;
            cb();
        });
    });

});