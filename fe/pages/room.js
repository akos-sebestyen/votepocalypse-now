import io from 'socket.io-client';
import React from 'react';
import Router from 'next/router'
import socketService from '../service'

export default class Room extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: props.url.query.r,
            players: []
        };

        this.onRoomJoined = this.onRoomJoined.bind(this);
        this.onRoomNotFound = this.onRoomNotFound.bind(this);
        this.onPlayersUpdated = this.onPlayersUpdated.bind(this);
    }

    onRoomJoined({players}){
        this.setState(Object.assign({}, this.state, {players}));
    }

    onRoomNotFound(payload){
        console.error('Room not found', payload);
        Router.push('/');
    }

    onPlayersUpdated({players}){
        this.setState(Object.assign({}, this.state, {players}));
    }

    componentDidMount(){
        if(!this.state.roomId) {
            Router.push('/');
            return;
        }

        socketService.socket.emit('JOIN_ROOM', {roomId: this.state.roomId, playerName: socketService.playerName});

        socketService.socket.on('ROOM_JOINED', this.onRoomJoined);
        socketService.socket.on('ROOM_NOT_FOUND', this.onRoomNotFound);
        socketService.socket.on('PLAYERS_UPDATED', this.onPlayersUpdated);
    }

    componentWillUnmount(){
        socketService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
        socketService.socket.removeListener('ROOM_NOT_FOUND', this.onRoomNotFound);
        socketService.socket.removeListener('PLAYERS_UPDATED', this.onPlayersUpdated);
    }

    render(){
        return (
            <div>
                <div>
                    <h3>Room {this.state.roomId}</h3>
                </div>
                <ul>
                    {this.state.players.map((player) => <li key={player.playerId}>{player.playerName}</li>)}
                </ul>

            </div>
        )
    }
}