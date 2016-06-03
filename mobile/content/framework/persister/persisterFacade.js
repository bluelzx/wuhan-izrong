const _ = require('lodash');
let React = require('react-native');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let _realm = require('./realmManager');
let co = require('co');
const {
  DEVICE,
  GROUP,
  IMUSERINFO,
  LOGINUSERINFO,
  ORGBEAN,
  FILTERITEMS,
  ORDERITEM
  } = require('./schemas');
let {Platform} = React;

let PersisterFacade = {
  //interface for AppStore
  saveAppData: (data) => _saveAppData(data),
  saveSimpleLoginData: (data, userId) => _saveSimpleLoginData(data, userId),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  logout: (userId) => _logout(userId),
  getLoginUserInfo: ()=> _getLoginUserInfo(),
  getUserId: ()=> _getUserId(),
  getOrgByOrgId: (orgId)=> _getOrgByOrgId(orgId),
  //interface for ContactStore
  getLoginUserInfoByUserId: (userId)=>_getLoginUserInfoByUserId(userId),
  saveFilters: (filters)=> _saveFilters(filters),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=>_getOrgList(),
  getOrgByOrgName: (orgName)=> _getOrgByOrgName(orgName),
  deleteDevice: ()=> _deleteDevice(),
  updateLastSyncTime: (t)=>_updateLastSyncTime(t),
  isInGroupById: (id, userId) => _isInGroupById(id, userId),
  saveImUsers: (membersDetail) => _saveImUsersOpen(membersDetail)
};

let _isInGroupById = function (id, userId) {
  let res = false;
  _realm.write(()=>{
    let ret = _realm.objects(GROUP).filtered('groupId = \'' + id + '\'');
    if (ret.length >0 && ret[0]) {
      let members = JSON.parse(ret[0].members);
      members.forEach((item)=>{
        if (item == userId) {
          res = true;
        }
      });
    }
  });
  return res;
};

//test method
let _deleteDevice = function () {
  _realm.write(() => {
    let devices = _realm.objects(DEVICE);
    _realm.delete(devices); // Deletes all books
  });
};

let _saveAppData = function (data) {
  console.log("start" + new Date().getTime());
  let appOrderSearchResult = data.appOrderSearchResult;
  let loginUserInfo = data.appUserInfoOutBean;
  loginUserInfo.friendList = data.friendList;
  let token = data.appToken;
  let orgBeanList = data.orgBeanList;
  let appUserGroupBeanList = data.appUserGroupBeanList || [];
  let imUserBeanList = data.imUserBeanList;
  return new Promise((resolve)=> {
    _realm.write(() => {
      _deleteImUsers();
      _deleteGroup();
      _saveLoginUserInfo(loginUserInfo, token);
      _saveImUsers(imUserBeanList);
      _saveOrgBeanList(orgBeanList);
      _saveFilters(appOrderSearchResult);
      _saveAppUserGroupBeanList(appUserGroupBeanList, resolve);
    });
  })
};

let _saveSimpleLoginData = function (data, userId) {
  return new Promise((resolve)=> {
    _realm.write(()=> {
        _realm.create(LOGINUSERINFO, {
          userId: userId,
          token: data.appToken
        }, true);
      }
    );
    resolve();
  }).catch((errorData)=> {
    throw errorData;
  });
};

let _deleteImUsers = function () {
  //imUsers不删
  //let imUsers = _realm.objects(IMUSERINFO);
  //_realm.delete(imUsers);
};

let _deleteGroup = function () {
  let groups = _realm.objects(GROUP);
  _realm.delete(groups);
};

let _saveLoginUserInfo = function (loginUserInfo, token) {

    let param =  {
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
      orgId: loginUserInfo.orgId,
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
      lastSyncTime: null,
      friendList: loginUserInfo.friendList && JSON.stringify(loginUserInfo.friendList),
      certified: loginUserInfo.certificated || false
    };

    let t = _realm.objects(LOGINUSERINFO).filtered('userId = $0',loginUserInfo.userId);
    if(t.length > 0){
      param.lastSyncTime = t.lastSyncTime;
    }else{
      param.lastSyncTime = new Date();
    }
    _realm.create(LOGINUSERINFO,param, true);

  //方便查询  将登录者的信息存入imuser表
  let loginImUser =  {
    userId: loginUserInfo.userId,
    address: loginUserInfo.address,
    realName: loginUserInfo.realName,
    nameCardFileUrl: loginUserInfo.nameCardFileUrl,
    department: loginUserInfo.department,
    jobTitle: loginUserInfo.jobTitle,
    qqNo: loginUserInfo.qqNo,
    email: loginUserInfo.email,
    weChatNo: loginUserInfo.weChatNo,
    mute:false,
    mobileNumber: loginUserInfo.mobileNumber,
    photoFileUrl: loginUserInfo.photoFileUrl,
    orgId: loginUserInfo.orgId,
    phoneNumber: loginUserInfo.phoneNumber,
    publicTitle: !!(loginUserInfo.publicTitle == true || loginUserInfo.publicTitle === null),
    publicMobile: !!(loginUserInfo.publicMobile == true || loginUserInfo.publicMobile === null),
    publicDepart: !!(loginUserInfo.publicDepart == true || loginUserInfo.publicDepart === null),
    publicPhone: !!(loginUserInfo.publicPhone == true || loginUserInfo.publicPhone === null),
    publicEmail: !!(loginUserInfo.publicEmail == true || loginUserInfo.publicEmail === null),
    publicAddress: !!(loginUserInfo.publicAddress == true || loginUserInfo.publicAddress === null),
    publicWeChat: !!(loginUserInfo.publicWeChat == true || loginUserInfo.publicWeChat === null),
    publicQQ: !!(loginUserInfo.publicQQ == true || loginUserInfo.publicQQ === null),
    certified: loginUserInfo.certificated || false
  };
  _realm.create(IMUSERINFO,loginImUser,true);

};

