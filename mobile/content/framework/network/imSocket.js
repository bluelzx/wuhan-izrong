let Manager = require('./manager');

let { ImWebSocket } = require('../../constants/appLinks');
let AppStore = require('../store/appStore');
let Resolver = require('./resolver');

let _socket = null;

let ImSocket = {

  init: function () {
    // this.uri = ImWebSocket + AppStore.getToken();
    this.uri = 'ws://localhost:3000/t001';
    console.log('###### Connect to %s', this.uri);
    _socket = Manager(this.uri);

    _socket.on('open', function () {
      console.log('###### open');
    });

    _socket.on('message', function (data) {
      console.log('###### message %s', JSON.stringify(data));
      Resolver.deal(data);
    });

    _socket.on('close', function (reason) {
      console.log('###### close %s', JSON.stringify(reason));
    });

    _socket.on('reconnect', function (attempt) {
      console.log('###### reconnect after %d attempt', attempt);
    });

  },

  send: function (message) {
    return new Promise((resolve, reject) => {
      _socket && _socket.send(Resolver.solve(message), (error) => {
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
