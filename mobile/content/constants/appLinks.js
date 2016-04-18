let { Host, ImHost } = require('../../config');
let imSocket = 'ws://' + ImHost + '/';
let imHttp = 'http://' + ImHost + '/';

let pub = '/app/pub';
let api = '/app/api';

let AppLinks = {
  ImSocket: imSocket,
  ImHttp: imHttp,
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
  sendSmsCodeToLoginMobile: Host + pub + '/sendSmsCodeToLoginMobile',
  sendSmsCodeToRegisterMobile: Host + pub + '/sendSmsCodeToRegisterMobile',
  validateSmsCode: Host + pub + '/validateSmsCode',
  login: Host + pub + '/login',
  logout: Host + api + '/Account/logout',
  register: Host + pub + '/register',
  uploadFile: Host + pub + '/File/upload',
  updateUserInfo: Host + api + '/Account/updateUserInfo',
  getOrgList: Host + pub + '/getOrgList/',

  bizOrderMarketSearchDefaultSearch: api + '/BizOrderMarketSearch/defaultSearch',
  bizOrderMarketSearchsearch: api + '/BizOrderMarketSearch/search',
  getBizOrderInMarket: api + '/BizOrderManage/getBizOrderInMarket',
  addBizOrder: api + '/BizOrderManage/addBizOrder',
  downselfBizOrder: api + '/BizOrderManage/downselfBizOrder',
  updateBizOrder: api + '/BizOrderManage/updateBizOrder',
  getBizOrderCategoryAndItem : api + '/BizOrderManage/getBizOrderCategoryAndItem',
  updateUserInfo: Host + api +'/Account/updateUserInfo'
};

module.exports = AppLinks;
