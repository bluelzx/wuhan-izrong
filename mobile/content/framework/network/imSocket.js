let Manager = require('./manager');

let Resolver = require('./resolver');
let {ImHost } = require('../../../config');
let { COMMAND_TYPE } = require('../../constants/dictIm');

let _socket = null;

let _send = function (message) {
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

let ImSocket = {

  init: function (token,lastSyncTime) {
    if (_socket) return;
    // this.uri = ImWebSocket + AppStore.getToken();
    this.uri = 'ws://' + ImHost + '/' + token;
    //this.uri = 'ws://localhost:3000/t001';
    console.log('###### Connect to %s', this.uri);
    _socket = Manager(this.uri,{lastSyncTime:lastSyncTime});

    _socket.on('open', function () {
      console.log('###### open');
    });

    _socket.on('message', function (data) {
      //if(!!data.errMsg){
      //
      //}
      console.log('###### message %s', JSON.stringify(data));
      Resolver.deal(data);
    });

    _socket.on('close', function (reason) {
      //_socket = null;
      console.log('###### close %s', JSON.stringify(reason));
    });

    _socket.on('reconnect', function (attempt) {
      console.log('###### reconnect after %d attempt', attempt);
    });

  },

  sendSyncReq:()=>{
    let message = {msgType: COMMAND_TYPE.SYNC_REQ}
    _send(message);
  },

  send:(message)=>_send(message)
};

module.exports = ImSocket;
