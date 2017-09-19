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

    onGameStateUpdate({type, state}){
        console.log(`Game state update:type: ${type}`);
        console.log(`Game state update:state:`, state);
        this.setState(state);
    }

    onRoundUpdated({type, state}){
        console.log(`Round update:type: ${type}`);
        console.log(`Round update:state:`, state);
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
        stateService.socket.on('ROUND_UPDATED', this.onRoundUpdated);
    }

    componentWillUnmount(){
        stateService.socket.removeListener('ROOM_JOINED', this.onRoomJoined);
        stateService.socket.removeListener('ROOM_NOT_FOUND', this.onRoomNotFound);
        stateService.socket.removeListener('PLAYERS_UPDATED', this.onPlayersUpdated);
        stateService.socket.removeListener('GAME_STATE_UPDATED', this.onGameStateUpdate);
        stateService.socket.removeListener('ROUND_UPDATED', this.onRoundUpdated);
    }

    renderRoundIndicator() {
        return this.state.hasStarted ? (
            <div>
                <h3>Cool Title</h3>
                <p></p>
            </div>
        ) : null

    }

    render(){
        return (
            <div>
                <div>
                    <h3>Room {this.state.roomId}</h3>
                </div>
                <div>
                    {!this.state.hasStarted ? <GameStartCountdown gameStartDate={this.state.gameStartDate}/> : null}
                </div>
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
                {this.renderRoundIndicator()}
            </div>
        )
    }
}