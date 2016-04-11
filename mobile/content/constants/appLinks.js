let { Host } = require('../../config');

let AppLinks = {
  protocal: '',
  login: '/pub/login',
  logout: '',
  register: '',
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
  sendSmsCodeToLoginMobile:Host + '/pub/sendSmsCodeToLoginMobile'
};

module.exports = AppLinks;
