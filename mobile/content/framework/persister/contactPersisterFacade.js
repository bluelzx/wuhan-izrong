/**
 * Created by baoyinghai on 4/19/16.
 */
let _realm = require('./realmManager');
let MockData = require('./createMockData');
const DEFAULT_GROUP_IMAGE = "";
const _ = require('lodash');
const {
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
let ContactPersisterFacade = {
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
  leaveGroup:(groupId) => _leaveGroup(groupId),
}


//造假数据
//_realm.write(() => {
//  for (let item of MockData.users) {
//    _realm.create(IMUSERINFO, item, true);
//  }
//
//  for (let org of MockData.orgs) {
//    _realm.create(ORGBEAN, org, true);
//  }
//
//  for (let group of MockData.groups) {
//    _realm.create(GROUP, group, true);
//  }
//
//  for (let message of MockData.message){
//    _realm.create(MESSAGE, message, true);
//  }
//
//  for(let session of MockData.sessionList){
//    _realm.create(MESSAGELIST, session, true);
//  }
//});



//***** helper
let _helperGroupByOrg = function(members){
  let res = {};
  for(let mem of members){
    if(!mem.orgId){
      throw '用户机构ID不能为null';
    }
    let org = _realm.objects(ORGBEAN).filtered('id = ' + mem.orgId);
    if(org.length > 0 ){
      if(!res[mem.orgId]) {
        res[mem.orgId]={
          orgValue:org[0].orgValue,
          orgMembers:[]
        };
      }
      let cache = res[mem.orgId];
      cache.orgMembers.push(mem);
    }
  }
  let ret = [];
  for(let mem in res){
    ret.push(res[mem]);
  }
  return ret;
}

let _getAllGroups = function () {
  return _realm.objects(GROUP);
};
//***查询群的详细信息
let _getGroupInfoByGroupId = function (groupId) {
  let result = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  if (result.length == 0){
    console.log(`查询群组ID:${groupId}的结果为空`);
    return {};
  }
  else{
    let members = [];
    let memlist = JSON.parse(result[0].members);
    console.log(memlist);
    for(let userId of memlist){
      let user = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
      if(user.length > 0)
        members.push(user[0]);
    }
    //result[0].members = members;
    let ret = {
      groupId:result[0].groupId,
      groupName: result[0].groupName,
      groupMasterUid: result[0].groupMasterUid,
      memberNum: result[0].memberNum,
      groupImageUrl:DEFAULT_GROUP_IMAGE,
      members: members,
      mute: result[0].mute
    };
    return ret;
  }

};

//****按照机构分组
let _getUsersGroupByOrg = function () {
  //获得所有机构
  let orgs = _realm.objects(ORGBEAN);
  let result = [];
  for(let org of orgs){
    let tmp = {
      orgValue:org.orgValue,
      orgMembers:null
    }
    let users = _realm.objects(IMUSERINFO).filtered('orgId = ' + org.id);
    tmp.orgMembers = users;
    result.push(tmp);
  }
  return result;
};

//****添加群组
let _createGroup = function(groupId, groupName,groupMasterUid,number,members,mute){
  _realm.write(() => {
    let group = {
      groupId:groupId,
      groupName:groupName,
      groupMasterUid:groupMasterUid,
      memberNum:number,
      groupImageUrl:DEFAULT_GROUP_IMAGE,
      members:JSON.stringify(members),
      mute:mute
    }
    _realm.create(GROUP, group, true);
  });
};
// *** 查询某个群的群成员, 并且按照机构分组
let _getGroupMembersByGroupId = function(groupId) {
  let groupInfo = _getGroupInfoByGroupId(groupId);
  if(!groupInfo || !groupInfo.members){
    console.log(`查看群成员,查询:${groupId}的结果为空`);
    return {};
  }else{
    let members = groupInfo.members;
    return _helperGroupByOrg(members);
  }
};
//*** 修改群名
let _modifyGroupName = function(groupId, groupName){
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let newGroup = {
    groupId:group[0].groupId,
    groupName:groupName,
    groupMasterUid:group[0].groupMasterUid,
    memberNum:group[0].memberNum,
    members:group[0].members,
    groupImageUrl:DEFAULT_GROUP_IMAGE,
    mute:group[0].mute
  }
  console.log(newGroup);
  _realm.write(() => {
    _realm.create(GROUP, newGroup, true);
  });
}
//****  查询所有用户,不包含某群成员, 并且按照机构分组
let _getUsersExpress = function(groupId) {
  let existMembers = _getGroupInfoByGroupId(groupId);//获得群组用户
  if(!existMembers || !existMembers.members){
    return _getUsersGroupByOrg();
  }else{
    let users = _realm.objects(IMUSERINFO);//获得所有用户
    let existM = existMembers.members;
    let userArray = [];
    for(let u of users){
      let f = true;
      for(let e of existM){
        if(u.userId == e.userId){
          f = false;
          break;
        }
      }
      if(f){
        userArray.push(u);
      }
    }
    return _helperGroupByOrg(userArray);
  }

};

let _getUserInfoByUserId = function (id) {
  let users = _realm.objects(IMUSERINFO).filtered('userId = ' + id)[0];
  let orgs = _realm.objects(ORGBEAN);
  let org = orgs.filtered('id = ' + users.orgId);
  let ret = {
    userId: users.userId,
    address: users.address,
    realName: users.realName,
    weChatNo: users.weChatNo,
    email: users.email,
    nameCardFileUrl: users.nameCardFileUrl,
    qqNo: users.qqNo,
    department: users.department,
    mobileNumber: users.mobileNumber,
    jobTitle: users.jobTitle,
    phoneNumber: users.phoneNumber,
    photoFileUrl: users.photoFileUrl,
    publicTitle: users.publicTitle,
    publicMobile: users.publicMobile,
    publicDepart: users.publicDepart,
    publicPhone: users.publicPhone,
    publicEmail: users.publicEmail,
    publicAddress: users.publicAddress,
    publicWeChat: users.publicWeChat,
    publicQQ: users.publicQQ,
    orgId: users.orgId,
    lastLoginTime:users.lastLoginTime,  //本地增加,用于多用户登陆排序
    token: users.token
  }
  if(org.length > 0)
    ret.orgValue = org[0].orgValue;
  return ret;
};

let _getLastMessageBySessionId = function(id) {
  let msgs = _realm.objects(MESSAGE).filtered('sessionId = ' + id);
  let msg = msgs.sorted('revTime')[0];
  return msg;
};

let _getAllSession = function() {
  return _realm.objects(MESSAGELIST);
};

//**** 踢人
let _kickOutMember = function (groupId, members) {
  let memberList = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let memList = JSON.parse(memberList[0].members);
  _.pull(memList,...members);
  let group = {
    groupId:memberList[0].groupId,
    groupName:memberList[0].groupName,
    groupMasterUid:memberList[0].groupMasterUid,
    memberNum:memList.length,
    groupImageUrl:DEFAULT_GROUP_IMAGE,
    members:JSON.stringify(memList),
    mute:memberList[0].mute
  }
  _realm.write(() => {
    _realm.create(GROUP, group, true);
  });
}



let _dismissGroup = function(groupId) {
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  _realm.write(() => {
    _realm.delete(group);
  });

}

let _leaveGroup = function(groupId) {
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  _realm.write(() => {
    _realm.delete(group);
  });
}

let _setContactMute = function(userId, value){
  _realm.write(()=>{
    let user = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
    user[0].mute = value;
    _realm.create(IMUSERINFO, user[0], true);
  });
}

let _setGroupMute = function(groupId, value){
  let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
  let param = {
    groupId:group[0].groupId,
    groupName:group[0].groupName,
    groupMasterUid:group[0].groupMasterUid,
    memberNum:group[0].memberNum,
    members:group[0].members,
    groupImageUrl:DEFAULT_GROUP_IMAGE,
    mute:value
  }
  _realm.write(()=>{
    _realm.create(GROUP, param, true);
  });
}
module.exports = ContactPersisterFacade;
