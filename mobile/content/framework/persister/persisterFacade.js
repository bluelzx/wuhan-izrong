const _ = require('lodash');
const Realm = require('realm');
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
let PersisterFacade = {
  getAppData: (cb) => _getAppData(cb),
  saveAppData: (data) => _saveAppData(data),
  clearToken: () => _clearToken(),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  setItem: (k, v, c) => _setItem(k, v, c),
  saveUser: (user, cb) => _setItem('userInfoBean', user, cb),
  saveOrg: (org, cb) => _setItem('orgBeans', org, cb),
  saveMsgDetail: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveMainMsgBean: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveDemoFlag: (flag, cb) => _setItem('demoFlag', flag, cb),
  saveLoginUserInfo: (loginUserInfo) =>_saveLoginUserInfo(loginUserInfo)
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema,
    LoginUserInfoSchema, OrgBeanSchema, BizOrderCategorySchema,
    BizOrderItemSchema, MarketInfoSchema],
  schemaVersion: 10
});
// Create Realm objects and write to local storage
let _saveAppData = function (data) {
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBean;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(data);
 // _saveOrgBean(orgBeanSet);
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

let _clearToken = function () {
  //realm.delete(_persister);
};

let _setItem = function (key, value, cb) {
  //let data = _realm.objects(SCHEMA_KEY)[0];
  //realm.create(SCHEMA_KEY, _.assign(data, { key: value }), true);

  _persister[key] = value;
  //realm.create(SCHEMA_KEY, _persister, true);
  //if (cb)cb();
};


let _getAppData = function (cb) {
  //let data = _realm.objects(SCHEMA_KEY)[0];
  //if (cb)cb(data);
  if (cb)cb(_persister);
};

module.exports = PersisterFacade;
