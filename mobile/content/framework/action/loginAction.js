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
  validateSmsCode: (p,f) => _validateSmsCode(AppLinks.validateSmsCode,p),
  uploadNameCard: (fileFieldName,p) => _uploadNameCard(AppLinks.uploadFile,fileFieldName,p),
  getOrgList: () => _getOrgList(AppLinks.getOrgList)
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

let _validateSmsCode = function (url,p) {
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
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _uploadNameCard = function (url,fileFieldName,p) {
  return new Promise((resolve, reject) => {
    UFetch(url, {
      uri: p[fileFieldName],
      type: 'image/jpeg',
      name: fileFieldName
    }).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getOrgList = function (url) {
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

module.exports = LoginActions;
