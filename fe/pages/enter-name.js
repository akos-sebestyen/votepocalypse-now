import io from 'socket.io-client';
import React from 'react';
import Router from 'next/router'
import stateService from '../service'

export default class Create extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }

    componentDidMount(){
        if(!stateService.roomId) Router.push('/');
    }

    onSubmit(e){
        e.preventDefault();
        stateService.playerName = this.state.name;
        Router.push({
            pathname: '/room',
            query: {r: stateService.roomId}
        });
        stateService.socket.emit('NAME_CONFIRMED', {roomId: stateService.roomId});
    }

    onNameChange(e){
        const name = e.target.value;
        stateService.socket.emit('NAME_UPDATED', {roomId: stateService.roomId, name});
        this.setState(Object.assign({}, this.state, {name}));
    }

    render(){
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <h2>Enter your name</h2>
                    <input placeholder="Enter your name" value={this.state.name} onChange={this.onNameChange} />
                    <button type="submit">GO!</button>
                </form>
            </div>
        )
    }
}