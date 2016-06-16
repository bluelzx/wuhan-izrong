let Manager = require('./manager');
let Resolver = require('./resolver');
let { ImHost } = require('../../../config');

let _socket = null;
let _token = null;

let time = null;

let _sendPing = function() {
  console.log('######################send ping' + time);
  setTimeout(()=>{
    _socket && _socket.sendStr('IM_SERVER_PING',(error)=>{
      console.log('######################send ping error!' + error);
    });
  },1000);

}

let unit = 1 * 60 * 1000;//1分钟
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
    console.log('##############reconnect');
    this.init(_token);
    _sendPing();
  },


  init: function (token) {
    _token = token;

    let newUrl = _getUrl(token);

    this.uri = newUrl;

    _socket = Manager(this.uri);

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
      console.log('###### close ');
    });

    _socket.on('reconnect', function (attempt) {
      console.log('###### reconnect after %d attempt', attempt);
    });

    _socket.on('error', function (attempt) {
      console.log('###### websocket error', attempt);
      //setTimeout(()=>{
      //  _socket&&_socket.open();
      //},10000);
    });

   // _socket.sendPing();
  },

  sendSyncReq: () => {
    //let userInfo = ContactSotre.getUserInfo();
    //let lastSyncTime = userInfo.lastSyncTime;
    //let message = {command: COMMAND_TYPE.SYNC_REQ,lastSyncTime:lastSyncTime};
    //_send(message);
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
