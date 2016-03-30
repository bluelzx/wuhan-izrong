let React = require('react-native');
//var WebSocket = require('ws');

let { ImHost } = require('../../../config');
let _socket = new WebSocket(ImHost);

let IM = {
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
  init: function () {
    _socket.onopen = () => {
      // connection opened
      console.log('###### onopen');
      _socket.send('something');
    };

    _socket.onmessage = (e) => {
      // a message was received
      console.log('###### onmessage');
      console.log(e.data);
    };

    _socket.onerror = (e) => {
      console.log('###### onerror');
      // an error occurred
      console.log(e.message);
    };

    _socket.onclose = (e) => {
      // connection closed
      console.log('###### onclose');
      console.log(e.code, e.reason);
    };
  }

};

module.exports = IM;
