## Why
I wanted to try socket.io and Next.js for a while so...

![Why not both](http://i.imgur.com/IdQ5FQF.png)

## Specs
AC
* 0.1.0
    * ✔ create a room with an access code
    * ✔ people join a room and enter a name
    * ✔ lists people's names in room
* 0.1.1
    * ✔ highlight current users name
    * ✔ denote users who are mid join
    * ✔ highlight which users have joined the room
    * ✔ shorten room ids
    
* 0.2.0  
    * joined users can toggle ready check
    * when all users ready, 10 second countdown begins
    * when countdown over, game begins
    
* 0.3.0  
    * ✔ refactor into handlers
    * implement start game button that updates game state across all clients
    
* 1.0 
    * TODO: make game
    
## Setup
### fe
    $ yarn
    $ yarn dev
    
### gameserver
    $ yarn
    $ yarn start
    
    
    