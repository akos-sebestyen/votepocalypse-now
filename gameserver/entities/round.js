const BaseEntity = require("./baseEntity");

class Round extends BaseEntity {

    constructor(){
        super({

        });
    }

    _reducer(state, {type, payload}){
        switch(type){
            default: return Object.assign({}, state);
        }
    }
};

Round.EventType = {

};

module.exports = Round;