const _ = require('lodash');
let React = require('react-native');
let TestData = require('./testData');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let _realm = require('./realmManager');
let co = require('co');
let nextFrame = require('next-frame');
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
  //interface for ContactStore
  getLoginUserInfoByUserId: (userId)=>_getLoginUserInfoByUserId(userId),
  saveFilters: (filters)=> _saveFilters(filters),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=>_getOrgList(),
  deleteDevice: ()=> _deleteDevice(),
  updateLastSyncTime:(t)=>_updateLastSyncTime(t),
};


//test method
let _deleteDevice = function () {
  _realm.write(() => {
    let devices = _realm.objects(DEVICE);
    _realm.delete(devices); // Deletes all books
  });
};
//1461725152393
//1461725153730

//1461725788323
//1461725792041

let _saveAppData = function (data) {
  console.log("start" + new Date().getTime());
  //let loginUserInfo = data.appUserInfoOutBean;
  //let token = data.appToken;
  //let orgBeanList = data.orgBeanList;
  //let appUserGroupBeanList = data.appUserGroupBeanList;
  //let imUserBeanList = data.imUserBeanList;
  //_saveLoginUserInfo(loginUserInfo, token);
  //_saveImUsers(imUserBeanList);
  //_saveOrgBeanList(orgBeanList);
  //_saveAppUserGroupBeanList(appUserGroupBeanList);
  let loginUserInfo = data.appUserInfoOutBean;
  let token = data.appToken;
  let orgBeanList = data.orgBeanList;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let imUserBeanList = data.imUserBeanList;
  return new Promise((resolve)=> {
    resolve(_saveLoginUserInfo(loginUserInfo, token));
  })
    .then(_saveImUsers(imUserBeanList))
    .then(_saveOrgBeanList(orgBeanList))
    .then(_saveAppUserGroupBeanList(appUserGroupBeanList));
  //console.log("over"+new Date().getTime());
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
      publicTitle: !!(loginUserInfo.publicTitle == true || loginUserInfo.publicTitle === null),
      publicMobile: !!(loginUserInfo.publicMobile == true || loginUserInfo.publicMobile === null),
      publicDepart: !!(loginUserInfo.publicDepart == true || loginUserInfo.publicDepart === null),
      publicPhone: !!(loginUserInfo.publicPhone == true || loginUserInfo.publicPhone === null),
      publicEmail: !!(loginUserInfo.publicEmail == true || loginUserInfo.publicEmail === null),
      publicAddress: !!(loginUserInfo.publicAddress == true || loginUserInfo.publicAddress === null),
      publicWeChat: !!(loginUserInfo.publicWeChat == true || loginUserInfo.publicWeChat === null),
      publicQQ: !!(loginUserInfo.publicQQ == true || loginUserInfo.publicQQ === null),
      lastSyncTime:null
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
   return co(function *() {
    for (var i = 0; i < imUserBeanList.length; i++) {
      _saveImUser(imUserBeanList[i]);
      if (i % 10 == 0){
        yield nextFrame();
      }
    }
  });
};

let _saveImUser = function (imUserBean) {
  //wrap promise
  return new Promise((resolve)=> {
    resolve(_realm.write(() => {
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
        publicTitle: !!(imUserBean.publicTitle == true || imUserBean.publicTitle === null),
        publicMobile: !!(imUserBean.publicMobile == true || imUserBean.publicMobile === null),
        publicDepart: !!(imUserBean.publicDepart == true || imUserBean.publicDepart === null),
        publicPhone: !!(imUserBean.publicPhone == true || imUserBean.publicPhone === null),
        publicEmail: !!(imUserBean.publicEmail == true || imUserBean.publicEmail === null),
        publicAddress: !!(imUserBean.publicAddress == true || imUserBean.publicAddress === null),
        publicWeChat: !!(imUserBean.publicWeChat == true || imUserBean.publicWeChat === null),
        publicQQ: !!(imUserBean.publicQQ == true || imUserBean.publicQQ === null)
      }, true);
    }));
  });
};

let _saveOrgBeanList = function (orgBeanList) {
  return co(function *() {
    for (var i = 0; i < orgBeanList.length; i++) {
      _saveOrgBeanItem(orgBeanList[i]);
      if (i % 10 == 0){
        yield nextFrame();
      }
    }
  });
};

let _saveOrgBeanItem = function (orgBean) {
  return new Promise((resolve)=> {
    resolve(_realm.write(() => {
      _realm.create(ORGBEAN, {
        id: orgBean.id,
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
        totalQuota: orgBean.totalQuota,
        occupiedQuota: orgBean.occupiedQuota,
        isDeleted: orgBean.isDeleted,
        isApply: orgBean.isApply,
        remark: orgBean.remark
      }, true);
    }));
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
  let userInfo = _getLoginUserInfo();
  return userInfo.token;
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
    let sortedUsers = loginUsers.sorted('lastLoginTime', [true]);
    return sortedUsers[0];
  }
  return '';
};

let _getUserId = function () {
  let userInfo = _getLoginUserInfo();
  if (userInfo) {
    return userInfo.userId;
  }
  return '';
};

let _updateLastSyncTime = function(t) {
  _realm.write(()=>{
    let tag = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true]);
    if(tag && tag.length>0) {
      let o = tag[0];
      _realm.create(LOGINUSERINFO, {
        userId: o.userId,
        lastSyncTime:t
      }, true);
    }
  });
};

let _getOrgByOrgId = function (orgId) {
  let orgBeans = _realm.objects(ORGBEAN);
  if (orgBeans.isEmpty) {
    return null;
  }
  return orgBeans.filtered('id=' + orgId)[0];
};

let _getLoginUserInfoByUserId = function (userId) {
  let imUsers = _realm.objects(IMUSERINFO);
  return imUsers.filtered('"userId" = ' + userId);
};

let _saveFilters = function (filters) {
  let filterItems = filters.filterItems;
  let orderItems = filters.orderItems;
  orderItems.forEach(function (orderItem, index) {
    _realm.write(() => {
      _realm.create(ORDERITEM, {
        id: index + 1,
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
  let filtersArray = [];
  let orderArray = [];
  filterItems.forEach(function (filterItem) {
    filtersArray.push(filterItem);
  });
  orderItems.forEach(function (orderItem) {
    orderArray.push(orderItem);
  });
  return {
    filterItems: filtersArray,
    orderItems: orderArray
  };
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
  require('./userPersisterFacade'), require('./imPersister'), require('./platFormInfoPersisterFacade'), require('./homePagePersisterFacade'));
