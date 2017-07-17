module.exports = class Game{
    constructor(){
        this.hasStarted = false;
    }

    startGame(cb){
        setTimeout(() => {
            this.hasStarted = true;
            cb();
        }, 15000);
        this.gameStartDate = new Date(new Date().getTime() + 5000);
        return this.gameStartDate;
    }
};