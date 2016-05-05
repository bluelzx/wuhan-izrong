let Manager = require('./manager');
let { Alert, Device, Loading } = require('mx-artifacts');
let Resolver = require('./resolver');
let {ImHost } = require('../../../config');
let { COMMAND_TYPE } = require('../../constants/dictIm');
let {Platform} = require('react-native');

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


let _getUrl = function(token){
  return 'ws://' + ImHost + '/' + token;
}

let ImSocket = {

  disconnect:function(){
    Alert('close');
    _socket&&_socket.close();
  },

  reconnect:function(){
    Alert('reconnect');
    _socket&&_socket.open();
  },

  init: function (token,lastSyncTime) {
   // Alert('socket:' + _socket);
    let newUrl = _getUrl(token);
    if ( newUrl==this.uri && _socket) return;
    // this.uri = ImWebSocket + AppStore.getToken();
    this.uri = newUrl;
    //this.uri = 'ws://localhost:3000/t001';
    console.log('###### Connect to %s', this.uri);
    let AIBG = -1;
    if (Platform.OS === 'android') {
      AIBG = 1;
    }
    _socket = Manager(this.uri,{lastSyncTime:lastSyncTime,AIBG:AIBG});

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