let _saveImUsersOpen = function (imUserBeanList) {
  _realm.write(()=> {
    _saveImUsers(imUserBeanList);
  });
}

let _saveImUsers = function (imUserBeanList) {
  for (var i = 0; i < imUserBeanList.length; i++) {
    let param = {
      userId: imUserBeanList[i].userId,
      address: !_.isEmpty(imUserBeanList[i].address) ? imUserBeanList[i].address : '',
      realName: imUserBeanList[i].realName ? imUserBeanList[i].realName : '',
      nameCardFileUrl: !_.isEmpty(imUserBeanList[i].nameCardFileUrl) ? imUserBeanList[i].nameCardFileUrl : '',
      department: !_.isEmpty(imUserBeanList[i].department) ? imUserBeanList[i].department : '',
      jobTitle: !_.isEmpty(imUserBeanList[i].jobTitle) ? imUserBeanList[i].jobTitle : '',
      qqNo: imUserBeanList[i].qqNo ? imUserBeanList[i].qqNo : '',
      email: imUserBeanList[i].email ? imUserBeanList[i].email : '',
      weChatNo: !_.isEmpty(imUserBeanList[i].weChatNo) ? imUserBeanList[i].weChatNo : '',
      mute: !_.isEmpty(imUserBeanList[i].mute) ? imUserBeanList[i].mute : false,
      mobileNumber: imUserBeanList[i].mobileNumber ? imUserBeanList[i].mobileNumber : '',
      photoFileUrl: !_.isEmpty(imUserBeanList[i].photoFileUrl) ? imUserBeanList[i].photoFileUrl : '',
      orgId: imUserBeanList[i].orgId ? imUserBeanList[i].orgId : '',
      phoneNumber: !_.isEmpty(imUserBeanList[i].phoneNumber) ? imUserBeanList[i].phoneNumber : '',
      publicTitle: !!(imUserBeanList[i].isPublicTitle == true || imUserBeanList[i].isPublicTitle === null),
      publicMobile: !!(imUserBeanList[i].isPublicMobile == true || imUserBeanList[i].isPublicMobile === null),
      publicDepart: !!(imUserBeanList[i].isPublicDepart == true || imUserBeanList[i].isPublicDepart === null),
      publicPhone: !!(imUserBeanList[i].isPublicPhone == true || imUserBeanList[i].isPublicPhone === null),
      publicEmail: !!(imUserBeanList[i].isPublicEmail == true || imUserBeanList[i].isPublicEmail === null),
      publicAddress: !!(imUserBeanList[i].isPublicAddress == true || imUserBeanList[i].isPublicAddress === null),
      publicWeChat: !!(imUserBeanList[i].isPublicWeChat == true || imUserBeanList[i].isPublicWeChat === null),
      publicQQ: !!(imUserBeanList[i].isPublicQQ == true || imUserBeanList[i].isPublicQQ === null),
      certified: imUserBeanList[i].isCertificated || false
    };
    _realm.create(IMUSERINFO, param, true);
  }
};

