import stateService from '../service'
import React from 'react';

export default class SetQuestionForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            option1: "",
            option2: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {option1, option2} = this.state;
        stateService.socket.emit('QUESTION_SET', {option1, option2});
    }

    onOptionChange(e){
        const {name, value} = e.target;
        this.setState(Object.assign({}, this.state, {[name]: value}));
    }

    render(){
        return (<div>
            <h3>Would you rather</h3>
            <form onSubmit={this.handleSubmit}>
                <input name="option1" onChange={this.onOptionChange} placeholder="Option 1"/>
                <input name="option2" onChange={this.onOptionChange} placeholder="Option 2"/>
                <button type="submit">SET THE QUESTION</button>
            </form>
        </div>);
    }
}