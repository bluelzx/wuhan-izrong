/**
 * Created by baoyinghai on 16/3/23.
 */
var express = require('express');
var bodyParder = require('body-parser');
var app = require('express')();
app.use(bodyParder());
var server = require('http').Server(app);
var io = require('socket.io')(server);

var _userIds = new Map();
server.listen(3000);

var saveUserId = function(userId,socket){
  console.log('保存用户socket:' + userId);
  _userIds.set(userId, socket);
};

var getUserSocket = function(userId){
  var socket = _userIds.get(userId);
  if(!socket) {
    userId = '123';
  }
  return socket;
};

var deleteConnect = function(socket){
  var target = null;
  _userIds.forEach(function(values, key){
    if(values == socket){
      target = key;
    }
  });
  if(!!target){
    _userIds.delete(target);
  }
}

io.on('connection', function (socket) {

  socket.on('user.login', function (data){
    saveUserId(data.userId,socket);
    //socket.emit('user.login', { hello: 'world' });
  });

  socket.on('msg.send',function(object){
    console.log(object);
    var messageBody = object.messageBody;
    var userId = object.userId;
    var receiverId = object.receiverId;
    socketT = getUserSocket(receiverId);
    console.log(socket.id);
    try{
      //socketT.emit('msg.new',JSON.stringify({userId:userId, messageBody:messageBody, receiverId:receiverId}));
      socket.emit('msg.new',JSON.stringify({ messageBody:'Hello ' + messageBody + '!', receiverId:userId, userId:receiverId}));
    }catch(err){
      console.log('Error: %s', err.message);
    }
  });

  socket.on('disconnect', function () {
    console.log('socket:' + socket.id + ' delete.');
    deleteConnect(socket);
  });

});

app.post('/login', function (req, res) {
  console.log(req.body);
  res.json({ token: "hahahaha", userId:123});
});