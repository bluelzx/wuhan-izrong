/**
 * Created by baoyinghai on 4/19/16.
 */
let _realm = require('./realmManager');
const DEFAULT_GROUP_IMAGE = "";
const _ = require('lodash');
let SessionIdSplit = require('../../comp/utils/sessionIdSplitUtils');
const {
  GROUP,
  MESSAGE,
  IMUSERINFO,
  ORGBEAN,
  SESSION,
  LOGINUSERINFO,
  NOTICE
  } = require('./schemas');
let ContactPersisterFacade = {
getLastMessageBySessionId:(id) => _getLastMessageBySessionId(id),
  getAllGroups: () => _getAllGroups(),
  getUsersGroupByOrg: () => _getUsersGroupByOrg(),
  getAllUsersGroupByOrg:()=>_getAllUsersGroupByOrg(),
  getUserInfoByUserId: (id) => _getUserInfoByUserId(id),
  getGroupMembersByGroupId: (id) => _getGroupMembersByGroupId(id),
  getGroupInfoByGroupId:(id) => _getGroupInfoByGroupId(id),
  getUsersExpress:(groupId) => _getUsersExpress(groupId),
  getAllSession:() => _getAllSession(),
  createGroup:(groupId, groupName,groupMasterUid,number,members,mute) => _createGroup(groupId, groupName,groupMasterUid,number,members,mute),
  kickOutMember:(groupId, members) => _kickOutMember(groupId, members),
  modifyGroupName:(groupId, groupName) => _modifyGroupName(groupId, groupName),
  dismissGroup:(groupId, userId) => _dismissGroup(groupId, userId),
  setContactMute:(userId, value) => _setContactMute(userId, value),
  setGroupMute:(groupId, value) => _setGroupMute(groupId, value),
  leaveGroup:(groupId, userId) => _leaveGroup(groupId, userId),
  deleteContactInfo:(userIdList) => _deleteContactInfo(userIdList),
  updateContactInfo: (address, realName, email, nameCardFileUrl, department, publicDepart, jobTitle, publicTitle, mobileNumber, publicMobile, phoneNumber, publicPhone, publicEmail, publicAddress, publicWeChat, photoFileUrl, qqNo, publicQQ, weChatNo, userId, orgId, certified) =>
    _updateContactInfo(address, realName, email, nameCardFileUrl, department, publicDepart, jobTitle, publicTitle, mobileNumber, publicMobile, phoneNumber, publicPhone, publicEmail, publicAddress, publicWeChat, photoFileUrl, qqNo, publicQQ, weChatNo, userId, orgId, certified),
  addFriend: (userInfo) => _addFriend(userInfo),
  isStranger:(userId) => _isStranger(userId),
  getOrgValueByOrgId:(orgId) => _getOrgValueByOrgId(orgId)
}

//***** helper
let _helperGroupByOrg = function(members){
  let res = {};
  members.forEach((mem)=>{
    if(!mem.orgId){
      console.log('用户机构ID不能为null');
      // throw '用户机构ID不能为null';
    }else {
      let org = _realm.objects(ORGBEAN).filtered('id = ' + mem.orgId);
      if (org.length > 0) {
        if (!res[mem.orgId]) {
          res[mem.orgId] = {
            orgValue: org[0].orgValue,
            orgMembers: []
          };
        }
        let cache = res[mem.orgId];
        cache.orgMembers.push(mem);
      }
    }
  });
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
    throw `查询群组ID:${groupId}的结果为空`;
  }
  else{
    let members = [];
    let memlist = JSON.parse(result[0].members);
    memlist.forEach(
      (userId) => {
        let user = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
        if(user.length > 0)
          members.push(user[0]);
      }
    );

    //result[0].members = members;
    let ret = {
      groupId:result[0].groupId,
      groupName: result[0].groupName,
      groupMasterUid: result[0].groupMasterUid,
      memberNum: result[0].memberNum,
      groupImageUrl:DEFAULT_GROUP_IMAGE,
      members: members,
      mute: result[0].mute || false
    };
    return ret;
  }

};

let _getOrgValueByOrgId = function(orgId) {
  let orgs = _realm.objects(ORGBEAN).filtered('id =' + orgId);
  return orgs[0]&&orgs[0].orgValue;
}

