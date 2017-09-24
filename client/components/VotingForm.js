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

    handleVote(e) {
        const {value} = e.target;

        console.log(e.target);
        this.props.castVote(value);

        this.setState({currentVote: value});
    }

    getActiveClass(option) {
        if(this.state.currentVote !== option) return null;
        return "active";
    }

    render(){
        return (
            <div>
                <button type="button"
                        value="option1"
                        onClick={this.handleVote}
                        className={this.getActiveClass("option1")}
                >{this.props.option1}</button>
                <button type="button"
                        value="option2"
                        onClick={this.handleVote}
                        className={this.getActiveClass("option2")}
                >{this.props.option2}</button>
            </div>
        )
    }
}