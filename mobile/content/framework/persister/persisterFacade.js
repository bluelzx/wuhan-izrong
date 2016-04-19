const _ = require('lodash');
const Realm = require('realm');
let React = require('react-native');
let MockData = require('./createMockData');
let TestData = require('./testData');
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

let PersisterFacade = {
  getLastMessageBySessionId:(id) => _getLastMessageBySessionId(id),
  getAllGroups: () => _getAllGroups(),
  getUsersGroupByOrg: () => _getUsersGroupByOrg(),
  getUserInfoByUserId: (id) => _getUserInfoByUserId(id),
  getGroupMembersByGroupId: (id) => _getGroupMembersByGroupId(id),
  getGroupInfoByGroupId:(id) => _getGroupInfoByGroupId(id),
  getUsersExpress:(groupId) => _getUsersExpress(groupId),
  getAllSession:() => _getAllSession(),
  createGroup:(groupId, groupName,groupMasterUid,number,members,mute) => _createGroup(groupId, groupName,groupMasterUid,number,members,mute),
  kickOutMember:(groupId, members) => _kickOutMember(groupId, members),
  modifyGroupName:(groupId, groupName) => _modifyGroupName(groupId, groupName),
  dismissGroup:(groupId) => _dismissGroup(groupId),
  setContactMute:(userId, value) => _setContactMute(userId, value),
  setGroupMute:(groupId, value) => _setGroupMute(groupId, value),

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
  getContact: ()=>_getContact(),
  _getIMNotificationMessage: ()=>_getIMNotificationMessage(),
  getUsers: ()=>_getUsers(),
  getLoginUserInfoByUserId: (userId)=>_getLoginUserInfoByUserId(userId),
  getGroupDetailById: (groupId)=>_getGroupDetailById(groupId),
  saveOrgBeanSet: () => _saveOrgBeanSet(),
  saveFilters: ()=> _saveFilters(),
  getFilters: ()=> _getFilters(),
  saveOrgList: (orgList)=> _saveOrgList(orgList),
  getOrgList: ()=>_getOrgList()
};

