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
  FilterItemSchema,
  FilterItemsSchema,
  OrderItemSchema,
  DEVICE,
  GROUP,
  MESSAGE,
  IMUSERINFO,
  LOGINUSERINFO,
  ORGBEAN,
  BIZORDERCATEGORY,
  BIZORDERITEM,
  FILTERITEMSSCHEMA,
  FILTERITEMSCHEMA,
  ORDERITEMSCHEMA
  } = require('./schemas');
let {Platform} = React;
let PersisterFacade = {
  //interface for AppStore
  saveAppData: (data) => _saveAppData(data),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  clearToken: () => _clearToken(),
  getLoginUserInfo: ()=> _getLoginUserInfo(),
  getOrgByOrgId: (orgId)=> _getOrgByOrgId(orgId),
  //interface for ContactStore
  getContact: ()=>_getContact(),
  _getIMNotificationMessage: ()=>_getIMNotificationMessage(),
  getUsers: ()=>_getUsers(),
  getUserInfoByUserId: (userId)=>_getUserInfoByUserId(userId),
  getGroupDetailById: (groupId)=>_getGroupDetailById(groupId),
  getUsersExpress: ()=> _getUsersExpress(),
  saveOrgBeanSet: () => _saveOrgBeanSet()
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema, LoginUserInfoSchema, OrgBeanSchema,
    BizOrderCategorySchema, BizOrderItemSchema, FilterItemSchema, FilterItemsSchema, OrderItemSchema],
  schemaVersion: 1
});


let _saveAppData = function (data) {
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBean;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(data);
  _saveImUsers();
  _saveOrgBeanSet();
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

let _saveImUsers = function () {

};

let _saveOrgBeanSet = function () {
  let mockOrgBeanSet = [
    {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 1,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 2,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 3,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 4,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }
  ];
  mockOrgBeanSet.forEach(function (n) {
    console.log(n);
    _saveOrgBeanItem(n);
  });
};

let _saveOrgBeanItem = function (orgBean) {
  _realm.write(() => {
    _realm.create(ORGBEAN, {
      id: Number(orgBean.id),
      orgCategory: orgBean.orgCategory,
      orgCode: orgBean.orgCode,
      orgValue: orgBean.orgValue,
      corporationType: orgBean.corporationType,
      orgValueAlias: orgBean.orgValueAlias,
      isDisabled: orgBean.isDisabled,
      creator: orgBean.creator,
      creatorDate: orgBean.creatorDate,
      lastUpdateBy: orgBean.lastUpdateBy,
      lastUpdateDate: orgBean.lastUpdateDate,
      isNeedAudit: orgBean.isNeedAudit,
      totalQuota: Number(orgBean.id),
      occupiedQuota: Number(orgBean.id),
      isDeleted: orgBean.isDeleted,
      isApply: orgBean.isApply,
      remark: orgBean.remark
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

let _getLoginUserInfo = function () {
  let loginUsers = _realm.objects(LOGINUSERINFO);
  if (loginUsers.length != 0) {
    let sortedUser = loginUsers.sorted('lastLoginTime', [true]);
    return sortedUser[0];
  } else {
    return '';
  }
};

let _getOrgByOrgId = function (orgId) {
  let orgBeans = _realm.objects(ORGBEAN);
  if (orgBeans.isEmpty) {
    return null;
  } else {
    return orgBeans.filtered('id=' + orgId)[0];
  }
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
