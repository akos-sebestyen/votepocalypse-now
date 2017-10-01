import stateService from '../service'
import React from 'react';

export default class SetQuestionForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentVote: null
        };

        this.handleVote = this.handleVote.bind(this);
    }

    handleVote(value) {
        this.props.castVote(value);

        this.setState({currentVote: value});
    }

    getActiveClass(option) {
        if(this.state.currentVote !== option) return "";
        return "active";
    }

    render(){
        return (
            <div className="voting-container">
                <div id="vote-option-1"
                     onClick={() => {this.handleVote("option1")}}
                     className={`vote-option centered-flex-item ${this.getActiveClass("option1")}`}
                ><h3>{this.props.option1}</h3>
                </div>
                <div id="vote-option-2"
                     onClick={() => this.handleVote("option2")}
                     className={`vote-option centered-flex-item ${this.getActiveClass("option2")}`}
                ><h3>{this.props.option2}</h3></div>
            </div>
        )
    }
}