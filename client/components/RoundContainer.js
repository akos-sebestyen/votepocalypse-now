import stateService from '../service'
import React from 'react';
import SetQuestionForm from "./SetQuestionForm";
import VotingForm from "./VotingForm";

export default class RoundContainer extends React.Component {
    constructor(props){
        super(props);
        this.onRoundUpdated = this.onRoundUpdated.bind(this);
        this.castVote = this.castVote.bind(this);
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

        return <div className="container centered-flex-item "><h3>Would you rather</h3></div>
    }

    castVote(vote) {
        stateService.socket.emit('CAST_VOTE', {vote});
    }

    renderVotingForm() {
        const {option1, option2} = this.state;
        if(!option1 || !option2) return null;

        return <div className="container centered-flex-item">
            <VotingForm option1={this.state.option1} option2={this.state.option2} castVote={this.castVote}/>
        </div>;
    }

    render(){
        return (<div className="round-container">
            {!this.state.hasStarted ? <p>Round is starting soon...</p> : null }

            {this.renderQuestionForm()}
            {this.renderQuestionDisplay()}

            <div></div>
            {/*<h3>Round {this.props.roundInfo.roundIndex + 1} of {this.props.roundInfo.roundIds.length}</h3>*/}

            {this.renderVotingForm()}
        </div>);
    }
}