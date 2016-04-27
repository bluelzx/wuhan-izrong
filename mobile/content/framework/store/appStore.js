let { NetInfo } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;
//let ImSocket = require('../network/imSocket');

//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');
//let ConvertChineseKey = require('../../comp/utils/convertChineseKey');

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
  getToken: () => _data.token || '',
  //getToken:() => 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJVc2VySWQtMTAxIiwiaWF0IjoxNDYxNTUyNDY0LCJzdWIiOiJzd2VpMUBxcS5jb20iLCJpc3MiOiJVc2VySWQtMTAxIn0.8NmlrWPTvJqIWJDjFxte53YKnGLmmejM9RrqDT1MAvM',
  //getToken:()=>'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJVc2VySWQtMTA5IiwiaWF0IjoxNDYxNTUzMTgzLCJzdWIiOiJ3ZWlzZW4zIiwiaXNzIjoiVXNlcklkLTEwOSJ9.SahHndVnBfJo2RforCkAN0XMXAcrL10Gzi3-EMQQsBM',
  appInit: () => _appInit(),
  register: (data)=> _register(data),
  login: (data) => _login(data),
  logout: (userId) => _logout(userId),
  forceLogout: () => _force_logout(),
  getUserId: () => _getUserId(),
  getLoginUserInfo: () => _getLoginUserInfo(),
  getOrgByOrgId: (orgId) => _getOrgByOrgId(orgId),
  saveFilters: (filters) => _saveFilters(filters),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=> _getOrgList(),
  updateUserInfo: (column, value)=> _updateUserInfo(column, value),
  saveCategoryAndItem: (data) => _saveCategoryAndItem(data),
  getCategoryAndItem: ()=> _getCategoryAndItem()
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
  //ImSocket.init(_data.token);
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
 // imSocket.init(data.token);
  AppStore.emitChange();
};

let _logout = (userId) => {
  Persister.clearToken(userId);
  _info.isLogout = true;
  //TODO:'登出'
  AppStore.emitChange();
};

let _force_logout = () => {
  Persister.clearToken();
  _info.isLogout = true;
  _info.isForceLogout = true;
  //TODO:'登出'
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

let _saveFilters = function(filters){
  Persister.saveFilters(filters);
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

let _updateUserInfo = (column, value)=> {
  Persister.updateUserInfo(column, value);
  AppStore.emitChange();
};

let _saveCategoryAndItem = (data) => {
  _.assign(_data, {
    categoryAndItem: data
  });
  AppStore.emitChange();
};

let _getCategoryAndItem = () => {
  return _data.categoryAndItem;
};
module.exports = AppStore;