//****按照机构分组
let _getAllUsersGroupByOrg = function () {
  //获得所有机构
  let orgs = _realm.objects(ORGBEAN).sorted('orgValue', false);
  let tag = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true]);

  let result = [];
  orgs.forEach((org) => {
    let tmp = {
      orgValue:org.orgValue,
      orgMembers:[]
    }
    let users = _realm.objects(IMUSERINFO).filtered('orgId = ' + org.id);
    tmp.orgMembers = users;
    result.push(tmp);

  });
  return result;
};

let _isStranger = function(userId) {
  let tag = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true]);
  let friendList =  JSON.parse(tag[0].friendList||'[]');
  return !(_.indexOf(friendList, userId)>=0);
}

let _getFriendList = function(){
  let tag = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true]);
  let friendList =  JSON.parse(tag[0].friendList||'[]');
  return friendList;
}

//****按照机构分组
let _getUsersGroupByOrg = function () {
  //获得所有机构
  let orgs = _realm.objects(ORGBEAN).sorted('orgValue', false);
  let friendList = _getFriendList();
  if(friendList && friendList.length > 0){
    let result = [];
    orgs.forEach((org) => {
      let tmp = {
        orgValue:org.orgValue,
        orgMembers:[]
      }
      let users = _realm.objects(IMUSERINFO).filtered('orgId = ' + org.id);
      //userId in friendList
      tmp.orgMembers = [];
      users && users.forEach((u)=>{
        if(_.indexOf(friendList, u.userId) >= 0){
          tmp.orgMembers.push(u);
        }

      });
      result.push(tmp);
    });
    return result;
  }else{
    return [];
  }

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
    let ret = {};
    for(let k in group){
      if(group[k]){
        ret[k] = group[k];
      }
    }
    try {
      _realm.create(GROUP, ret, true);
    }catch(err){
      _realm.create(GROUP, group, true);
    }
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
    groupId:groupId,
    groupName:groupName,
  }
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

    let friendList = _getFriendList();
    let allUsers = _realm.objects(IMUSERINFO);//获得所有用户
    let users = [];
    allUsers.forEach((item)=>{
      if(_.indexOf(friendList, item.userId) >= 0){
       users.push(item);
      }
    });

    let existM = existMembers.members;
    let userArray = [];
    users.forEach((u)=>{
      let f = true;
      existM.forEach((e)=>{
        if(u.userId == e.userId){
          f = false;
        }
      });
      if(f){
        userArray.push(u);
      }
    });
    return _helperGroupByOrg(userArray);
  }

};


//let _updateContactInfo = function(address, realName, email, nameCardFileUrl, department, publicDepart, jobTitle, publicTitle, mobileNumber, publicMobile, phoneNumber, publicPhone, publicEmail, publicAddress, publicWeChat, photoFileUrl, qqNo, publicQQ, weChatNo, userId, orgId, certified){
let _updateContactInfo = function(message){
 // message.address,
    //  message.realName, message.email, message.nameCardFileUrl, message.department, message.isPublicDepart,
    //  message.jobTitle, message.isPublicTitle, message.mobileNo, message.isPublicMobile, message.phoneNumber,
    //  message.isPublicPhone, message.isPublicEmail, message.isPublicAddress, message.isPublicWeChat, message.photoFileUrl,
    //  message.qqNo, message.isPublicQq, message.weChatNo, message.userId, message.orgId, message.isCertificated

  let param = {
    userId:message.userId,
    address:message.address,
    realName:message.realName,
    weChatNo:message.weChatNo,
    email:message.email,
    nameCardFileUrl:message.nameCardFileUrl,
    qqNo:message.qqNo,
    department:message.department,
    mobileNumber:message.mobileNo,
    jobTitle:message.jobTitle,
    publicDepart:message.isPublicDepart,
    publicTitle:message.isPublicTitle,
    publicMobile:message.isPublicMobile,
    phoneNumber:message.phoneNumber,
    publicPhone:message.isPublicPhone,
    publicEmail:message.isPublicEmail,
    publicAddress:message.isPublicAddress,
    publicWeChat: message.isPublicWeChat,
    photoFileUrl:message.photoFileUrl,
    publicQQ:message.isPublicQq,
    orgId: message.orgId,
    certificated:message.isCertificated,
    mute:false
  };
  let ret = {};
  for(let k in param){
    if(param[k] != undefined){
      ret[k] = param[k];
    }
  }

  _realm.write(()=>{
    try {
      //更新
      _realm.create(IMUSERINFO, ret, true);
    }catch(err){
      //创建
      _realm.create(IMUSERINFO, param, true);
    }
  });
}

