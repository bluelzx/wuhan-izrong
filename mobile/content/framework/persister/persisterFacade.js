const _ = require('lodash');
const Realm = require('realm');
let React = require('react-native');
let MockData = require('./createMockData');
let FilterData = require('./filterData');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
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
  FilterItemSchema,
  FilterItemsSchema,
  OrderItemSchema,
  MessageListSchema,
  DEVICE,
  GROUP,
  MESSAGE,
  IMUSERINFO,
  LOGINUSERINFO,
  ORGBEAN,
  BIZORDERCATEGORY,
  BIZORDERITEM,
  FILTERITEMS,
  FILTERITEM,
  ORDERITEM,
  MESSAGELIST
  } = require('./schemas');
let {Platform} = React;

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema, LoginUserInfoSchema, OrgBeanSchema,
    BizOrderCategorySchema, BizOrderItemSchema, FilterItemSchema, FilterItemsSchema, OrderItemSchema, MessageListSchema],
  schemaVersion: 2
});

let _saveAppData = function (data) {
  let orgBeanSet = data.orgBeanSet;
  let appUser = data.appUserInfoBean;
  let appUserGroupBeanList = data.appUserGroupBeanList;
  let bizOrderCategoryBeanList = data.bizOrderCategoryBeanList;
  let imUserBeanList = data.imUserBeanList;
  _saveLoginUserInfo(data);
  _saveImUsers();
  _saveOrgBeanSet();
  //_saveOrgBean(orgBeanSet);
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
      lastLoginTime: new Date(),
      publicTitle: _.isEmpty(loginUserInfo.publicTitle) ? true : loginUserInfo.publicTitle,
      publicMobile: _.isEmpty(loginUserInfo.publicMobile) ? true : loginUserInfo.publicMobile,
      publicDepart: _.isEmpty(loginUserInfo.publicDepart) ? true : loginUserInfo.publicDepart,
      publicPhone: _.isEmpty(loginUserInfo.publicPhone) ? true : loginUserInfo.publicPhone,
      publicEmail: _.isEmpty(!loginUserInfo.publicEmail) ? true : loginUserInfo.publicEmail,
      publicAddress: _.isEmpty(loginUserInfo.publicAddress) ? true : loginUserInfo.publicAddress,
      publicWeChat: _.isEmpty(loginUserInfo.publicWeChat) ? true : loginUserInfo.publicWeChat,
      publicQQ: _.isEmpty(loginUserInfo.publicQQ) ? true : loginUserInfo.publicQQ
    }, true);
  });
};

let _saveImUsers = function () {

};

