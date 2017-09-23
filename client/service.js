import io from 'socket.io-client';

class StateService{
    constructor(){
        this.roomId = null;
    }
    get socket(){
        if(this._socket) return this._socket;
        this._socket = io();
        return this._socket;
    }
}

export default new StateService();