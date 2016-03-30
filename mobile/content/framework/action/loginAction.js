let {
  BFetch,
  PFetch,
  UFetch
} = require('../network/fetch');
let { Host } = require('../../../config');

let AppDispatcher = require('../dispatcher/appDispatcher');
let { ActionTypes } = require('../../constants/actionTypes');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');

let LoginActions = {
  getProtocol: () => AppLinks.protocal,
  login: (p, c, f) => _login(AppLinks.login, p, c, f),
  logOut: () => _logout(AppLinks.logout),
  register: (p, c, f) => _register(AppLinks.register, p, c, f),
  validatePassword: (p, c, f) => BFetch(AppLinks.validatePassword, p, c, f),
  validateMobileForResetMobile: (p, c, f) => BFetch(AppLinks.validateMobileForForgetPwd, p, c, f),
  sendSMSCodeToNewMobile: (p, c, f) => PFetch(AppLinks.sendSMSCodeToNewMobile, p, c, f),
  sendSMSCodeToNewMobileApi: (p, c, f) => BFetch(AppLinks.sendSMSCodeToNewMobileApi, p, c, f),
  validateSMSCode: (p, c, f) => PFetch(AppLinks.validateSMSCode, p, c, f),
  validateMobileForReg: (p, c, f) => BFetch(AppLinks.validateMobileForReg, p, c, f),
  validateMobileForForgetPwd: (p, c, f) => BFetch(AppLinks.validateMobileForForgetPwd, p, c, f),
  resetPasswordForForgetPwd: (p, c, f) => BFetch(AppLinks.resetPasswordForForgetPwd, p, c, f),
  sendSMSCodeToOldMobile: (p, c, f) => PFetch(AppLinks.sendSMSCodeToOldMobile, p, c, f),
  resetMobileNo: (p, c, f) => _resetMobileNo(AppLinks.resetMobileNo, p, c, f),
  resetPasswordForChangePwd: (p, c, f) => BFetch(AppLinks.resetPasswordForChangePwd, p, c, f),
  forceLogOut: () => AppDispatcher.dispatch({ type: ActionTypes.FORCE_LOGOUT }),
  clear: () => AppDispatcher.dispatch({ type: ActionTypes.LOGOUT })
};

let _logout = function(url, c) {
  BFetch(url, {},
    function() {
      AppDispatcher.dispatch({
        type: ActionTypes.LOGOUT
      });
    }, null, {
      isLogout: true
    }
  );
};

let _login = function(url, p, c, f) {
  BFetch(url, p,
    function(msg) {
      AppDispatcher.dispatch({
        type: ActionTypes.LOGIN,
        data: msg
      });
      c();
    },
    f
  );
};
let _register = function(url, p, c, f) {
  BFetch(url, p,
    function(msg) {
      AppDispatcher.dispatch({
        type: ActionTypes.LOGIN,
        data: msg
      });
      c();
    },
    f
  );
};
let _resetMobileNo = function(u, p, c, f) {
  let key = _.keys(p)[0];
  let value = p[key];
  BFetch(u, p,
    function(msg) {
      AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_USERINFO,
        data: {
          mobileNo: value
        }
      });
      c(msg);
    }
  );
};
module.exports = LoginActions;
