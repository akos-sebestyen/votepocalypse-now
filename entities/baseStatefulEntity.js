class BaseStatefulEntity {
    constructor(defaultState) {
        this._defaultState = defaultState;

        this._eventHistory = [];
        this._reducerSubscriptions = new Map();

        this.state = Object.assign({}, this._defaultState);
    }

    get eventHistory() {
        return this._eventHistory.slice(0);
    }

    subscribe(subscriptionName, cb, actionType) {
        if(this._reducerSubscriptions.has(subscriptionName)) {
            throw new Error("there is already a subscription under this name");
        }

        const subscription = { cb, actionType };

        this._reducerSubscriptions.set(subscriptionName, subscription);
    }

    unsubscribe(subscriptionName) {
        if(!this._reducerSubscriptions.has(subscriptionName)) {
            throw new Error("this subscription does not exist");
        }

        this._reducerSubscriptions.delete(subscriptionName);
    }

    applyEvent(action) {
        this._eventHistory.push(Object.assign(action, {timestamp: new Date()}));
        const state = this._reducer(this.state, action);
        this.state = state;
        if(this._postApplyCb) this._postApplyCb({type: action.type, state});
        Array.from(this._reducerSubscriptions.values()).forEach((subscription) => {
            if(subscription.actionType && subscription.actionType !== action.type) return;
            subscription.cb({type: action.type, state});
        });
    }

    resetState() {
        this.state = Object.assign({}, this._defaultState);
        this._eventHistory.forEach((event) => {
            this.state = this._reducer(this.state, event);
        });
    }

    _reducer(state, {type, payload}){
        throw new Error("implement this method");
    }
}

module.exports = BaseStatefulEntity;