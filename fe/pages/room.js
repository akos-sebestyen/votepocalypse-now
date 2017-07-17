import io from 'socket.io-client';
import React from 'react';
import Router from 'next/router'
import stateService from '../service'
import GameStartCountdown from '../components/GameStartCountdown';

export default class Room extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: props.url.query.r,
            players: [],
            currentPlayerId: stateService.currentPlayer ? stateService.currentPlayer.playerId : null,
            gameStartDate: null
        };

        this.onRoomJoined = this.onRoomJoined.bind(this);
        this.onRoomNotFound = this.onRoomNotFound.bind(this);
        this.onPlayersUpdated = this.onPlayersUpdated.bind(this);
        this.getCurrentPlayer = this.getCurrentPlayer.bind(this);
        this.onStartGameClick = this.onStartGameClick.bind(this);
        this.onGameStateUpdate = this.onGameStateUpdate.bind(this);
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

    getCurrentPlayer(){
        return this.state.players.find((player) => player.playerId === this.state.currentPlayerId);
    }

    onStartGameClick(){
        stateService.socket.emit('REQUEST_GAME_START');
    }

    onGameStateUpdate({gameStartDate}){
        console.log('GAME START REQUESTED', gameStartDate);
        this.setState({gameStartDate});
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
        stateService.socket.on('GAME_STATE_UPDATED', this.onGameStateUpdate);
    }

    componentWillUnmount(){
        stateService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
        stateService.socket.removeListener('ROOM_NOT_FOUND', this.onRoomNotFound);
        stateService.socket.removeListener('PLAYERS_UPDATED', this.onPlayersUpdated);
        stateService.socket.removeListener('GAME_STATE_UPDATED', this.onGameStateUpdate);
    }

    render(){
        return (
            <div>
                <div>
                    <h3>Room {this.state.roomId}</h3>
                </div>
                <div><GameStartCountdown gameStartDate={this.state.gameStartDate}/></div>
                <ul>
                    {this.state.players.map((player) => {
                        const itemStyle = {};

                        if(this.state.currentPlayerId === player.playerId)
                            itemStyle.backgroundColor = "#b2cfff";
                        if(!player.hasJoined)
                            itemStyle.opacity = 0.4;
                        return (<li style={itemStyle} key={player.playerId}>{player.playerName}</li>)
                    })}
                </ul>
                <div>
                    {this.state.currentPlayerId && !this.state.gameStartDate ? (<button onClick={this.onStartGameClick}>Start Game</button>) : undefined}
                </div>
            </div>
        )
    }
}