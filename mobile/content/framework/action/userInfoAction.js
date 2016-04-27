/**
 * Created by vison on 16/4/15.
 */
let React, {
  AlertIOS
  } = require('react-native');

let AppStore = require('../store/appStore');
let {
  BFetch,
  PFetch,
  UFetch
  } = require('../network/fetch');
let { Host } = require('../../../config');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');

let UserInfoAction = {
  getLoginUserInfo: ()=> _getLoginUserInfo(),
  getOrgById: (orgBeanId)=> _getOrgById(orgBeanId),
  updateUserInfo: (p)=> _updateUserInfo(AppLinks.updateUserInfo, p),
  uploadFile: (p, fileFieldName) => _uploadFile(AppLinks.uploadFile, p, fileFieldName)
};
_getLoginUserInfo = function () {
  return AppStore.getLoginUserInfo();
};

_getOrgById = function (orgBeanId) {
  return AppStore.getOrgByOrgId(orgBeanId);
};

_updateUserInfo = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _uploadFile = function (url, uri, fileFieldName) {
  return new Promise((resolve, reject) => {
    UFetch(url, {
      uri: uri,
      type: 'image/jpeg',
      name: fileFieldName
    }).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

module.exports = UserInfoAction;
