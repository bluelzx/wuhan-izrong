/**
 * Created by vison on 16/4/20.
 */

let _realm = require('./realmManager');
const _ = require('lodash');
const {
  IMUSERINFO,
  LOGINUSERINFO
  } = require('./schemas');
let PersisterFacade = require('./persisterFacade');
let { USER_CHANGE } = require('../../constants/dictEvent');
let AppStore = require('../store/appStore');
let UserPersisterFacade = {
  updateUserInfo: (column, value) => _updateUserInfo(column, value),
  updateUserInfoByPush: (data) => _updateUserInfoByPush(data)

};

let _updateUserInfo = function (column, value) {
    let loginUsers = _realm.objects(LOGINUSERINFO);
    let userId;
    if (loginUsers.length != 0) {
      let sortedUsers = loginUsers.sorted('lastLoginTime', [true]);
      userId = sortedUsers[0].userId;
    }
    switch (column) {
      case 'realName':
        _realm.write(() => {

          _realm.create(LOGINUSERINFO, {
            userId: userId,
            realName: value
          }, true);


          _realm.create(IMUSERINFO, {
            userId: userId,
            realName: value
          }, true);


        });
        break;
      case 'mobileNumber':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            mobileNumber: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            mobileNumber: value
          }, true);

        });
        break;
      case 'isPublicMobile':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicMobile: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicMobile: value
          }, true);


        });
        break;
      case 'phoneNumber':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            phoneNumber: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            phoneNumber: value
          }, true);


        });
        break;
      case 'isPublicPhone':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicPhone: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicPhone: value
          }, true);
        });
        break;
      case 'qqNo':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            qqNo: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            qqNo: value
          }, true);

        });
        break;
      case 'isPublicQq':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicQQ: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicQQ: value
          }, true);

        });
        break;
      case 'weChatNo':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            weChatNo: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            weChatNo: value
          }, true);

        });
        break;
      case 'isPublicWeChat':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicWeChat: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicWeChat: value
          }, true);
        });
        break;
      case 'email':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            email: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            email: value
          }, true);

        });
        break;
      case 'isPublicEmail':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicEmail: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicEmail: value
          }, true);

        });
        break;
      case 'department':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            department: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            department: value
          }, true);

        });
        break;
      case 'isPublicDepart':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicDepart: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicDepart: value
          }, true);

        });
        break;
      case 'jobTitle':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            jobTitle: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            jobTitle: value
          }, true);

        });
        break;
      case 'isPublicTitle':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            publicTitle: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            publicTitle: value
          }, true);

        });
        break;
      case 'photoFileUrl':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            photoFileUrl: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            photoFileUrl: value
          }, true);


        });
        break;
      case 'isCertificated':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            certified: value
          }, true);

          _realm.create(IMUSERINFO, {
            userId: userId,
            certified: value
          }, true);

        });
        break;
      case 'status':
        _realm.write(() => {
          _realm.create(LOGINUSERINFO, {
            userId: userId,
            status: value
          }, true);

        });
        break;
    }
};

let _updateUserInfoByPush = function (message) {
  let param = {
    userId: message.userId,
    address: message.address,
    realName: message.realName,
    weChatNo: message.weChatNo,
    email: message.email,
    nameCardFileUrl: message.nameCardFileUrl,
    qqNo: message.qqNo,
    department: message.department,
    mobileNumber: message.mobileNo,
    jobTitle: message.jobTitle,
    phoneNumber: message.phoneNumber,
    photoFileUrl: message.photoStoredFileUrl,
    orgId: message.orgId,
    publicTitle: message.isPublicTitle,
    publicMobile: message.isPublicMobile,
    publicDepart: message.isPublicDepart,
    publicPhone: message.isPublicPhone,
    publicEmail: message.isPublicEmail,
    publicAddress: message.isPublicAddress,
    publicWeChat: message.isPublicWeChat,
    publicQQ: message.isPublicQq,
    certified: message.isCertificated
  };
  let ret = {};
  for (let k in param) {
    if (param[k] != undefined) {
      ret[k] = param[k];
    }
  }
  _realm.write(()=> {
    try {
      //更新
      _realm.create(LOGINUSERINFO, ret, true);
    } catch (err) {
      //创建
      _realm.create(LOGINUSERINFO, param, true);
    }
  });
};

module.exports = UserPersisterFacade;
