let { NetInfo, Platform } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;
//let ServiceModule = require('NativeModules').ServiceModule;
let { ImHost } = require('../../../config');
//let ImSocket = require('../network/imSocket');

//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');


//let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let {
  Default_EVENT,
  NETINFO_CONNECTED,
  NETINFO_DISCONNECTED,
  MARKET_CHANGE,
  ORG_CHANGE,
  USER_CHANGE,
  HOMELIST_CHANGE
  } = require('../../constants/dictEvent');

let _info = {
  initLoadingState: true,
  netWorkState: false,
  isLogout: false,
  isForceLogout: false,
  apnTokens: null,
  isFreezing: false,
  isDelete: false,
  deviceModel: 'XIAOMI'
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
  isFreezing: () => _info.isFreezing,
  isForceLogout: () => _info.isForceLogout,
  isDelete: ()=> _info.isDelete,
  isForceUpdate: ()=> _info.forceUpdate,
  saveApnsToken: (apnsToken, judgeEmit) => _save_apns_token(apnsToken, judgeEmit),
  getAPNSToken: () => _get_apns_token(),
  updateLastSyncTime: (t)=>_updateLastSyncTime(t),
  getToken: () => _data.token || '',
  appInit: () => _appInit(),
  register: (data)=> _register(data),
  login: (data) => _login(data),
  simpleLogin: (data) => _simpleLogin(data),
  logout: (userId) => _logout(userId),
  forceLogout: () => _forceLogout(),
  freezAccount: () => _freezAccount(),
  forceUpdate: () => _forceUpdate(),
  deleteLoginUser: () => _deleteLoginUser(),
  getUserId: () => _getUserId(),
  getLoginUserInfo: () => _getLoginUserInfo(),
  getOrgByOrgId: (orgId) => _getOrgByOrgId(orgId),
  getOrgByOrgName: (orgName) => _getOrgByOrgName(orgName),
  saveFilters: (filters) => _saveFilters(filters),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  updateOrgInfo: (orgInfo)=> _updateOrgInfo(orgInfo),
  getOrgList: ()=> _getOrgList(),
  updateUserInfo: (column, value)=> _updateUserInfo(column, value),
  updateUserInfoByPush: (data)=>_updateUserInfoByPush(data),
  saveCategory: (data) => _saveCategory(data),
  getCategory: ()=> _getCategory(),
  queryAllHomePageInfo: ()=>_queryAllHomePageInfo(),
  queryAllPlatFormInfo: ()=>_queryAllPlatFormInfo(),
  getBadge: ()=>_getBadge(),
  //startJavaServer: () => ServiceModule.startAppService(_data.token, 0, ImHost),
  saveMarketInfo: (marketInfoList) => _saveMarketInfo(marketInfoList),
  getMarketInfo: () => _getMarketInfo(),
  //stopJavaServer:() => ServiceModule.stopMyAppService()
  saveHomeMarketList: (homeMarketList)=> _saveHomeMarketList(homeMarketList),
  shouldUpdate: ()=> Persister.shouldUpdate(),
  saveAndroidPushRegId: (id) => _saveAndroidPushRegId(id),
  saveDeviceModel: (deviceModel) => {_info.deviceModel = deviceModel; console.log("appstore" + deviceModel)},
  getDeviceModel: () => _info.deviceModel || ''

});

let _getDeviceModel = function () {
  return _info.deviceModel || ''
}

let _saveDeviceModel = function (deviceModel) {
  _info.deviceModel = deviceModel;
}

let _saveAndroidPushRegId = function (id) {
  _.assign(_data, {
    pushRegId: id
  })
}

let _queryAllPlatFormInfo = function () {
  return Persister.queryAllPlatFormInfo();
};

// Private Functions
let _handleConnectivityChange = (isConnected) => {
  _info.netWorkState = isConnected;
  AppStore.emitChange(isConnected ? NETINFO_CONNECTED : NETINFO_DISCONNECTED);
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
  _.assign(_info, {
    isLogout: false,
    isForceLogout: false,
    isFreezing: false,
    isDelete: false
  });
  _.assign(_data, {
    token: data.appToken,
    userId: data.appUserInfoOutBean.userId
  });
  Persister.saveAppData(data);
  _saveFilters(data.appOrderSearchResult);
  AppStore.emitChange();
};

