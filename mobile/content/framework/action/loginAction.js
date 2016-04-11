let {
  BFetch,
  PFetch,
  UFetch
  } = require('../network/fetch');
let { Host } = require('../../../config');
let AppStore = require('../store/appStore');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');
var pub = "/pub";
let LoginActions = {
  getProtocol: () => AppLinks.protocal,
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
  forceLogOut: () => AppStore.forceLogout(),
  clear: () => AppStore.logout(),
  login: (p, c, f) => _login(AppLinks.login, p),
  sendSmsCodeToLoginMobile: (p, f)=> _sendSmsCodeToLoginMobile(AppLinks.sendSmsCodeToLoginMobile,p),
  sendSmsCodeToRegisterMobile: (p, f)=> _sendSmsCodeToRegisterMobile(AppLinks.sendSmsCodeToRegisterMobile,p),
  validateSmsCode: (p,f) => _validateSmsCode(AppLinks.validateSmsCode),
  uploadNameCard: (p) => _uploadNameCard(AppLinks.uploadFile,p)
};

let _sendSmsCodeToLoginMobile = function (url,p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _sendSmsCodeToRegisterMobile = function (url,p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _login = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(AppStore.login(response));
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _register = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(AppStore.login(response));
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _logout = function (url) {
  BFetch(url, {},
    function () {
      AppStore.logout();
    }, null, {
      isLogout: true
    }
  );
};

let _uploadNameCard = function (fileFieldName) {
  return function (callback) {
    UFetch(url,
      {
        uri: params[fileFieldName],
        type: 'image/jpeg',
        name: fileFieldName
      },
      function (data) {
        callback(null, {[fileFieldName]: data});
      },
      function (err) {
        callback(err, fileFieldName);
      });
  }
};

module.exports = LoginActions;
