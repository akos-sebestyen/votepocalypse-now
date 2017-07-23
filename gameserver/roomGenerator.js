const fs = require('fs');

class RoomGenerator{
    constructor(){
        this.nouns = fs.readFileSync('./gameserver/data/noun-list.txt', 'ascii').split(/\r?\n/);
        this.adjectives = fs.readFileSync('./gameserver/data/adjective-list.txt', 'ascii').split(/\r?\n/);
    }

    generateName(){
        const getRandomFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `${getRandomFromArr(this.adjectives)}-${getRandomFromArr(this.nouns)}`;
    }
}



module.exports = new RoomGenerator();