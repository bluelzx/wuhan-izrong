let React, {
  AlertIOS
} = require('react-native');

let AppStore = require('../store/appStore');

let {
  BFetch,
  PFetch,
  UFetch
} = require('../network/fetch');
let IM = require('../system/im');

// Private Functions
let _appInit = function() {
  //IM.init();
  AppStore.appInit();
};
let _notificationRegister = function(token) {
  AppStore.saveApnsToken(token);
};
let _onNotification = function(notification) {
  // BFetch(api + "/MessageSearch/getPushMsg", {}, function(data) {
  //   AppDispatcher.dispatch({
  //     type: ActionTypes.PUSH_NOTIFICATION,
  //     data: data
  //   });
  // }, null, {
  //   custLoading: true
  // });
};

let AppActions = {
  appInit: () => _appInit(),
  imInit: () => new IM().init(),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification),
};

module.exports = AppActions;
