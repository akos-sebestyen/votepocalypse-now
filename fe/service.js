import io from 'socket.io-client';

class StateService{
    constructor(){
        this.roomId = null;
    }
    get socket(){
        if(this._socket) return this._socket;
        this._socket = io('http://192.168.0.12:3001');
        return this._socket;
    }
}

export default new StateService();