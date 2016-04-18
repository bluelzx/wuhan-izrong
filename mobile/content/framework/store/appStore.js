let { NetInfo } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};

let DeviceInfo = require('react-native-device-info');
let _device = {
  id: DeviceInfo.getUniqueID()
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

  getDeviceId: () => _device.id,
  getNetWorkState: () => _info.netWorkState,
  getInitLoadingState: () => _info.initLoadingState,
  isLogout: () => _info.isLogout,
  isForceLogout: () => _info.isForceLogout,
  saveApnsToken: (apnsToken) => _save_apns_token(apnsToken),
  getAPNSToken: () => _get_apns_token(),
  getToken: () => _data.token || '',
  appInit: () => _appInit(),
  register: (data)=> _register(data),
  login: (data) => _login(data),
  logout: () => _logout(),
  forceLogout: () => _force_logout(),
  getUserId: () => _getUserId(),
  getLoginUserInfo: () => _getLoginUserInfo(),
  getOrgByOrgId: (orgId) => _getOrgByOrgId(orgId),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=> _getOrgList()
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
  _.assign(_data, {
    token: _getToken(),
    filters: Persister.getFilters()
  });
  Persister.saveFilters();
  AppStore.emitChange();
};

let _register = (data) => {
  Persister.saveAppData(data);
  _.assign(_data, {
    token: _getToken()
  });
  AppStore.emitChange();
};

let _login = (data) => {
  Persister.saveAppData(data);
  _.assign(_data, {
    token: _getToken()
  });

  AppStore.emitChange();
};

let _logout = () => {
  Persister.clearToken();
  _info.isLogout = true;
  AppStore.emitChange();
};

let _force_logout = () => {
  Persister.clearToken();
  _info.isLogout = true;
  _info.isForceLogout = true;
  AppStore.emitChange();
};

let _save_apns_token = (apnsToken) => {
  Persister.saveAPNSToken(apnsToken);
  console.log('APNSToken' + apnsToken);
  AppStore.emitChange();
};

let _get_apns_token = () => {
  return Persister.getAPNSToken();
};

let _getToken = () => {
  return Persister.getToken();
};

let _getUserId = ()=> {
  return Persister.getUserId();
};

let _getLoginUserInfo = () => {
  return Persister.getLoginUserInfo();
};

let _getOrgByOrgId = (orgId)=> {
  return Persister.getOrgByOrgId(orgId);
};

let _getFilters = ()=> {
  return _data.filters;
};

let _saveOrgList = (orgList)=> {
  Persister.saveOrgList(orgList);
};

let _getOrgList = ()=> {
  let orgBuildList = Persister.getOrgList();
  return orgBuildList;
};

module.exports = AppStore;
