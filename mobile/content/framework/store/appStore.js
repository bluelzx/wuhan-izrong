let { NetInfo } = require('react-native');
let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

let AppDispatcher = require('../dispatcher/appDispatcher');
let ActionTypes = require('../../constants/actionTypes');
//let { MsgTypes } = require('../../constants/notification');

let Persister = require('../persister/persisterFacade');
let RequestState = require('../../constants/requestState');
let requestLoadingState = RequestState.IDEL;

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  requestHandle: null,
  isLogout: false,
  isForce_Logout: false,
  isProgressVisible: false
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
  requestLoadingState: () => requestLoadingState,
  requestHandle: () => _info.requestHandle,
  isLogout: () => _info.isLogout,
  isForceLogout: () => _info.isForce_Logout,
  isProgressVisible: () => _info.isProgressVisible,
  getAPNSToken: () => _data.APNSToken,
  getToken: () => _data.token || '',
  getData: () => _data || {}
});


// Private Functions

let _handleConnectivityChange = (isConnected) => {
  _info.netWorkState = isConnected;
};
//
let _appInit = (data) => {
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
let _logout = () => {
  _data.token = null;
  Persister.clearToken();
  _info.isLogout = true;
  AppStore.emitChange();
};
let _force_logout = function () {
  _data.token = null;
  Persister.clearToken();
  _info.isLogout = true;
  _info.isForce_Logout = true;
};

AppStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.type) {
    case ActionTypes.APP_INIT:
      _appInit();
      break;
    case ActionTypes.LOGIN:
      _info.isLogout = false;
      _login(action.data);
      break;
    case ActionTypes.LOGOUT:
      _logout();
      break;
    case ActionTypes.FORCE_LOGOUT:
      _force_logout();
      AppStore.emitChange();
      break;
    case ActionTypes.REQUEST_START:
      requestLoadingState = RequestState.START;
      AppStore.emitChange('rpc');
      break;
    case ActionTypes.REQUEST_END:
      requestLoadingState = RequestState.END;
      _info.requestHandle = action.handle;
      AppStore.emitChange('rpc');
      break;
    case ActionTypes.UPDATE_COMPBASEINFO:
      _data.orgBeans[0] = _.assign(_data.orgBeans[0], action.data);
      _data.userInfoBean = _.assign(_data.userInfoBean, action.data);
      Persister.saveOrg(_data.orgBeans);
      AppStore.emitChange();
      if (action.successHandle)
        action.successHandle();
      break;
    case ActionTypes.SAVE_APNS_TOKEN:
      _data.APNSToken = action.token;
      Persister.saveAPNSToken(action.token);
      console.log(action.token);
      break;
    case ActionTypes.PUSH_NOTIFICATION:
      // _freshMessageData(action.data);
      break;
    case ActionTypes.CLEAR_MESSAGEDETAIL:
      _data.mainMsgBean[action.data].unReadNum = 0;
      Persister.saveMsgDetail(_data.mainMsgBean);
      break;
    case ActionTypes.DEMO_FLAG:
      _data.demoFlag = {
        flag: true
      };
      Persister.saveDemoFlag({flag: true, id: AppStore.getUserId()});
      break;
    case ActionTypes.GET_PUSH_MSG:
      // _getPushMsg(action.data);
      break;
    default:
  }
});

module.exports = AppStore;