let _login = (data) => {
  _data.filters = data.appOrderSearchResult;
  return Persister.saveAppData(data).then(()=> {
    _.assign(_data, {
      token: data.appToken,
      filters: data.appOrderSearchResult,
      userId: data.appUserInfoOutBean.userId
    });
    _.assign(_info, {
      isLogout: false,
      isForceLogout: false,
      isFreezing: false,
      isDelete: false
    });
    AppStore.emitChange();
  });
};

let _simpleLogin = (data) => {
  return Persister.saveSimpleLoginData(data, AppStore.getUserId())
    .then(()=> {
      _.assign(_info, {
        isLogout: false,
        isForceLogout: false,
        isFreezing: false,
        isDelete: false
      });
      _.assign(_data, {
        token: data.appToken
      });
      AppStore.emitChange();
    }).catch((errorData)=> {
      throw errorData;
    });
};

let _logout = (userId) => {
  Persister.logout(userId);
  _info.isLogout = true;
  _data.token = '';
  _data.category = null;
  //if (Platform.OS === 'android' ) {
  //  ServiceModule.stopAppService();
  //}
  AppStore.emitChange();
};

let _forceLogout = () => {
  Persister.logout(_getUserId());
  _data.token = '';
  _info.isForceLogout = true;
  _info.isLogout = true;
  AppStore.emitChange();
};

let _deleteLoginUser = () => {
  //清空token,isLogout = true
  Persister.logout(_getUserId());
  _data.token = '';
  _info.isLogout = true;
  _info.isDelete = true;
  AppStore.emitChange();
};

let _freezAccount = () => {
  //清空token
  Persister.logout(_getUserId());
  _data.token = '';
  _info.isLogout = true;
  _info.isFreezing = true;
  AppStore.emitChange();
};

let _forceUpdate = () => {
  _info.forceUpdate = true;
  AppStore.emitChange();
};

let _save_apns_token = (apnsToken, judgeEmit) => {
  _info.apnTokens = apnsToken;
  Persister.saveAPNSToken(apnsToken);
  console.log('APNSToken' + apnsToken);
  if (!judgeEmit) {
    AppStore.emitChange();
  }
};

let _get_apns_token = () => {
  return _info.apnTokens || '';
};

let _getToken = () => {
  if (_data.token) {
    return _data.token;
  }
  _data.token = Persister.getToken();
  return _data.token;
};

let _getUserId = ()=> {
  if (_data.userId) {
    return _data.userId;
  } else {
    _data.userId = Persister.getUserId();
    return _data.userId;
  }
};

let _getLoginUserInfo = () => {
  return Persister.getLoginUserInfo();
};

let _saveFilters = function (filters) {
  _data.filters = filters;
  AppStore.emitChange(MARKET_CHANGE);
  AppStore.emitChange();
};

let _getFilters = ()=> {
  if (_data.filters) {
    return _data.filters;
  } else {
    _data.filters = Persister.getFilters();
    return _data.filters;
  }
};

let _saveOrgList = (orgList)=> {
  Persister.saveOrgList(orgList);
  AppStore.emitChange(ORG_CHANGE);
};

let _getOrgList = ()=> {
  if (_data.orgList) {
    return _data.orgList;
  } else {
    _data.orgList = Persister.getOrgList();
    return _data.orgList;
  }

};

let _updateOrgInfo = (orgInfo)=> {
  Persister.updateOrgInfo(orgInfo);
  _data.orgList = Persister.getOrgList();
  AppStore.emitChange(ORG_CHANGE);
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

let _updateUserInfoByPush = (data)=> {
  Persister.updateUserInfoByPush(data);
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
  let badge = Persister.getSessionBadge(_getUserId());
  return badge;
};

let _queryAllHomePageInfo = ()=> {
  return Persister.queryAllHomePageInfo()
};

let _saveMarketInfo = (marketInfoList) => {
  Persister.saveMarketInfo(marketInfoList);
};

let _saveHomeMarketList = (homeMarketList)=> {
  Persister.saveHomeMarketList(homeMarketList);
  AppStore.emitChange(HOMELIST_CHANGE);
};

let _getMarketInfo = ()=> {
  return Persister.getMarketInfo();
};

module.exports = AppStore;
