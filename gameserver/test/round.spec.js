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
});