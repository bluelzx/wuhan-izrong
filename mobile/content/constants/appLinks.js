let { Host } = require('../../config');
let pub = '/app/pub';
let api = '/app/api';
let AppLinks = {
  protocal: '',
  validatePassword: '',
  validateMobileForResetMobile: '',
  sendSMSCodeToNewMobile: '',
  sendSMSCodeToNewMobileApi: '',
  validateSMSCode: '',
  validateMobileForReg: '',
  validateMobileForForgetPwd: '',
  resetPasswordForForgetPwd: '',
  sendSMSCodeToOldMobile: '',
  resetMobileNo: '',
  resetPasswordForChangePwd: '',
  sendSmsCodeToLoginMobile: pub + '/sendSmsCodeToLoginMobile',
  sendSmsCodeToRegisterMobile: pub + '/sendSmsCodeToRegisterMobile',
  validateSmsCode: pub + '/validateSmsCode',
  login: pub + '/login',
  logout: api + '/Account/logout',
  register: pub + '/register',
  uploadFile: pub + '/File/upload',
  updateUserInfo: api + '/Account/updateUserInfo',
  getOrgList: pub + '/getOrgList/',
  bizOrderMarketSearchDefaultSearch: api + '/BizOrderMarketSearch/defaultSearch',
  bizOrderMarketSearchsearch: api + '/BizOrderMarketSearch/search',
  getBizOrderInMarket: api + 'BizOrderManage/getBizOrderInMarket',
};

module.exports = AppLinks;
