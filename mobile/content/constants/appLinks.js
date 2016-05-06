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
  validateEmail:Host + pub +'/validateEmail',
  login: Host + pub + '/login',
  logout: Host + api + '/Account/logout',
  registerProtocal: Host + '/protocal.html',
  register: Host + pub + '/register',
  uploadFile: Host + pub + '/File/upload',
  downLoadFile: Host + pub + '/File/downLoad/',
  updateUserInfo: Host + api + '/Account/updateUserInfoList',
  getOrgList: Host + pub + '/getOrgList/',

  bizOrderMarketSearchDefaultSearch: Host + api + '/BizOrderMarketSearch/defaultSearch',
  bizOrderMarketSearch:Host + api + '/BizOrderMarketSearch/search',
  bizOrderAdminSearch:Host + api + '/BizOrderAdminSearch/search',
  refreshBizOrder:Host + api + '/BizOrderManage/refreshBizOrder',
  getBizOrderInMarket: Host + api + '/BizOrderManage/getBizOrderInMarket',
  getBizOrderByCreator: Host + api + '/BizOrderManage/getBizOrderByCreator',
  addBizOrder: Host + api + '/BizOrderManage/addBizOrder',
  downselfBizOrder: Host + api + '/BizOrderManage/downselfBizOrder',
  updateBizOrder: Host + api + '/BizOrderManage/updateBizOrder',
  getBizOrderCategoryAndItem : Host + api + '/BizOrderManage/getBizOrderCategoryAndItem',
  //contact
  createGroup: imHttp + 'createGroup',
  kickOutMember: imHttp + 'kickOutMember',
  updateGroupName: imHttp + 'updateGroupName',
  acceptInvitation: imHttp + 'acceptInvitation',
  dismissGroup: imHttp + 'dismissGroup',
  setContactMute: imHttp + 'setContactMute',
  setGroupMute: imHttp + 'setGroupMute',
  inviteMember: imHttp + 'inviteMember',
  leaveGroup: imHttp + 'leaveGroup',
};

module.exports = AppLinks;
