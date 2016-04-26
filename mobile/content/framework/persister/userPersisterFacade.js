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

let UserPersisterFacade = {
  updateUserInfo: (column, value) => _updateUserInfo(column, value)
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
      });
      break;
    case 'mobileNumber':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
          userId: userId,
          mobileNumber: value
        }, true);
      });
      break;
    case 'publicMobile':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicPhone':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicQq':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicWeChat':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicEmail':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicDepart':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
    case 'publicTitle':
      _realm.write(() => {
        _realm.create(LOGINUSERINFO, {
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
      });
      break;
  }
};

module.exports = UserPersisterFacade;
