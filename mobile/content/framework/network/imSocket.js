let Manager = require('./manager');
//let { Alert, Device, Loading } = require('mx-artifacts');
let Resolver = require('./resolver');
let { ImHost } = require('../../../config');
let { COMMAND_TYPE } = require('../../constants/dictIm');
let { Platform } = require('react-native');
let ContactSotre = require('../store/contactStore');

let _socket = null;

let time = null;

let _sendPing = function() {
  console.log('######################send ping' + time);
  _socket && _socket.sendStr('IM_SERVER_PING',(error)=>{
    console.log('######################send ping error!' + error);
  });
}

let unit = 5 * 60 * 1000;//5分钟
let _setPing = function() {
  time = new Date();
  setTimeout(()=> {
    let now = new Date();
    if (now.getTime() - time.getTime() > unit) {
      _sendPing();
    }
    _setPing();
  }, 1 * 60 * 1000);  //误差在1分钟左右
}

_setPing();

let _send = function (message) {
  time = new Date();
  return new Promise((resolve, reject) => {
    _socket && _socket.send(Resolver.solve(message), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};


let _getUrl = function(token){
  return 'ws://' + ImHost + '/' + token;
};

let ImSocket = {

  disconnect: function () {
    //Alert('close');
    _socket && _socket.disconnect();
  },

  reconnect: function () {
    //Alert('reconnect');
    _socket && _socket.reconnect();
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
      Resolver.deal(data, _socket);
    });

    _socket.on('close', function (reason) {
      //_socket = null;
      console.log('###### close %s', JSON.stringify(reason));
    });

    _socket.on('reconnect', function (attempt) {
      console.log('###### reconnect after %d attempt', attempt);
    });

    _socket.on('error', function (attempt) {
      console.log('###### reconnect after %d attempt', attempt);
      //setTimeout(()=>{
      //  _socket&&_socket.open();
      //},10000);
    });

   // _socket.sendPing();
  },

  sendSyncReq: () => {
    let userInfo = ContactSotre.getUserInfo();
    let lastSyncTime = userInfo.lastSyncTime;
    let message = {msgType: COMMAND_TYPE.SYNC_REQ,lastSyncTime:lastSyncTime};
    _send(message);
  },

  send: (message)=>_send(message),
  trace: (actionType, content) => {
    //setTimeout(
    //  ()=>{_send({
    //    msgType: COMMAND_TYPE.KPI_APP,
    //    command: COMMAND_TYPE.KPI_APP,
    //    // time: new Date(),
    //    // userId: 'testUser',
    //    actionType: actionType,
    //    content: content,
    //    deviceType: Platform.OS
    //  }).then(() => {
    //    //
    //  }).catch((error) => {
    //    console.log('### KPI ### ' + error);
    //  })},
    //  0
    //);
  },
};

module.exports = ImSocket;
