let React, {
  AlertIOS
} = require('react-native');

let AppStore = require('../store/appStore');

let {
  BFetch,
  PFetch,
  UFetch
} = require('../network/fetch');

// Private Functions
let _appInit = function() {
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
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification),
};

module.exports = AppActions;
