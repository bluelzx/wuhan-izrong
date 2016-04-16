const _ = require('lodash');
const Realm = require('realm');
let React = require('react-native');
let MockData = require('./createMockData');
const SCHEMA_KEY = '@realm:schema';
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


console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema,
    LoginUserInfoSchema, OrgBeanSchema, BizOrderCategorySchema,
    BizOrderItemSchema, MarketInfoSchema],
  schemaVersion: 9
});


// Create Realm objects and write to local storage
let _saveAppData = function (data) {
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBean;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(data);
  _saveOrgBean(orgBeanSet);
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
      lastLoginTime:new Date(),
      publicTitle: _.isEmpty(loginUserInfo.publicTitle)? true : loginUserInfo.publicTitle,
      publicMobile: _.isEmpty(loginUserInfo.publicMobile)? true : loginUserInfo.publicMobile,
      publicDepart: _.isEmpty(loginUserInfo.publicDepart)? true : loginUserInfo.publicDepart,
      publicPhone: _.isEmpty(loginUserInfo.publicPhone)? true : loginUserInfo.publicPhone,
      publicEmail: _.isEmpty(!loginUserInfo.publicEmail)? true : loginUserInfo.publicEmail,
      publicAddress: _.isEmpty(loginUserInfo.publicAddress)? true : loginUserInfo.publicAddress,
      publicWeChat: _.isEmpty(loginUserInfo.publicWeChat)? true : loginUserInfo.publicWeChat,
      publicQQ: _.isEmpty(loginUserInfo.publicQQ)? true : loginUserInfo.publicQQ
    },true);
  });
};

let _saveImUsers = function (imUserBeanList) {
  console.log(imUserBeanList);
  _([1, 2]).forEach(function(n) {
    console.log(n);
  }).value();
};

let _saveOrgBean = function (imUserBeanList) {
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
  let device = _realm.objects(DEVICE);
  return device[0].APNSToken ;
};

let _saveAPNSToken = function (apnsToken) {
 _realm.write(()=>{
   _realm.create(DEVICE, {
     id: 1,
     deviceOS:Platform.OS,
     APNSToken:apnsToken
   }, true);
 });
};

let _getToken = function(){
  let loginUsers = _realm.objects(LOGINUSERINFO);

};

let _clearToken = function () {

};

//TODO: nullException
let _getAppData = function (cb) {
  //let data = _realm.objects(SCHEMA_KEY)[0];
  //if (cb)cb(data);
  if (cb)cb(_persister);
};


_realm.write(() => {
  for (let item of MockData.users) {
    _realm.create(IMUSERINFO, item, true);
  }

  for (let org of MockData.orgs) {
    _realm.create(ORGBEAN, org, true);
  }

  for(let group of MockData.groups){
    _realm.create(GROUP, group, true);
  }
});

let _getAllGroups = function() {
  return _realm.objects(GROUP);
}

let _getUsersGroupByOrg = function() {
  let orgs = _realm.objects(ORGBEAN);
  let users = _realm.objects(IMUSERINFO);
  let orgArray = [];
  for(let org of orgs){
    let id = org.id;
    let orgMembers = users.filtered('orgBeanId = ' + id);
    org.orgMembers = orgMembers
    orgArray.push(org);
  }
  return orgArray;
}

let _getUserInfoByUserId = function(id) {
  let users =  _realm.objects(IMUSERINFO).filtered('userId = ' + id)[0];
  let orgs = _realm.objects(ORGBEAN);
  let org = orgs.filtered('id = ' + users.orgBeanId);
  users.orgValue = org[0].orgValue;
  return users;
}

let PersisterFacade = {
  getAppData: (cb) => _getAppData(cb),
  saveAppData: (data) => _saveAppData(data),
  clearToken: () => _clearToken(),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  getAllGroups: () => _getAllGroups(),
  getUsersGroupByOrg:() => _getUsersGroupByOrg(),
  getUserInfoByUserId:(id) => _getUserInfoByUserId(id)

};

module.exports = PersisterFacade;
