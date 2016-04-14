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
  saveApnsToken: (apnsToken) => _save_apns_token(apnsToken),
  getAPNSToken: () => _get_apns_token(),
  getAppToken:() => _getAppToken(),
  getToken: () => _data.token || '',
  getData: () => _data || {},
  appInit: () => _appInit(),
  register: (data)=> _register(data),
  login: (data) => _login(data),
  logout: () => _logout(),
  forceLogout: () => _force_logout(),
  pushNotification: (data) => _push_notification(data)
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
};

let _register = (data) => {
  Persister.saveAppData(data);
  AppStore.emitChange();
};

let _login = (data) => {
  Persister.saveAppData(data);
  AppStore.emitChange();

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

let _get_apns_token = () => {
  return Persister.getAPNSToken();
  console.log('APNSToken' + Persister.getAPNSToken());
};

let _getAppToken = () => {

};

let _push_notification = (data) => {
  // _freshMessageData(action.data);
};

module.exports = AppStore;
