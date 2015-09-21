var socket = io();

var forEach = Array.prototype.forEach;

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var buttons = document.querySelectorAll('#choices button');
var voteCounts = document.querySelectorAll('#vote-count li');
var currentVote = document.getElementById('current-vote');

socket.on('usersConnected', function(count){
    connectionCount.innerText = 'Connected users: ' + count;
});

socket.on('statusMessage', function(message){
    statusMessage.innerText = message;
});

socket.on('voteCount', function(counts){
    forEach.call(voteCounts, function(vote){
        vote.innerText = 'Total votes for ' + vote.id + ': ' + counts[vote.id];
    });
});

socket.on('currentVote', function(vote){
    currentVote.innerText = 'You voted for ' + vote;
});

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(){
        socket.send('voteCast', this.innerText);
    });
}
