import React from 'react';

export default class GameStartCountdown extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            countdownDisplay: ""
        };
        this._countdownInterval = undefined;
    }

    componentWillUpdate(nextProps){
        if(this.props.gameStartDate === nextProps.gameStartDate) return;

        if(this._countdownInterval) clearInterval(this._countdownInterval);
        if(!nextProps.gameStartDate) return;
        const gameStartDate = new Date(nextProps.gameStartDate);
        setInterval(() => {
            const timeDiff = gameStartDate.getTime() - new Date().getTime();

            if(timeDiff > 0){
                const countdownDisplay = `${('00' + Math.floor(timeDiff / 1000)).slice(-3)}.${timeDiff % 1000}`;
                this.setState({countdownDisplay});
                return;
            }

            clearInterval(this._countdownInterval);
            this.setState({countdownDisplay: "000.000"})
        }, 5);
    }

    componentWillUnmount(){
        if(this._countdownInterval) clearInterval(this._countdownInterval);
    }

    render(){
        return (<span>{this.state.countdownDisplay}</span>);
    }
}