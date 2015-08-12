var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var socketio_jwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
var jwt_secret = 'foo bar big secret';



app.use(express.static(__dirname + '/public'));

app.post('/login', function (req, res) {
  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, jwt_secret, { expiresInMinutes: 1 });

  res.json({token: token});
});

io.use(socketio_jwt.authorize({
  secret: jwt_secret,
  handshake: true
}));

io.on('connection', function (socket) {
  console.log(socket.decoded_token, 'connected');
  socket.on('ping', function (m) {
    socket.emit('pong', m);
  });
});

setInterval(function () {
  io.emit('time', Date());
}, 5000);

server.listen(8080, function() {
  console.log('listening on http://localhost:8080');
});