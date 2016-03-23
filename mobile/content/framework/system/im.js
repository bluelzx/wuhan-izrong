// Solution
// https://medium.com/@ekryski/how-to-actually-use-socket-io-in-react-native-39082d8d6172#.2nm5nl93p

// You need to set `window.navigator` to something in order to use the socket.io
// client. You have to do it like this in order to use the debugger because the
// debugger in React Native runs in a webworker and only has a getter method for
// `window.navigator`.
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

let React = require('react-native');
let IO = require('socket.io-client/socket.io');
let { ImHost } = require('../../../config');
let _socket = IO(ImHost, {
  transports: ['websocket'] // you need to explicitly tell it to use websockets
});

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
    _socket.on('msg.dataset', (data) => {
      //console.log('msg.dataset ===>');
      //console.log(data);

      this._param.isConnected = true;
      this._param.indicator = '';
      this._param.lastUpdateTime = data.lastUpdateTime;

      this._dataset = data.content;

      for (var i = 0; i < this._dataset.length; i++) {
        var item = this._dataset[i];
        var lastItem = item.messages[item.messages.length - 1];
        if (lastItem.isRead === false && lastItem.from != this._param.userId) {
          item.hasNew = true;
        } else {
          item.hasNew = false;
        }

        item.isActive = false
      }

      if (this._dataset.length > 0) {
        this._dataset[0].isActive = true;
        //$scope.initSession(this._dataset[0], true);
        this._param.showHint = false;
      } else {
        this._param.indicator = '无可用会话，无法发送～';
        this._param.showHint = true;
      }
    });

    _socket.on('msg.deltaDataSet', (data) => {
      //console.log('msg.deltaDataSet ===>');
      //console.log(data);

      this._param.lastUpdateTime = data.lastUpdateTime;

      var dataset = data.content;
      for (var i=0; i < dataset.length; i++ ) {
        var item = dataset[i];
        var bExisted = this._dataset.some((element, index, array) => {
          if (element.oid = item.oid) {
            Array.prototype.push.apply(element.messages, item.messages);
            element.hasNew = true;
            return true;
          }

          return false;
        });

        if (!bExisted) {
          this._dataset.push(item);
        }
      }

    });


    _socket.on('msg.received', (message) => {
      this._param.lastUpdateTime = message.createAt;

      if (message.o == this._param.orderId
        && message.orderType == this._param.orderType && message.from == this._param.to) {

        // 当前会话
        //if ($scope.flag.im) {
        //  $scope.messages.push(message);
        //} else {
        //  $scope.pushMsg(message);
        //}

        // 确认消息已读
        _socket.emit('msg.read', message.mid);

      } else {
        // 是否新的会话
        //$scope.openSession(message.o, message.orderType, message.from, false);

        //$scope.pushMsg(message);
      }

    });

    _socket.on('notice', (notice) => {
      console.log(notice.t + ' : ' + notice.c);
    });

    _socket.on('disconnect', () => { // Event:  disconnect
      //console.log('Socket:' + _socket.name + ' connetion is lost ~');
      //console.log('Please wait ~');
      this._param.isConnected = false;
      this._param.indicator = '服务器连接失败，请稍后再试～';
      this._param.showHint = true;
    });

    _socket.on('reconnect', () => {
      this._param.isConnected = true;
      this._param.indicator = '';
      this._param.showHint = false;
      _socket.emit('user.reconnect', {
        userId: this._param.userId,
        orderId: this._param.orderId,
        orderType: this._param.orderType,
        lastUpdateTime: this._param.lastUpdateTime
      });
    });

    _socket.on('new.msg', () => {
      this._param.msgNew = true;
    });

    //_socket.print();
    _socket.emit('user.login', { userId: this._param.userId }, (data) => {
      console.log(data.flag + ' : ' + data.msg);
    });
    //_socket.emit('user.login');
  }

};

module.exports = IM;
