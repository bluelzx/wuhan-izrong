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
  DEVICESCHEMA,
  GROUPSCHEMA,
  MESSAGESCHEMA,
  USERINFOSCHEMA,
  LOGINUSERINFOSCHEMA,
  ORGBEANSCHEMA
  } = require('./schemas');

let PersisterFacade = {
  getAppData: (cb) => _getAppData(cb),
  saveAppData: (data) => _saveAppData(data),
  clearToken: () => _clearToken(),
  saveAPNSToken: (apnsToken, cb) => _saveAPNSToken('device', apnsToken, cb),
  getAPNSToken: (cb) => _getAPNSToken()('device', cb),
  setItem: (k, v, c) => _setItem(k, v, c),
  saveUser: (user, cb) => _setItem('userInfoBean', user, cb),
  saveOrg: (org, cb) => _setItem('orgBeans', org, cb),
  saveMsgDetail: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveMainMsgBean: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
  saveDemoFlag: (flag, cb) => _setItem('demoFlag', flag, cb),
  savaRegisterData:(data) =>_savaRegisterData(data)
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, UserInfoSchema, LoginUserInfoSchema, OrgBeanSchema],
  schemaVersion: 8
});
// Create Realm objects and write to local storage
let _savaRegisterData = function(data){
  let appUserInfo = data.appUserInfoBean;
  let orgBean = appUserInfo.orgBean;
  _realm.write(() => {
    _persister = _realm.create(LOGINUSERINFOSCHEMA, {
      userId:appUserInfo.userId,
      address: appUserInfo.address,
      realName: appUserInfo.realName,
      weChatNo: appUserInfo.weChatNo,
      email: {type: 'string', optional: true},
      nameCardFileUrl:  appUserInfo.nameCardFileUrl,
      qqNo:  appUserInfo.qqNo,
      department:  appUserInfo.department,
      mobileNumber: appUserInfo.mobileNumber,
      jobTitle:  appUserInfo.jobTitle,
      phoneNumber:  appUserInfo.phoneNumber,
      photoFileUrl:  appUserInfo.photoFileUrl,
      publicTitle:  appUserInfo.publicTitle,
      publicMobile:  appUserInfo.publicMobile,
      publicDepart:  appUserInfo.publicDepart,
      publicPhone:  appUserInfo.publicPhone,
      publicEmail:  appUserInfo.publicEmail,
      publicAddress:  appUserInfo.publicAddress,
      publicWeChat:  appUserInfo.publicWeChat,
      publicQQ:  appUserInfo.publicQQ,
      orgId: orgBean.id,
      token: data.appToken
    });
  });
  _realm.write(() => {
    _persister = _realm.create(ORGBEANSCHEMA, {
      id: orgBean.id,
      orgCategory: orgBean.orgCategory,
      orgCode: orgBean.orgCode,
      orgValue: orgBean.orgValue,
      corporationType:orgBean.corporationType,
      orgValueAlias:orgBean.orgValueAlias,
      isDisabled: orgBean.isDisabled,
      creator: orgBean.creator,
      creatorDate: orgBean.creatorDate,
      lastUpdateBy:orgBean.lastUpdateBy,
      lastUpdateDate:orgBean.lastUpdateDate,
      isNeedAudit:orgBean.isNeedAudit,
      totalQuota: orgBean.totalQuota,
      occupiedQuota:orgBean.occupiedQuota,
      isDeleted: orgBean.isDeleted,
      isApply: orgBean.isApply,
      remark: orgBean.remark
    });
  });
};

let _getAPNSToken = function (tableName, data, callback) {

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
