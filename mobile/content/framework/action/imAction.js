let { Alert } = require('mx-artifacts');

let ImStore = require('../store/imStore');
let ImSocket = require('../network/imSocket');


// Private Functions
let _send = (data) => {
  ImStore.saveMsg(data);
  ImSocket.send(data.data)
    .then(() => {
      ImStore.send();
    }).catch(() => {
      Alert('IM服务器异常,请稍后再试');
    });
};

let ImAction = {
  imInit: () => ImSocket.init(),
  send: (data) => _send(data),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification),
};

module.exports = ImAction;
