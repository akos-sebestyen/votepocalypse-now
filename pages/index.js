import React from 'react';
import Router from 'next/router'
import stateService from '../client/service'

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
        stateService.socket.on('ROOM_CREATED', this.onRoomCreated);
        stateService.socket.on('ROOM_JOINED', this.onRoomJoined);
    }

    componentWillUnmount(){
        stateService.socket.removeListener('ROOM_CREATED', this.onRoomCreated);
        stateService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
    }

    onRoomCreated(payload){
        stateService.roomId = payload;
        Router.push({
            pathname: '/room',
            query: {r:payload}
        })
    }

    onRoomJoined({currentPlayer}){
        if(!currentPlayer) return;
        stateService.roomId = this.state.roomId;
        stateService.currentPlayer = currentPlayer;
        Router.push('/enter-name');
    }

    onCreate(e){
        stateService.socket.emit('CREATE_ROOM');
    }

    onSubmit(e){
        e.preventDefault();
        stateService.socket.emit('JOIN_ROOM', {roomId: this.state.roomId, playerName:""})
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
                <form onSubmit={this.onSubmit}>
                    <h2>Join room</h2>
                    <input type="text" value={this.state.roomId} onChange={this.onRoomIdInputChange} />
                    <button type="submit">Join</button>
                </form>
            </div>
        )
    }
}