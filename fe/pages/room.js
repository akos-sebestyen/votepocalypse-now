import io from 'socket.io-client';
import React from 'react';
import Router from 'next/router'
import stateService from '../service'

export default class Room extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: props.url.query.r,
            players: [],
            currentPlayerId: stateService.currentPlayer ? stateService.currentPlayer.playerId : null
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

        stateService.socket.emit('JOIN_ROOM', {roomId: this.state.roomId, playerName: stateService.playerName});

        stateService.socket.on('ROOM_JOINED', this.onRoomJoined);
        stateService.socket.on('ROOM_NOT_FOUND', this.onRoomNotFound);
        stateService.socket.on('PLAYERS_UPDATED', this.onPlayersUpdated);
    }

    componentWillUnmount(){
        stateService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
        stateService.socket.removeListener('ROOM_NOT_FOUND', this.onRoomNotFound);
        stateService.socket.removeListener('PLAYERS_UPDATED', this.onPlayersUpdated);
    }

    render(){
        return (
            <div>
                <div>
                    <h3>Room {this.state.roomId}</h3>
                </div>
                <ul>
                    {this.state.players.map((player) => {
                        const itemStyle = {};
                        if(this.state.currentPlayerId === player.playerId)
                            itemStyle.backgroundColor = "#b2cfff";
                        return (<li style={itemStyle} key={player.playerId}>{player.playerName}</li>)
                    })}
                </ul>

            </div>
        )
    }
}