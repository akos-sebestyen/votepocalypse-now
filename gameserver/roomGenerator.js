const fs = require('fs');
const path = require('path');

class RoomGenerator{
    constructor(){
        this.nouns = fs.readFileSync(path.join(__dirname, './data/noun-list.txt'), 'ascii').split(/\r?\n/);
        this.adjectives = fs.readFileSync(path.join(__dirname, './data/adjective-list.txt'), 'ascii').split(/\r?\n/);
    }

    generateName(){
        const getRandomFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `${getRandomFromArr(this.adjectives)}-${getRandomFromArr(this.nouns)}`;
    }
}



module.exports = new RoomGenerator();