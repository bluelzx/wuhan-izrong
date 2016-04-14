const _ = require('lodash');
const Realm = require('realm');
const SCHEMA_KEY = '@realm:schema';
const {
  DeviceSchema,
  GroupSchema,
  MessageSchema,
  UserInfoSchema,
  LoginUserInfoSchema,
  OrgBeanSchema,
  BizOrderCategorySchema,
  BizOrderItemSchema,
  MarketInfoSchema,
  DEVICESCHEMA,
  GROUPSCHEMA,
  MESSAGESCHEMA,
  USERINFOSCHEMA,
  LOGINUSERINFOSCHEMA,
  ORGBEANSCHEMA,
  BIZORDERCATEGORY,
  BIZORDERITEM,
  MARKETINFO
  } = require('./schemas');

let PersisterFacade = {
  getAppData: (cb) => _getAppData(cb),
  saveAppData: (data) => _saveAppData(data),
  clearToken: () => _clearToken(),
  saveAPNSToken: (apnsToken, cb) => _saveAPNSToken(apnsToken, cb),
  getAPNSToken: (cb) => _getAPNSToken()(cb),
  setItem: (k, v, c) => _setItem(k, v, c),
  saveUser: (user, cb) => _setItem('userInfoBean', user, cb),
  saveOrg: (org, cb) => _setItem('orgBeans', org, cb),
  saveMsgDetail: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveMainMsgBean: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveDemoFlag: (flag, cb) => _setItem('demoFlag', flag, cb),
  saveLoginUserInfo:(loginUserInfo) =>_saveLoginUserInfo(loginUserInfo)
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, UserInfoSchema,
           LoginUserInfoSchema, OrgBeanSchema,BizOrderCategorySchema,
           BizOrderItemSchema,MarketInfoSchema],
  schemaVersion: 7
});
// Create Realm objects and write to local storage
let _saveAppData = function(data){
  let loginUserInfo = data.appUserInfoBean;
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBeanMap;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  _saveLoginUserInfo(loginUserInfo);
  _saveOrgBean(orgBeanSet);
};

let _saveLoginUserInfo = function(loginUserInfo){
  _realm.write(() => {
    _persister = _realm.create(LOGINUSERINFOSCHEMA, {
      userId:loginUserInfo.userId,
      address: loginUserInfo.address,
      realName: loginUserInfo.realName,
      weChatNo: loginUserInfo.weChatNo,
      email: loginUserInfo.email,
      nameCardFileUrl:  loginUserInfo.nameCardFileUrl,
      qqNo:  loginUserInfo.qqNo,
      department:  loginUserInfo.department,
      mobileNumber: loginUserInfo.mobileNumber,
      jobTitle:  loginUserInfo.jobTitle,
      phoneNumber:  loginUserInfo.phoneNumber,
      photoFileUrl:  loginUserInfo.photoFileUrl,
      publicTitle:  loginUserInfo.publicTitle,
      publicMobile:  loginUserInfo.publicMobile,
      publicDepart:  loginUserInfo.publicDepart,
      publicPhone:  loginUserInfo.publicPhone,
      publicEmail:  loginUserInfo.publicEmail,
      publicAddress:  loginUserInfo.publicAddress,
      publicWeChat:  loginUserInfo.publicWeChat,
      publicQQ:  loginUserInfo.publicQQ,
      orgBeanId: loginUserInfo.orgBeanId,
      token: data.appToken
    });
  });
};

let _saveOrgBean = function(orgBeanSet){
  _realm.write(() => {
    _persister = _realm.create(ORGBEANSCHEMA, {
      id: orgBeanSet.orgBeanId,
      orgCategory: orgBeanSet.orgCategory,
      orgCode: orgBeanSet.orgCode,
      orgValue: orgBeanSet.orgValue,
      corporationType:orgBeanSet.corporationType,
      orgValueAlias:orgBeanSet.orgValueAlias,
      isDisabled: orgBeanSet.isDisabled,
      creator: orgBeanSet.creator,
      creatorDate: orgBeanSet.creatorDate,
      lastUpdateBy:orgBeanSet.lastUpdateBy,
      lastUpdateDate:orgBeanSet.lastUpdateDate,
      isNeedAudit:orgBeanSet.isNeedAudit,
      totalQuota: orgBeanSet.totalQuota,
      occupiedQuota:orgBeanSet.occupiedQuota,
      isDeleted: orgBeanSet.isDeleted,
      isApply: orgBeanSet.isApply,
      remark: orgBeanSet.remark
    });
  });
};

let _getAPNSToken = function (cb) {
  if (cb){
    cb('sdfhkjashdfkjhewkrwedfkjhask');
  }
};

let _saveAPNSToken = function (tableName, callback) {

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
