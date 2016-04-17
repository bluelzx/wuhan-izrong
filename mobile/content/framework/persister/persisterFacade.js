const _ = require('lodash');
const Realm = require('realm');
const SCHEMA_KEY = '@realm:schema';
let React = require('react-native');
const {
  DeviceSchema,
  GroupSchema,
  MessageSchema,
  ImUserInfoSchema,
  LoginUserInfoSchema,
  OrgBeanSchema,
  BizOrderCategorySchema,
  BizOrderItemSchema,
  MarketInfoSchema,
  DEVICE,
  GROUP,
  MESSAGE,
  IMUSERINFO,
  LOGINUSERINFO,
  ORGBEAN,
  BIZORDERCATEGORY,
  BIZORDERITEM,
  MARKETINFO
  } = require('./schemas');
let {Platform} = React;
let PersisterFacade = {
  //interface for AppStore
  saveAppData: (data) => _saveAppData(data),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  clearToken: () => _clearToken(),
  getUserId: ()=> _getUserId(),

  //interface for ContactStore
  getContact: ()=>_getContact(),
  _getIMNotificationMessage: ()=>_getIMNotificationMessage(),
  getUsers: ()=>_getUsers(),
  getUserInfoByUserId: (userId)=>_getUserInfoByUserId(userId),
  getGroupDetailById: (groupId)=>_getGroupDetailById(groupId),

  getUsersExpress: ()=> _getUsersExpress()
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema,
    LoginUserInfoSchema, OrgBeanSchema, BizOrderCategorySchema,
    BizOrderItemSchema, MarketInfoSchema],
  schemaVersion: 3
});
// Create Realm objects and write to local storage
let _saveAppData = function (data) {
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBean;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(data);
  //_saveImUsers();
  //_saveOrgBean(orgBeanSet);
};

let _saveLoginUserInfo = function (data) {
  let loginUserInfo = data.appUserInfoBean;
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId: loginUserInfo.userId,
      address: loginUserInfo.address,
      realName: loginUserInfo.realName,
      weChatNo: loginUserInfo.weChatNo,
      email: loginUserInfo.email,
      nameCardFileUrl: loginUserInfo.nameCardFileUrl,
      qqNo: loginUserInfo.qqNo,
      department: loginUserInfo.department,
      mobileNumber: loginUserInfo.mobileNumber,
      jobTitle: loginUserInfo.jobTitle,
      phoneNumber: loginUserInfo.phoneNumber,
      photoFileUrl: loginUserInfo.photoFileUrl,
      orgBeanId: loginUserInfo.orgBeanId,
      token: data.appToken,
      lastLoginTime: new Date(),
      publicTitle: _.isEmpty(loginUserInfo.publicTitle) ? true : loginUserInfo.publicTitle,
      publicMobile: _.isEmpty(loginUserInfo.publicMobile) ? true : loginUserInfo.publicMobile,
      publicDepart: _.isEmpty(loginUserInfo.publicDepart) ? true : loginUserInfo.publicDepart,
      publicPhone: _.isEmpty(loginUserInfo.publicPhone) ? true : loginUserInfo.publicPhone,
      publicEmail: _.isEmpty(!loginUserInfo.publicEmail) ? true : loginUserInfo.publicEmail,
      publicAddress: _.isEmpty(loginUserInfo.publicAddress) ? true : loginUserInfo.publicAddress,
      publicWeChat: _.isEmpty(loginUserInfo.publicWeChat) ? true : loginUserInfo.publicWeChat,
      publicQQ: _.isEmpty(loginUserInfo.publicQQ) ? true : loginUserInfo.publicQQ
    }, true);
  });
};

let _saveImUsers = function (imUserBeanList) {
  console.log(imUserBeanList);
  _([1, 2]).forEach(function (n) {
    console.log(n);
  }).value();
};

let _saveOrgBean = function (orgBeanSet) {
  _realm.write(() => {
    _realm.create(ORGBEAN, {
      id: orgBeanSet.orgBeanId,
      orgCategory: orgBeanSet.orgCategory,
      orgCode: orgBeanSet.orgCode,
      orgValue: orgBeanSet.orgValue,
      corporationType: orgBeanSet.corporationType,
      orgValueAlias: orgBeanSet.orgValueAlias,
      isDisabled: orgBeanSet.isDisabled,
      creator: orgBeanSet.creator,
      creatorDate: orgBeanSet.creatorDate,
      lastUpdateBy: orgBeanSet.lastUpdateBy,
      lastUpdateDate: orgBeanSet.lastUpdateDate,
      isNeedAudit: orgBeanSet.isNeedAudit,
      totalQuota: orgBeanSet.totalQuota,
      occupiedQuota: orgBeanSet.occupiedQuota,
      isDeleted: orgBeanSet.isDeleted,
      isApply: orgBeanSet.isApply,
      remark: orgBeanSet.remark
    }, true);
  });
};

let _getAPNSToken = function () {
  _realm.write(() => {
    _realm.create(DEVICE, {
      id: 1,
      deviceOS: 'IOS',
      APNSToken: 'asdfghjklzxcvbnm'
    }, true);
  });
  let device = _realm.objects(DEVICE);

  return device[0].APNSToken;
};

let _saveAPNSToken = function (apnsToken) {
  _realm.write(()=> {
    _realm.create(DEVICE, {
      id: 1,
      deviceOS: Platform.OS,
      APNSToken: apnsToken
    }, true);
  });
};

let _getToken = function () {
  let loginUsers = _realm.objects(LOGINUSERINFO);
  if (loginUsers.length != 0) {
    if (loginUsers[0].token) {
      return loginUsers[0].token;
    }
  }
  return '';
};

let _clearToken = function () {
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      token: ''
    }, true);
  });
};

let _getUserId = function () {
  let loginUsers = _realm.objects(LOGINUSERINFO);
  return loginUsers[0].userId;
};

let _getContact = function () {

};

let _getUsers = function () {

};

let _getUserInfoByUserId = function (userId) {
  let imUsers = _realm.objects(IMUSERINFO);
  return imUsers.filtered('"userId" = ' + userId);
};

let _getGroupDetailById = function (groupId) {

};

let _getIMNotificationMessage = function () {

};

let _getUsersExpress = function () {

};

module.exports = PersisterFacade;
