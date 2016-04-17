let io = require('./manager');

let _socket = null;

let ImSocket = {

  init: function () {
    _socket = io('ws://localhost:3000/t001');
    _socket.on('connect', function(){});
    _socket.on('event', function(data){});

    _socket.on('open', function () {
      console.log('###### open');
    });

    _socket.on('message', function (data) {
      console.log('###### message %s', JSON.stringify(data));
    });

    _socket.on('close', function () {
      console.log('###### close');
    });

    _socket.on('disconnect', function () { // Event:  disconnect
      console.log('Socket:' + _socket.name + ' connetion is lost ~');
      console.log('Please wait ~');
    });

    _socket.on('reconnect', function () {
      console.log('Socket:' + _socket.name + ' reconnect.');
    });

  },

  send: function (data) {
    return new Promise((resolve, reject) => {
      _socket && _socket.send(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
};

module.exports = ImSocket;
