import stateService from '../service'
import React from 'react';

export default class SetQuestionForm extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (<div>
            <h3>Would you rather</h3>
            <form>
                <input placeholder="Option 1"/>
                <input placeholder="Option 2"/>
                <button>SET THE QUESTION</button>
            </form>
        </div>);
    }
}