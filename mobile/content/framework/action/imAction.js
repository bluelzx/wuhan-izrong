let { Alert } = require('mx-artifacts');

let ImStore = require('../store/imStore');
let ImSocket = require('../network/imSocket');


// Private Functions
let _send = (data, bFlag) => {
  if (!bFlag) {
    console.log('Message sent again!');
    ImStore.saveMsg(data);
  }

  ImSocket.send(data)
    .then(() => {
      // ImStore.send();
    }).catch(() => {
      Alert('IM服务器异常,请稍后再试');
    });
};

let ImAction = {
  imInit: () => ImSocket.init(),
  sessionInit: (data) => ImStore.sessionInit(data),
  send: (data, bFlag) => _send(data, bFlag),
  receive: (data) => ImStore.saveMsg(data),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification)
};

module.exports = ImAction;
