const _ = require('lodash');
let React = require('react-native');
let TestData = require('./testData');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let _realm = require('./realmManager');
const {
  DEVICE,
  GROUP,
  MESSAGE,
  IMUSERINFO,
  LOGINUSERINFO,
  ORGBEAN,
  FILTERITEMS,
  FILTERITEM,
  ORDERITEM
  } = require('./schemas');
let {Platform} = React;

let PersisterFacade = {
  //interface for AppStore
  saveAppData: (data) => _saveAppData(data),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  clearToken: (userId) => _clearToken(userId),
  getLoginUserInfo: ()=> _getLoginUserInfo(),
  getUserId: ()=> _getUserId(),
  getOrgByOrgId: (orgId)=> _getOrgByOrgId(orgId),
  updateUserInfo: (column, value)=>_updateUserInfo(column, value),
  //interface for ContactStore
  getLoginUserInfoByUserId: (userId)=>_getLoginUserInfoByUserId(userId),
  saveOrgBeanSet: () => _saveOrgBeanSet(),
  saveFilters: ()=> _saveFilters(),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=>_getOrgList(),
  deleteDevice: ()=> _deleteDevice()
};


//test method
let _deleteDevice = function () {
  _realm.write(() => {
    let devices = _realm.objects(DEVICE);
    _realm.delete(devices); // Deletes all books
  });
};

let _saveAppData = function (data) {
  let loginUserInfo = data.appUserInfoOutBean;
  let token = data.appToken;
  let orgBeanList = data.orgBeanList;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(loginUserInfo, token);
  _saveImUsers(imUserBeanList);
  _saveOrgBeanList(orgBeanList);
  _saveAppUserGroupBeanList(appUserGroupBeanList);
};

let _saveLoginUserInfo = function (loginUserInfo, token) {
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
      orgId: loginUserInfo.orgBeanId,
      token: token,
      lastLoginTime: new Date(),
      publicTitle: !!(loginUserInfo.publicTitle == true || loginUserInfo.publicTitle == null),
      publicMobile: !!(loginUserInfo.publicMobile == true || loginUserInfo.publicMobile == null),
      publicDepart: !!(loginUserInfo.publicDepart == true || loginUserInfo.publicDepart == null),
      publicPhone: !!(loginUserInfo.publicPhone == true || loginUserInfo.publicPhone == null),
      publicEmail: !!(loginUserInfo.publicEmail == true || loginUserInfo.publicEmail == null),
      publicAddress: !!(loginUserInfo.publicAddress == true || loginUserInfo.publicAddress == null),
      publicWeChat: !!(loginUserInfo.publicWeChat == true || loginUserInfo.publicWeChat == null),
      publicQQ: !!(loginUserInfo.publicQQ == true || loginUserInfo.publicQQ == null)
    }, true);
  });
};

let _saveAppUserGroupBeanList = function (appUserGroupBeanList) {
  appUserGroupBeanList.forEach(function (n) {
    console.log(n);
    _saveAppUserGroupBean(n);
  });

};

let _saveAppUserGroupBean = function (appUserGroupBean) {
  _realm.write(() => {
    _realm.create(GROUP, {
      groupId: appUserGroupBean.groupId,
      groupImageUrl: appUserGroupBean.groupImageUrl,
      groupName: appUserGroupBean.groupName,
      groupMasterUid: appUserGroupBean.groupMasterUid,
      memberNum: appUserGroupBean.members.length,
      members: JSON.stringify(appUserGroupBean.members),
      mute: appUserGroupBean.mute
    }, true);
  });
};

let _saveImUsers = function (imUserBeanList) {
  imUserBeanList.forEach(function (imUserBean) {
    _saveImUser(imUserBean);
  });
};

