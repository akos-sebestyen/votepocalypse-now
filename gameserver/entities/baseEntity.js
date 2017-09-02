class BaseEntity {
    constructor(defaultState, postApplyCb) {
        this._defaultState = defaultState;

        this._eventHistory = [];
        this._postApplyCb = postApplyCb;

        this.state = Object.assign({}, this._defaultState);
    }

    get eventHistory() {
        return this._eventHistory.slice(0);
    }

    set postApplyCb(cb) {
        console.log("Updating entity callback", cb);
        this._postApplyCb = cb;
    }

    applyEvent(action) {
        this._eventHistory.push(Object.assign(action, {timestamp: new Date()}));
        const state = this._reducer(this.state, action);
        this.state = state;
        if(this._postApplyCb) this._postApplyCb({type: action.type, state});
    }

    _reducer(state, {type, payload}){
        throw new Error("implement this method");
    }
}

module.exports = BaseEntity;