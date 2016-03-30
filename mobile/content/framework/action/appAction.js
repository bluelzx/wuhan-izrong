let React, {
  AlertIOS
} = require('react-native');

let AppDispatcher = require('../dispatcher/appDispatcher');
let ActionTypes = require('../../constants/actionTypes');
let {
  BFetch,
  PFetch,
  UFetch
} = require('../network/fetch');
let IM = require('../system/im');

// Private Functions
let _appInit = function() {
  IM.init();
  AppDispatcher.dispatch({
    type: ActionTypes.APP_INIT
  });
};
let _notificationRegister = function(token) {
  AppDispatcher.dispatch({
    type: ActionTypes.SAVE_APNS_TOKEN,
    token: token
  });
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
let _startRPC = function(option) {
  if (!option.custLoading) {
    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_START,
    });
  }
};
let _endRPC = function(option, handle) {
  if (!option.custLoading) {
    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_END,
      handle: handle
    });
  } else {
    handle();
  }
};

let AppActions = {
  appInit: () => _appInit(),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification),
  startRPC: (option) => _startRPC(option),
  endRPC: (option, handle) => _endRPC(option, handle),
};

module.exports = AppActions;
