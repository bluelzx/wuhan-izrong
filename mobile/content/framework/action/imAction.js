let { Alert } = require('mx-artifacts');

let ImStore = require('../store/imStore');
let ImSocket = require('../network/imSocket');

let AppLinks = require('../../constants/appLinks');
let { UFetch } = require('../network/fetch');
// Private Functions
let _send = (data, bFlag = false) => {
  if (bFlag) {
    console.log('Message sent again!');
  } else {
    ImStore.saveMsg(data);
  }

  ImSocket.send(data)
    .then(() => {
      // ImStore.send();
    }).catch(() => {
      Alert('IM服务器异常,请稍后再试');
    });
};

let _uploadImage = function (url, fileFieldName) {
  return new Promise((resolve, reject) => {
    UFetch(url, {
      uri: fileFieldName,
      type: 'image/jpeg',
      name: fileFieldName
    }).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let ImAction = {
  imInit: () => ImSocket.init(),
  sessionInit: function(data) {
    ImStore.sessionInit(data);
    //ImSocket.init();
  },
  send: (data, bFlag) => _send(data, bFlag),
  receive: (data) => ImStore.saveMsg(data),
  uploadImage: (fileFieldName) => _uploadImage(AppLinks.uploadFile, fileFieldName),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification)
};

module.exports = ImAction;
