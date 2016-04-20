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
  forceLogOut: () => AppStore.forceLogout(),
  logout: (p) => _logout(AppLinks.logout,p),
  login: (p) => _login(AppLinks.login, p),
  register: (p, c, f) => _register(AppLinks.register, p, c, f),
  sendSmsCodeToLoginMobile: (p)=> _sendSmsCodeToLoginMobile(AppLinks.sendSmsCodeToLoginMobile,p),
  sendSmsCodeToRegisterMobile: (p)=> _sendSmsCodeToRegisterMobile(AppLinks.sendSmsCodeToRegisterMobile,p),
  validateSmsCode: (p) => _validateSmsCode(AppLinks.validateSmsCode,p),
  uploadFile: (p,fileFieldName) => _uploadFile(AppLinks.uploadFile,p,fileFieldName),
  getOrgList: () => _getOrgList(AppLinks.getOrgList),
  bizOrderMarketSearchDefaultSearch: (url) => _bizOrderMarketSearchDefaultSearch(AppLinks.bizOrderMarketSearchDefaultSearch)
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
      resolve(AppStore.register(response));
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _logout = function (url,p) {
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(AppStore.logout(p));
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _uploadFile = function (url,p,fileFieldName) {
  return new Promise((resolve, reject) => {
    UFetch(url, {
      uri: p,
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

let _bizOrderMarketSearchDefaultSearch = function (url) {
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};


module.exports = LoginActions;