let _deleteContactInfo = function(userIdList) {
  _realm.write(() => {
    userIdList && userIdList.forEach((item) => {
      let tag = _realm.objects(IMUSERINFO).filtered('userId = $0', item);
      _realm.delete(tag);
    });
  });
}

let _getUserInfoByUserId = function (id) {
  let users = _realm.objects(IMUSERINFO).filtered('userId = ' + id)[0];
  let orgs = _realm.objects(ORGBEAN);
  if(!users.orgId){
    throw '_getUserInfoByUserId users.orgId == null';
  }
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
    token: users.token,
    mute: users.mute
  };
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
    groupId:groupId,
    members:JSON.stringify(memList)
  }
  _realm.write(() => {
    _realm.create(GROUP, group, true);
  });
}

let _dismissGroup = function(groupId, userId) {
  _realm.write(() => {
    let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
    _realm.delete(group);
    _selfDeleteSession('group:' + groupId + ':' + userId);
  });
}

//invoke in translater
let _selfDeleteSession = function(sessionId){
    let session = _realm.objects(SESSION).filtered('sessionId = \'' + sessionId + '\'');
    _realm.delete(session);
}

let _selfDeleteNotice = function (groupId, userId) {
  let session = _realm.objects(NOTICE);
  let noticeNum = 0;
  let deleteNum = 0;
  session.forEach((item)=>{
    if (SessionIdSplit.getUserIdFromSessionId(item.sessionId) == userId) {
      noticeNum = noticeNum + 1;
      if (SessionIdSplit.getIdFromSessionId(item.sessionId) == groupId) {
        deleteNum = deleteNum + 1;
        let ret = _realm.objects(NOTICE).filtered('sessionId = \'' + item.sessionId + '\'');
        _realm.delete(ret)
      }
    }
  });
  if (noticeNum == deleteNum && noticeNum > 0) {
    let ret = _realm.objects(SESSION).filtered('type = \'' + SESSION_TYPE.GROUP_NOTICE + '\'');
    _realm.delete(ret);
  }
}

let _leaveGroup = function(groupId, userId) {
  //TODO: sessionId要加用户ID
  _realm.write(() => {
    let group = _realm.objects(GROUP).filtered('groupId = ' + groupId);
    _realm.delete(group);
    _selfDeleteSession('group:' + groupId + ':' + userId);
    _selfDeleteNotice(groupId, userId);
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
    groupId:groupId,
    mute:value
  }
  _realm.write(()=>{
    _realm.create(GROUP, param, true);
  });
}

let _addFriend = function(userInfo) {
  let param = {
    userId:userInfo.userId,
    address:userInfo.address,
    realName:userInfo.realName,
    weChatNo:userInfo.weChatNo,
    email:userInfo.email,
    nameCardFileUrl:userInfo.nameCardFileUrl,
    qqNo:userInfo.qqNo,
    department:userInfo.department,
    mobileNumber:userInfo.mobileNumber,
    jobTitle:userInfo.jobTitle,
    publicDepart:userInfo.publicDepart,
    publicTitle:userInfo.publicTitle,
    publicMobile:userInfo.publicMobile,
    phoneNumber:userInfo.phoneNumber,
    publicPhone:userInfo.publicPhone,
    publicEmail:userInfo.publicEmail,
    publicAddress:userInfo.publicAddress,
    publicWeChat:userInfo.publicWeChat,
    photoFileUrl:userInfo.photoFileUrl,
    publicQQ:userInfo.publicQQ,
    orgId:userInfo.orgId,
    mute:userInfo.mute,
    certificated:userInfo.isCertificated,
  };

  _realm.write(()=>{
    _realm.create(IMUSERINFO, param, true);
    let user = _realm.objects(LOGINUSERINFO).sorted('lastLoginTime', [true])[0];
    let friendList = user.friendList;
    friendList = JSON.parse(friendList||'[]');

    friendList.push(param.userId);
    _realm.create(LOGINUSERINFO,{userId:user.userId, friendList:JSON.stringify(friendList)},true);
  });

}

module.exports = ContactPersisterFacade;