console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema, LoginUserInfoSchema, OrgBeanSchema,
    BizOrderCategorySchema, BizOrderItemSchema, FilterItemSchema, FilterItemsSchema, OrderItemSchema, MessageListSchema],
  schemaVersion: 14
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
  TestData.mockOrgBeanSet.forEach(function (n) {
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

let _clearToken = function (userId) {
  _realm.write(() => {
    _realm.create(LOGINUSERINFO, {
      userId:userId,
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
  if (_getLoginUserInfo){
    return _getLoginUserInfo.userId;
  }else{
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

//返回构造好的orgList,满足AlphabetListView格式要求
let _getOrgList = function () {
  let orgList = _realm.objects(ORGBEAN);
  return ConvertChineseKey.buildOrgList(orgList);
};



//造假数据
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

  for (let message of MockData.message){
    _realm.create(MESSAGE, message, true);
  }

  for(let session of MockData.sessionList){
    _realm.create(MESSAGELIST, session, true);
  }
});



let _getAllGroups = function () {
  return _realm.objects(GROUP);
};

let _getGroupInfoByGroupId = function (groupId) {
  return _realm.objects(GROUP).filtered('groupId = ' + groupId)[0];
};

let _getGroupMembersByGroupId = function(groupId) {
  let orgs = _realm.objects(ORGBEAN);
  let users = _getGroupInfoByGroupId(groupId).members;
  let orgArray = [];
  for (let org of orgs) {
    let id = org.id;
    let orgMembers = users.filtered('orgBeanId = ' + id);
    if(orgMembers.length > 0 ){
      org.orgMembers = orgMembers;
      orgArray.push(org);
    }

  }
  return orgArray;

};


let _getUsersGroupByOrg = function () {
  let orgs = _realm.objects(ORGBEAN);
  let users = _realm.objects(IMUSERINFO);
  let orgArray = [];
  for (let org of orgs) {
    let id = org.id;
    let obj = {
      ogrMembers:'',
      orgValue:org.orgValue,
    };
    let orgMembers = users.filtered('orgBeanId = ' + id);
    if(orgMembers.length > 0 ){
      obj.orgMembers = orgMembers;
      orgArray.push(obj);
    }
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

let _isInGroup = function(existMembers, id){
  let array = [];
  for (let mem of existMembers) {
    if (mem.userId == id) {
      array.push(mem);
    }
  }
  return array;
};

let _isNotInGroup = function(orgMembers, existMembers){
  let array = [];
  for(let mem of orgMembers){
    let f = false;
    for(let ex of existMembers){
      if(mem.userId == ex.userId){
        f = true;
      }
    }
    !f ? array.push(mem) : '';
  }
  return array;
};

let _getUsersExpress = function(groupId) {
  let orgs = _realm.objects(ORGBEAN);//获得所有机构
  let users = _realm.objects(IMUSERINFO);//获得所有用户
  let existMembers = _getGroupMembersByGroupId(groupId);//获得群组用户
  let orgArray = [];
  for (let org of orgs) {
    let id = org.id;
    let orgMembers = users.filtered('orgBeanId = ' + id);//机构下的成员
    if(existMembers.length != 0) {
      let m;
      for (m of existMembers) {
        if (m.id == id) {
          break;
        }
      }
      org.orgMembers = _isNotInGroup(orgMembers, m.orgMembers);
    }else{
      org.orgMembers = orgMembers;
    }
    orgArray.push(org);
  }

  return orgArray;
};


let _getLastMessageBySessionId = function(id) {
  let msgs = _realm.objects(MESSAGE).filtered('sessionId = ' + id);
  let msg = msgs.sorted('revTime')[0];
  return msg;
};

let _getAllSession = function() {
  return _realm.objects(MESSAGELIST);
};

let _createGroup = function(groupId, groupName,groupMasterUid,number,members,mute){
  _realm.write(() => {
    let group = {
      groupId:groupId,
      groupName:groupName,
      groupMasterUid:groupMasterUid,
      memberNum:number,
      members:members,
      mute:mute
    }
    _realm.create(GROUP, group, true);
  });
}

let _kickOutMember = function (groupId, members) {
  let memberList = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let mem = [];
  for(let m of memberList[0].members){
    let f = false;
    for(let kout of members){
      if(m.userId == kout.userId){
        f = true;
      }
    }
    !f?mem.push(m):'';
  }
  //memberList[0] = mem;
  let d = memberList[0]
  let group = {
    groupId:d.groupId,
    groupName:d.groupName,
    groupMasterUid:d.groupMasterUid,
    memberNum:d.memberNum - members.length,
    members:mem,
    mute:d.mute
  }
  _realm.write(() => {
    _realm.create(GROUP, group, true);
  });
}

let _modifyGroupName = function(groupId, groupName){
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let newGroup = {
    groupId:group[0].groupId,
    groupName:groupName,
    groupMasterUid:group[0].groupMasterUid,
    memberNum:group[0].memberNum,
    members:group[0].members,
    mute:group[0].mute
  }
  console.log(newGroup);
  _realm.write(() => {
    _realm.create(GROUP, newGroup, true);
  });

}

let _dismissGroup = function(groupId) {
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let newGroup = {
    groupId:group[0].groupId,
    groupName:'',
    groupMasterUid:group[0].groupMasterUid,
    memberNum:group[0].memberNum,
    members:[],
    mute:group[0].mute
  }
  //console.log(newGroup);
  _realm.write(() => {
    let g = _realm.create(GROUP, newGroup, true);
    _realm.delete(g);
  });

}

let _setContactMute = function(userId, value){
  let user = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
  user.mute = value;
  _realm.write(()=>{
    _realm.create(IMUSERINFO, user, true);
  });
}

let _setGroupMute = function(groupId, value){
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  group.mute = value;
  _realm.write(()=>{
    _realm.create(GROUP, group, true);
  });
}

module.exports = PersisterFacade;
