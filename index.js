const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const rooms = require('./rooms');
const roomGenerator = require('./roomGenerator');
const RoomJoinHandler = require('./handlers/roomJoinHandler');

nextApp.prepare().then(() => {

    app.get('*', (req, res) => {
        return handle(req, res)
    });

    io.on('connection', function(socket){
        console.log('user connected');
        const handler = new RoomJoinHandler(socket);
    });

    http.listen(port, function(){
        console.log(`listening on *:${port}`);
    });
});

