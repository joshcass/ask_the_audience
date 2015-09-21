const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
var votes = {};

const app = express();

app.use(express.static('public'));

app.get('/', function (req, res){
    res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
          .listen(port, function () {
              console.log('Listening on port ' + port + '.');
          });

const io = socketIo(server);

io.on('connection', function(socket){
    console.log('a client has connected', io.engine.clientsCount);

    io.sockets.emit('usersConnected', io.engine.clientsCount);

    socket.emit('statusMessage', 'You have connected');

    socket.on('message', function(channel, message){
        if(channel === 'voteCast'){
            votes[socket.id] = message;
            io.sockets.emit('voteCount', countVotes(votes));
            socket.emit('currentVote', message);
        }
        console.log(votes);
    });

    socket.on('disconnect', function(){
        console.log('a client has disconnected', io.engine.clientsCount);
        delete votes[socket.id];
        io.sockets.emit('voteCount', countVotes(votes));
        io.sockets.emit('usersConnected', io.engine.clientsCount);
        console.log(votes);
    });
});

function countVotes(votes){
    var voteCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };
    for (vote in votes){
        voteCount[votes[vote]]++;
    }
    return voteCount;
}

module.exports = server;
