/**
 * Created by vison on 16/4/15.
 */
let React, {
  AlertIOS
  } = require('react-native');

let AppStore = require('../store/appStore');

let UserInfoAction = {
  getLoginUserInfo: ()=>_getLoginUserInfo(),
  getOrgById:(orgBeanId)=> _getOrgById(orgBeanId)
};
_getLoginUserInfo = function(){
  return AppStore.getLoginUserInfo();
};

_getOrgById = function(orgBeanId){
  return AppStore.getOrgByOrgId(orgBeanId);
};

module.exports = UserInfoAction;