let _saveOrgBeanList = function (orgBeanList) {
  for (var i = 0; i < orgBeanList.length; i++) {
    _realm.create(ORGBEAN, {
      id: orgBeanList[i].id,
      orgCategory: orgBeanList[i].orgCategory,
      orgCode: orgBeanList[i].orgCode,
      orgValue: orgBeanList[i].orgValue,
      corporationType: orgBeanList[i].corporationType,
      orgValueAlias: orgBeanList[i].orgValueAlias,
      isDisabled: orgBeanList[i].isDisabled,
      creator: orgBeanList[i].creator,
      creatorDate: orgBeanList[i].creatorDate,
      lastUpdateBy: orgBeanList[i].lastUpdateBy,
      lastUpdateDate: orgBeanList[i].lastUpdateDate,
      isNeedAudit: orgBeanList[i].isNeedAudit,
      totalQuota: orgBeanList[i].totalQuota,
      occupiedQuota: orgBeanList[i].occupiedQuota,
      isDeleted: orgBeanList[i].isDeleted,
      isApply: orgBeanList[i].isApply,
      remark: orgBeanList[i].remark
    }, true);
  }
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

let _saveAppUserGroupBeanList = function (appUserGroupBeanList, resolve) {
  if (appUserGroupBeanList != null) {
    for (var i = 0; i < appUserGroupBeanList.length; i++) {
      _realm.create(GROUP, {
        groupId: appUserGroupBeanList[i].groupId,
        groupImageUrl: appUserGroupBeanList[i].groupImageUrl,
        groupName: appUserGroupBeanList[i].groupName,
        groupMasterUid: appUserGroupBeanList[i].groupOwnerId,
        memberNum: appUserGroupBeanList[i].members.length,
        members: JSON.stringify(appUserGroupBeanList[i].members),
        mute: appUserGroupBeanList[i].mute
      }, true);
    }
  }
  resolve();
};

let _getAPNSToken = function () {
  let device = _realm.objects(DEVICE);
  if (device.length === 0) {
    return '';
  }
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

let _logout = function (userId) {
  //clear token
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId: userId,
      token: ''
    }, true);
    //_realm.delete(_realm.objects(SESSION));
    //_realm.delete(_realm.objects(IMUSERINFO));
    //_realm.delete(_realm.objects(GROUP));
  });
};

let _getLoginUserInfo = function () {
  let loginUsers = _realm.objects(LOGINUSERINFO);
  if (loginUsers.length != 0) {
    let sortedUsers = loginUsers.sorted('lastLoginTime', [true]);
    let user = {
      userId: sortedUsers[0].userId,
      address: sortedUsers[0].address,
      realName: sortedUsers[0].realName,
      weChatNo: sortedUsers[0].weChatNo,
      email: sortedUsers[0].email,
      nameCardFileUrl: sortedUsers[0].nameCardFileUrl,
      qqNo: sortedUsers[0].qqNo,
      department: sortedUsers[0].department,
      mobileNumber: sortedUsers[0].mobileNumber,
      jobTitle: sortedUsers[0].jobTitle,
      phoneNumber: sortedUsers[0].phoneNumber,
      photoFileUrl: sortedUsers[0].photoFileUrl,
      publicTitle: sortedUsers[0].publicTitle,
      publicMobile: sortedUsers[0].publicMobile,
      publicDepart: sortedUsers[0].publicDepart,
      publicPhone: sortedUsers[0].publicPhone,
      publicEmail: sortedUsers[0].publicEmail,
      publicAddress: sortedUsers[0].publicAddress,
      publicWeChat: sortedUsers[0].publicWeChat,
      publicQQ: sortedUsers[0].publicQQ,
      orgId: sortedUsers[0].orgId,
      lastLoginTime: sortedUsers[0].lastLoginTime,
      token: sortedUsers[0].token,
      lastSyncTime: sortedUsers[0].lastSyncTime,
      certified: sortedUsers[0].certified,
      friendList: sortedUsers[0].friendList
    };
    return user;
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

let _updateLastSyncTime = function (t) {
  _realm.write(()=> {
    let tag = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true]);
    if (tag && tag.length > 0) {
      let o = tag[0];
      _realm.create(LOGINUSERINFO, {
        userId: o.userId,
        lastSyncTime: t
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
  filterItems.forEach(function (filterItem, index) {
    _realm.create(FILTERITEMS, {
      id: index + 1,
      descrCode: filterItem.descrCode,
      descrName: filterItem.descrName,
      displaySeq: filterItem.displaySeq,
      options: filterItem.options
    }, true);
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

//用户注册时选择机构调用
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

let _getOrgByOrgName = function (orgName) {
  let orgList = _realm.objects(ORGBEAN);
  let orgArr = [];
  orgList.forEach(function (orgBean) {
    if (orgBean.orgValue.includes(orgName)) {
      orgArr.push(orgBean);
    }
  });
  if (orgArr.length == 0) {
    return '';
  } else {
    return ConvertChineseKey.buildOrgList(orgArr);
  }
};
module.exports = Object.assign(PersisterFacade, require('./contactPersisterFacade'), require('./sessionPersisterFacade'),
  require('./userPersisterFacade'), require('./imPersister'), require('./platFormInfoPersisterFacade'),
  require('./homePersisterFacade'), require('./noticePersisterFacade'), require('./orgPersisterFacade'),
  require('./newFriendNoticPersisterFacade'), require('./photoHeaderPersisterFacade'));
