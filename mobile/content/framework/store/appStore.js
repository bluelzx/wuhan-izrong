let { NetInfo, Platform } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;
let ServiceModule = require('NativeModules').ServiceModule;
let { ImHost } = require('../../../config');
//let ImSocket = require('../network/imSocket');

//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');

//let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let { Default_EVENT, MARKET_CHANGE ,ORG_CHANGE ,USER_CHANGE} = require('../../constants/dictEvent');

let _info = {
  initLoadingState: true,
  netWorkState: false,
  isLogout: false,
  isForceLogout: false,
  apnTokens: null
};


let _data = {};

let AppStore = _.assign({}, EventEmitter.prototype, {
  saveNavigator: (nv)=> {
    _data.navigator = nv
  },
  getNavigator: ()=>_data.navigator || {},
  addChangeListener: function (callback, event = Default_EVENT) {
    this.on(event, callback);
  },
  removeChangeListener: function (callback, event = Default_EVENT) {
    this.removeListener(event, callback);
  },
  emitChange: function (event = Default_EVENT) {
    this.emit(event);
  },
  getNetWorkState: () => _info.netWorkState,
  getInitLoadingState: () => _info.initLoadingState,
  isLogout: () => _info.isLogout,
  isForceLogout: () => _info.isForceLogout,
  saveApnsToken: (apnsToken) => _save_apns_token(apnsToken),
  getAPNSToken: () => _get_apns_token(),
  updateLastSyncTime: (t)=>_updateLastSyncTime(t),
  getToken: () => _data.token || '',
  appInit: () => _appInit(),
  register: (data)=> _register(data),
  login: (data) => _login(data),
  logout: (userId) => _logout(userId),
  forceLogout: () => _force_logout(),
  getUserId: () => _getUserId(),
  getLoginUserInfo: () => _getLoginUserInfo(),
  getOrgByOrgId: (orgId) => _getOrgByOrgId(orgId),
  getOrgByOrgName: (orgName) => _getOrgByOrgName(orgName),
  saveFilters: (filters) => _saveFilters(filters),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=> _getOrgList(),
  updateUserInfo: (column, value)=> _updateUserInfo(column, value),
  saveCategory: (data) => _saveCategory(data),
  getCategory: ()=> _getCategory(),
  queryAllHomePageInfo: ()=>_queryAllHomePageInfo(),
  queryAllPlatFormInfo: ()=>_queryAllPlatFormInfo(),
  getBadge: ()=>_getBadge(),
  startJavaServer: () => ServiceModule.startAppService(_data.token, 0, ImHost),
  //stopJavaServer:() => ServiceModule.stopMyAppService()
  savePicUrl: (picUrl) => _data.picUrl = picUrl,
  getPicUrl:()=>_data.picUrl
});

let _queryAllPlatFormInfo = function () {
  return Persister.queryAllPlatFormInfo();
};

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
  _info.apnTokens = Persister.getAPNSToken();
  _.assign(_data, {
    token: _getToken(),
    filters: Persister.getFilters()
  });
  //ImSocket.init(_data.token);
  //if (Platform.OS === 'android' && _data.token) {
  //  //ServiceModule.setIsLoginToSP(true);
  //  ServiceModule.startAppService(_data.token, 0, ImHost);
  //}
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
  _data.filters = data.appOrderSearchResult;
  return Persister.saveAppData(data).then(()=> {
    _.assign(_data, {
      token: _getToken()
    });
    // imSocket.init(data.token);
    AppStore.emitChange();
  });
  //.then(()=>{
  //  if (Platform.OS === 'android' && _data.token) {
  //    //ServiceModule.setIsLoginToSP(true);
  //    ServiceModule.startAppService(_data.token, 0, ImHost);
  //  }
  //});
};

let _logout = (userId) => {
  Persister.logout(userId);
  _info.isLogout = true;
  _data.token = '';
  //if (Platform.OS === 'android' ) {
  //  ServiceModule.stopAppService();
  //}
  AppStore.emitChange();
};

let _force_logout = () => {
  _info.isLogout = true;
  _info.isForceLogout = true;
  //TODO:'强制登出'
  AppStore.emitChange();
};

let _save_apns_token = (apnsToken) => {
  _info.apnTokens = apnsToken;
  Persister.saveAPNSToken(apnsToken);
  console.log('APNSToken' + apnsToken);
  AppStore.emitChange();
};

let _get_apns_token = () => {
  //return Persister.getAPNSToken();
  return _info.apnTokens || '';
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

let _saveFilters = function (filters) {
  _data.filters = filters;
  Persister.saveFilters(filters);
  AppStore.emitChange(MARKET_CHANGE);
};

let _getFilters = ()=> {
  return _data.filters;
};

let _saveOrgList = (orgList)=> {
  _data.orgList = orgList;
  AppStore.emitChange(ORG_CHANGE);
  Persister.saveOrgList(orgList);
};

let _getOrgList = ()=> {
  return Persister.getOrgList();
};


let _getOrgByOrgId = (orgId)=> {
  return Persister.getOrgByOrgId(orgId);
};

let _getOrgByOrgName = (orgName)=> {
  return Persister.getOrgByOrgName(orgName);
};

let _updateUserInfo = (column, value)=> {
  Persister.updateUserInfo(column, value);
  AppStore.emitChange(USER_CHANGE);
};

let _updateLastSyncTime = function (t) {
  Persister.updateLastSyncTime(t);
};

let _saveCategory = (data) => {
  _.assign(_data, {
    category: data
  });
  AppStore.emitChange(MARKET_CHANGE);
};

let _getCategory = () => {
  return _data.category;
};

let _getBadge = () => {
  let badge = Persister.getSessionBadge();
  return badge;
};

let _queryAllHomePageInfo = ()=> {
  return Persister.queryAllHomePageInfo()
};
module.exports = AppStore;
