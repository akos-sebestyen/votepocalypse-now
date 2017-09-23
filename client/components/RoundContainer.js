import stateService from '../service'
import React from 'react';
import SetQuestionForm from "./SetQuestionForm";

export default class RoundContainer extends React.Component {
    constructor(props){
        super(props);
        this.onRoundUpdated = this.onRoundUpdated.bind(this);
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
        if(!this.state.hasStarted || (this.state.option1 || this.state.option2)) return null;

        return this.state.askingPlayerId === this.props.currentPlayerId ?
            <SetQuestionForm/> : <p>Hang tight, someone's thinking really hard</p>
    }

    renderQuestionDisplay() {
        const {option1, option2} = this.state;
        if(!option1 || !option2) return null;

        return <h3>Would you rather {option1} or {option2}?</h3>
    }

    render(){
        return (<div>
            <h3>Round {this.props.roundInfo.roundIndex + 1} of {this.props.roundInfo.roundIds.length}</h3>
            {!this.state.hasStarted ? <p>Round is starting soon...</p> : null }
            {this.renderQuestionForm()}
            {this.renderQuestionDisplay()}
        </div>);
    }
}