let _saveImUser = function (imUserBean) {
  _realm.write(() => {
    _realm.create(IMUSERINFO, {
      userId: imUserBean.userId,
      address: imUserBean.address,
      realName: imUserBean.realName,
      nameCardFileUrl: imUserBean.nameCardFileUrl,
      department: imUserBean.department,
      jobTitle: imUserBean.jobTitle,
      qqNo: imUserBean.qqNo,
      email: imUserBean.email,
      weChatNo: imUserBean.weChatNo,
      mute: imUserBean.mute,
      mobileNumber: imUserBean.mobileNumber,
      photoFileUrl: imUserBean.photoFileUrl,
      orgId: imUserBean.orgId,
      phoneNumber: imUserBean.phoneNumber,
      publicTitle: !!(imUserBean.publicTitle == true || imUserBean.publicTitle == null),
      publicMobile: !!(imUserBean.publicMobile == true || imUserBean.publicMobile == null),
      publicDepart: !!(imUserBean.publicDepart == true || imUserBean.publicDepart == null),
      publicPhone: !!(imUserBean.publicPhone == true || imUserBean.publicPhone == null),
      publicEmail: !!(imUserBean.publicEmail == true || imUserBean.publicEmail == null),
      publicAddress: !!(imUserBean.publicAddress == true || imUserBean.publicAddress == null),
      publicWeChat: !!(imUserBean.publicWeChat == true || imUserBean.publicWeChat == null),
      publicQQ: !!(imUserBean.publicQQ == true || imUserBean.publicQQ == null)


    }, true);
  });
};

let _saveOrgBeanList = function (orgBeanList) {
  orgBeanList.forEach(function (orgBean) {
    console.log(orgBean);
    _saveOrgBeanItem(orgBean);
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
      deviceOS: Platform.OS,
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

let _clearToken = function (userId) {
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId: userId,
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

let _getUserId = function () {
  let d = _getLoginUserInfo();
  if (d) {
    return d.userId;
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

let _updateUserInfo = function (column, value) {
  let userId = _getUserId();
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId: userId,
      publicMobile: value
    }, true);
  });
};

let _getLoginUserInfoByUserId = function (userId) {
  let imUsers = _realm.objects(IMUSERINFO);
  return imUsers.filtered('"userId" = ' + userId);
};

let _saveFilters = function () {
  let data = TestData.filterData;
  let filterItems = data.filterItems;
  let orderItems = data.orderItems;
  orderItems.forEach(function (orderItem) {
    _realm.write(() => {
      _realm.create(ORDERITEM, {
        id: orderItem.id,
        fieldName: orderItem.fieldName,
        fieldDisplayName: orderItem.fieldDisplayName,
        fieldDisplayCode: orderItem.fieldDisplayCode,
        displaySequence: orderItem.displaySequence,
        filterId: orderItem.filterId,
        selected: orderItem.selected,
        asc: orderItem.asc
      }, true);
    });
  });
  filterItems.forEach(function (filterItem, index) {
    _realm.write(() => {
      _realm.create(FILTERITEMS, {
        id: index + 1,
        descrCode: filterItem.descrCode,
        descrName: filterItem.descrName,
        displaySeq: filterItem.displaySeq,
        options: filterItem.options
      }, true);
    });
  });
};

let _getFilters = function () {
  let filterItems = _realm.objects(FILTERITEMS);
  let orderItems = _realm.objects(ORDERITEM);
  let filtersArray = new Array();
  let orderArray = new Array();
  filterItems.forEach(function (filterItem) {
    filtersArray.push(filterItem)
  });
  orderItems.forEach(function (orderItem) {
    orderArray.push(orderItem)
  });
  return {
    filterItems: filtersArray,
    orderItems: orderArray
  }
};

let _saveOrgList = function (orgList) {
  orgList.forEach(function (n) {
    console.log(n);
    _saveOrgBeanItem(n);
  });
};

//返回构造好的orgList,满足AlphabetListView格式要求
let _getOrgList = function () {
  let orgList = _realm.objects(ORGBEAN);
  return ConvertChineseKey.buildOrgList(orgList);
};

module.exports = Object.assign(PersisterFacade, require('./contactPersisterFacade'), require('./sessionPersisterFacade'),
  require('./userPersisterFacade'));
