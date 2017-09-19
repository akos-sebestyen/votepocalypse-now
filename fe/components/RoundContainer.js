import stateService from '../service'
import React from 'react';
import SetQuestionForm from "./SetQuestionForm";

export default class RoundContainer extends React.Component {
    constructor(props){
        super(props);
        this.onRoundUpdated = this.onRoundUpdated.bind(this);
        this.renderQuestionForm = this.renderQuestionForm.bind(this);
        this.state = {
            askingPlayerId: null
        }
    }

    onRoundUpdated({type, state}){
        console.log(`Round update:type: ${type}`);
        console.log(`Round update:state:`, state);
        this.setState(state);
    }

    componentDidMount(){
        stateService.socket.on('ROUND_UPDATED', this.onRoundUpdated);
    }

    componentWillUnmount() {
        stateService.socket.removeListener('ROUND_UPDATED', this.onRoundUpdated);
    }

    renderQuestionForm() {
        if(!this.state.hasStarted) return null;

        return this.state.askingPlayerId === this.props.currentPlayerId ?
            <SetQuestionForm/> : <p>Hang tight, someone's thinking really hard</p>
    }

    render(){
        return (<div>
            <h3>Round {this.props.roundInfo.roundIndex + 1} of {this.props.roundInfo.roundIds.length}</h3>
            {!this.state.hasStarted ? <p>Round is starting soon...</p> : null }
            {this.renderQuestionForm()}
        </div>);
    }
}