let { NetInfo } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};
let _data = {};

let AppStore = _.assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback, event = _info.CHANGE_EVENT) {
    this.on(event, callback);
  },
  removeChangeListener: function (callback, event = _info.CHANGE_EVENT) {
    this.removeListener(event, callback);
  },
  emitChange: function (event = _info.CHANGE_EVENT) {
    this.emit(event);
  },

  getNetWorkState: () => _info.netWorkState,
  getInitLoadingState: () => _info.initLoadingState,
  isLogout: () => _info.isLogout,
  isForceLogout: () => _info.isForceLogout,
  getAPNSToken: () => _data.APNSToken,
  getToken: () => _data.token || '',
  getData: () => _data || {},

  appInit: () => _appInit(),
  login: (data) => _login(data),
  logout: () => _logout(),
  forceLogout: () => _force_logout(),
  saveApnsToken: (apnsToken) => _save_apns_token(apnsToken),
  pushNotification: (data) => _push_notification(data),

});


// Private Functions
let _handleConnectivityChange = (isConnected) => {
  _info.netWorkState = isConnected;
};
let _appInit = () => {
  NetInfo.isConnected.addEventListener(
    'change',
    _handleConnectivityChange
  );
  NetInfo.isConnected.fetch().done(
    (isConnected) => {
      _info.netWorkState = isConnected;
    }
  );

  _info.initLoadingState = false;
  AppStore.emitChange();
  // Persister.getAppData((data) => {
  //   _info.initLoadingState = false;
  //   _data = data;
  //   _initOrgBean();
  //   _info.isLogout = false;
  //   AppStore.emitChange();
  // });
};
let _login = (data) => {
  _info.isLogout = false;
  _data = data;
  AppStore.emitChange();

  //Persister.getAppData((d) => {
  //  data.demoFlag = d.demoFlag;
  //  if (!d.demoFlag) {
  //    data.demoFlag = {
  //      flag: false
  //    };
  //  }
  //  Persister.saveAppData(data);
  //});
};
let _saveLoginData = () => {
  Persister.loginTest();
};

let _logout = () => {
  _data.token = null;
  Persister.clearToken();
  _info.isLogout = true;
  AppStore.emitChange();
};
let _force_logout = () => {
  _data.token = null;
  Persister.clearToken();
  _info.isLogout = true;
  _info.isForceLogout = true;
  AppStore.emitChange();
};
let _save_apns_token = (apnsToken) => {
  _data.APNSToken = apnsToken;
  Persister.saveAPNSToken(apnsToken);
  console.log('APNSToken' + apnsToken);
};
let _push_notification = (data) => {
  // _freshMessageData(action.data);
};

module.exports = AppStore;
