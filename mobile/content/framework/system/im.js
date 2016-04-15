/**
 * Module dependencies.
 */

let WebSocket = require('ws');

let { ImWebSocket } = require('../../constants/appLinks');
let AppStore = require('../store/appStore');
//let _socket = new WebSocket(ImHost + 't001');

/**
 * Module exports
 */

module.exports = IM;

/**
 * `IM` constructor.
 *
 * @api public
 */

function IM() {
  this.readyState = 'closed';
  this.uri = ImWebSocket + AppStore.getToken();
}

IM.prototype.init =
  IM.prototype.open =
    IM.prototype.connect = () => {
      if (this.readyState === WebSocket.OPEN) return this;

      console.log('opening %s', this.uri);
      this.readyState = 'opening';
      this.engine = new WebSocket(this.uri);

      let _socket = this.engine;
      _socket.onopen = () => {
        // connection opened
        this.readyState = 'open';
        console.log('###### onopen');
        //_socket.send('something');
      };

      _socket.onMessage = (e) => {
        // a message was received
        console.log('###### onmessage');
        console.log(e.data);
      };

      _socket.onerror = (e) => {
        console.log('###### onerror');
        this.readyState = 'closed';
        // an error occurred
        console.log(e.message);
      };

      _socket.onclose = (e) => {
        // connection closed
        this.readyState = 'closed';
        console.log('###### onclose');
        console.log(e.code, e.reason);
      };
    };

IM.prototype.send = (data, cb) => {
  if (this.readyState !== WebSocket.OPEN) return;
  let _socket = this.engine;
  _socket.send(data, cb);
};

let IMtmp = {
  _param: {
    userId: 'test-user',
    orderType: null,
    orderId: null,
    to: null,
    lastUpdateTime: null,
    imEnterSend: false,
    sendPrompt: 'Ctrl + Enter',
    isConnected: false,
    showHint: true,
    indicator: '服务器连接失败，请联系管理员～',
    msgNew: false
  },
  _dataset: [],
  _messages: [],
  _orderInfo: {},
};
