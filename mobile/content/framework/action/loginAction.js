let {
  BFetch,
  PFetch,
  UFetch
} = require('../network/fetch');
let { Host } = require('../../../config');

let AppStore = require('../store/appStore');

let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');

let LoginActions = {
  getProtocol: () => AppLinks.protocal,
  login: (p, c, f) => _login(AppLinks.login, p),
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
  uploadNameCard: (p, c, f)=> _uploadNameCard(p, c, f)
};

let _logout = function(url, c) {
  BFetch(url, {},
    function() {
      AppStore.logout();
    }, null, {
      isLogout: true
    }
  );
};

let _login = function(url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(AppStore.login(response));
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _uploadNameCard = function(){
  return function (callback) {
    UFetch(pub + '/File/uploadFile',
      {
        uri: params[fileFieldName],
        type: 'image/jpeg',
        name: fileFieldName
      },
      function (data) {
        callback(null, {[fileFieldName]:data});
      },
      function (err) {
        callback(err, fileFieldName);
      });
  }
};

let _register = function(url, p, c, f) {
  BFetch(url, p,
    function(data) {
      AppStore.login(data);
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
      //AppDispatcher.dispatch({
      //  type: ActionTypes.UPDATE_USERINFO,
      //  data: {
      //    mobileNo: value
      //  }
      //});
      c(msg);
    }
  );
};

module.exports = LoginActions;
