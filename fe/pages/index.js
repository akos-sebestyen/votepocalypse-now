import io from 'socket.io-client';
import React from 'react';
import Router from 'next/router'
import socketService from '../service'

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: ""
        };

        this.onCreate = this.onCreate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRoomIdInputChange = this.onRoomIdInputChange.bind(this);
        this.onRoomCreated = this.onRoomCreated.bind(this);
        this.onRoomJoined = this.onRoomJoined.bind(this);
    }

    componentDidMount(){
        socketService.socket.on('ROOM_CREATED', this.onRoomCreated);
        socketService.socket.on('ROOM_JOINED', this.onRoomJoined);
    }

    componentWillUnmount(){
        socketService.socket.removeListener('ROOM_CREATED', this.onRoomCreated);
        socketService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
    }

    onRoomCreated(payload){
        socketService.roomId = payload;
        Router.push({
            pathname: '/room',
            query: {r:payload}
        })
    }

    onRoomJoined({isPlayerJoin}){
        if(!isPlayerJoin) return;
        socketService.roomId = this.state.roomId;
        Router.push('/enter-name');
    }

    onCreate(e){
        socketService.socket.emit('CREATE_ROOM');
    }

    onSubmit(e){
        socketService.socket.emit('JOIN_ROOM', {roomId: this.state.roomId, playerName:""})
    }

    onRoomIdInputChange(e){
        this.setState(Object.assign({}, this.state, {
            roomId: e.target.value
        }))
    }

    render(){
        return (
            <div>
                <div>
                    <h2>Create Room</h2>
                    <button onClick={this.onCreate}>Create</button>
                </div>
                <div>
                    <h2>Join room</h2>
                    <input type="text" value={this.state.roomId} onChange={this.onRoomIdInputChange} />
                    <button type="submit" onClick={this.onSubmit}>Join</button>
                </div>
            </div>
        )
    }
}