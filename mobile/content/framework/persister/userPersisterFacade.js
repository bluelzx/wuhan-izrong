/**
 * Created by vison on 16/4/20.
 */

let _realm = require('./realmManager');
const _ = require('lodash');
const {
  IMUSERINFO,
  LOGINUSERINFO
  } = require('./schemas');
let UserPersisterFacade = {
  updateUserInfo: (column) => _updateUserInfo(value)

};
let _updateUserInfo = function (column, value) {
  let userId = _getUserId();
  switch(column){
    case "mobileNumber":

      break;
    case "publicMobile":

      break;
    case "phoneNumber":

      break;
    case "publicPhone":

      break;
    case "qqNo":
      break;
    case "publicQQ":
      break;
    case "weChatNo":
      break;
    case "publicWeChat":
      break;
    case "email":
      break;
    case "publicEmail":
      break;
    case "department":
      break;
    case "publicDepart":
      break;
    case "jobTitle":
      break;
    case "publicTitle":
      break;
    case "photoFileUrl":
      break;
  }
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId:userId,
      publicMobile: value
    }, true);
  });
};

module.exports = UserPersisterFacade;