let _saveOrgBeanSet = function () {
  let mockOrgBeanSet = [
    {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 1,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 2,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 3,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }, {
      corporationType: "INDEPENDENT",
      creator: null,
      creatorDate: null,
      id: 4,
      isApply: null,
      isDeleted: null,
      isDisabled: false,
      isNeedAudit: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
      occupiedQuota: 2,
      orgCategory: "BANK",
      orgCode: "21556211-2",
      orgValue: "天津银行无锡分行天津银行无锡分行无锡分行",
      orgValueAlias: null,
      remark: null,
      totalQuota: 5
    }
  ];
  mockOrgBeanSet.forEach(function (n) {
    console.log(n);
    _saveOrgBeanItem(n);
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
      deviceOS: 'IOS',
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

let _clearToken = function () {
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
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

let _getOrgByOrgId = function (orgId) {
  let orgBeans = _realm.objects(ORGBEAN);
  if (orgBeans.isEmpty) {
    return null;
  } else {
    return orgBeans.filtered('id=' + orgId)[0];
  }
};

let _getContact = function () {

};

let _getUsers = function () {

};

let _getLoginUserInfoByUserId = function (userId) {
  let imUsers = _realm.objects(IMUSERINFO);
  return imUsers.filtered('"userId" = ' + userId);
};

let _getGroupDetailById = function (groupId) {

};

let _getIMNotificationMessage = function () {

};

let _getUsersExpress = function () {

};

let _saveFilters = function () {
  let data = FilterData.filterData;
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
  console.log(filterItems);
  return {
    filterItems: filterItems,
    orderItems: orderItems
  }
};


let _saveOrgList = function (orgList) {
  orgList.forEach(function (n) {
    console.log(n);
    _saveOrgBeanItem(n);
  });
};

//返回构造好的orgList
let _getOrgList = function () {
  let orgList = _realm.objects(ORGBEAN);
  let A = new Array();
  let B = new Array();
  let C = new Array();
  let D = new Array();
  let E = new Array();
  let F = new Array();
  let G = new Array();
  let H = new Array();
  let I = new Array();
  let J = new Array();
  let K = new Array();
  let L = new Array();
  let M = new Array();
  let N = new Array();
  let O = new Array();
  let P = new Array();
  let Q = new Array();
  let R = new Array();
  let S = new Array();
  let T = new Array();
  let U = new Array();
  let V = new Array();
  let W = new Array();
  let X = new Array();
  let Y = new Array();
  let Z = new Array();
  let $ = new Array();

  orgList.forEach(function (orgItem) {
    console.log(orgItem);
    switch (ConvertChineseKey.makePy(orgItem.orgValue)) {
      case 'A':
        A.push(orgItem);
        break;
      case 'B':
        B.push(orgItem);
        break;
      case 'C':
        C.push(orgItem);
        break;
      case 'D':
        D.push(orgItem);
        break;
      case 'E':
        E.push(orgItem);
        break;
      case 'F':
        F.push(orgItem);
        break;
      case 'G':
        G.push(orgItem);
        break;
      case 'H':
        H.push(orgItem);
        break;
      case 'I':
        I.push(orgItem);
        break;
      case 'J':
        J.push(orgItem);
        break;
      case 'K':
        K.push(orgItem);
        break;
      case 'L':
        L.push(orgItem);
        break;
      case 'M':
        M.push(orgItem);
        break;
      case 'N':
        N.push(orgItem);
        break;
      case 'O':
        O.push(orgItem);
        break;
      case 'P':
        P.push(orgItem);
        break;
      case 'Q':
        A.push(orgItem);
        break;
      case 'R':
        R.push(orgItem);
        break;
      case 'S':
        S.push(orgItem);
        break;
      case 'T':
        T.push(orgItem);
        break;
      case 'U':
        U.push(orgItem);
        break;
      case 'V':
        V.push(orgItem);
        break;
      case 'W':
        W.push(orgItem);
        break;
      case 'X':
        X.push(orgItem);
        break;
      case 'Y':
        Y.push(orgItem);
        break;
      case 'Z':
        Z.push(orgItem);
        break;
      case '$':
        $.push(orgItem);
    }
  });

  let buildList = {
    'A':A, 'B':B, 'C':C, 'D':D, 'E':E, 'F':F, 'G':G,
    'H':H, 'I':I, 'J':J, 'K':K, 'L':L, 'M':M, 'N':N,
    'O':O, 'P':P, 'Q':Q, 'R':R, 'S':S, 'T':T, 'U':U,
    'V':V, 'W':W, 'X':X, 'Y':Y, 'Z':Z, '$':$
  };
  console.log(buildList);
  return buildList;
};


_realm.write(() => {
  for (let item of MockData.users) {
    _realm.create(IMUSERINFO, item, true);
  }

  for (let org of MockData.orgs) {
    _realm.create(ORGBEAN, org, true);
  }

  for (let group of MockData.groups) {
    _realm.create(GROUP, group, true);
  }
});

let _getAllGroups = function () {
  return _realm.objects(GROUP);
};

let _getUsersGroupByOrg = function () {
  let orgs = _realm.objects(ORGBEAN);
  let users = _realm.objects(IMUSERINFO);
  let orgArray = [];
  for (let org of orgs) {
    let id = org.id;
    let orgMembers = users.filtered('orgBeanId = ' + id);
    org.orgMembers = orgMembers;
    orgArray.push(org);
  }
  return orgArray;
};

let _getUserInfoByUserId = function (id) {
  let users = _realm.objects(IMUSERINFO).filtered('userId = ' + id)[0];
  let orgs = _realm.objects(ORGBEAN);
  let org = orgs.filtered('id = ' + users.orgBeanId);
  users.orgValue = org[0].orgValue;
  return users;
};

let PersisterFacade = {
  getAllGroups: () => _getAllGroups(),
  getUsersGroupByOrg: () => _getUsersGroupByOrg(),
  getUserInfoByUserId: (id) => _getUserInfoByUserId(id),

  //interface for AppStore
  saveAppData: (data) => _saveAppData(data),
  saveAPNSToken: (apnsToken) => _saveAPNSToken(apnsToken),
  getAPNSToken: () => _getAPNSToken(),
  getToken: ()=> _getToken(),
  clearToken: () => _clearToken(),
  getLoginUserInfo: ()=> _getLoginUserInfo(),
  getOrgByOrgId: (orgId)=> _getOrgByOrgId(orgId),
  //interface for ContactStore
  getContact: ()=>_getContact(),
  _getIMNotificationMessage: ()=>_getIMNotificationMessage(),
  getUsers: ()=>_getUsers(),
  getLoginUserInfoByUserId: (userId)=>_getLoginUserInfoByUserId(userId),
  getGroupDetailById: (groupId)=>_getGroupDetailById(groupId),
  getUsersExpress: ()=> _getUsersExpress(),
  saveOrgBeanSet: () => _saveOrgBeanSet(),
  saveFilters: ()=> _saveFilters(),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=>_getOrgList()
};

module.exports = PersisterFacade;
