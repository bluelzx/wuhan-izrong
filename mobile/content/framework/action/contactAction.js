let contactStore = require('../store/contactStore');
let { NodeHost } = require('../../../config');
let AppLinks = require('../../constants/appLinks');

let {
  BFetch,
  PFetch,
  UFetch
  } = require('../network/fetch');

/***
 * 创建群组
 * @param members 成员id
 * @param groupName 群名
 * @param groupMasterUid 群组
 */

let _createGroup = function(members, groupName, groupMasterUid) {
  //groupName:'gname',
  //groupImageUrl:'http:',
  //members:['u002','u003']
  let param = {
    groupName:groupName,
    groupImageUrl:'http://localhost/group',// 默认的头像
    members:[]
  };
  for(let i in members){
    param.members.push(members[i].userId);
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.createGroup, param).then((response)=>{
      console.log(response.gid);
      contactStore.createGroup(response.gid, groupName,groupMasterUid,param.members,false);
      resolve(response);
    }, reject);
  });
};


/**
 * 屏蔽某个用户
 * @param userId 用户Id
 * @param value  true:屏蔽  false:不屏蔽
 * */
let _muteUser = function(userId, value){
  let param = {
    uid:userId,
    state:value
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.setContactMute,param).then((response) => {
      contactStore.setContactMute(userId, value);
      resolve(response);
    },reject);
  });
}

/**
 * 屏蔽某个群组
 * @param groupId  群组Id
 * @param value  true:屏蔽  false:不屏蔽
 * */
let _muteGroup = function(groupId, value){
  let param = {
    gid:groupId,
    state:value
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.setGroupMute,param).then((response) => {
      contactStore.setGroupMute(groupId, value);
      resolve(response);
    },reject);
  });
}
/**
 * 退出群
 * @param groupId  群组Id
 * */
let _deleteGroup = function(groupId){
  let param = {
      gid:groupId
  };
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.leaveGroup, param).then((response) => {
      contactStore.leaveGroup(groupId);
      resolve();
    },reject);
  });
}

/**
 * 解散群
 * @param groupId 群组Id
 * */
let _dismissGroup = function(groupId){
  let param = {
    gid:groupId
  };
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.dismissGroup, param).then((response)=>{
      contactStore.dismissGroup(groupId);
      resolve(response);
    }, reject);
  });
}

/**
 * 群主修改群名称
 * @param groupId
 * @param groupName
 * */
let _modifyGroupName = function(groupId, groupName) {
  let param = {
    gid:groupId,
    groupName:groupName
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.updateGroupName, param).then((response)=>{
      contactStore.modifyGroupName(groupId, groupName);
      resolve(response);
    }, reject);
  });
}

/**
 * 增加群成员
 * @param groupId
 * @param members
 * */
let _addGroupMembers = function(groupId, members) {
  let param = {
    gid:groupId,
    members:[]
  }
  for(let i in members){
    param.members.push(members[i].userId);
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.inviteMember,param).then((response) => {
      resolve();//TODO:等通知
    },reject);
  });
}

/**
 * 删除群成员
 * @param groupId
 * @param members
 * */
let _deleteGroupMembers = function(groupId, members) {
  let param = {
    gid:groupId,
    uid:[]
  };
  for(let i in members){
    param.uid.push(members[i].userId);
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.kickOutMember, param).then((response)=>{
      contactStore.kickOutMember(groupId, param.uid);
      resolve(response.gid);
    }, reject);
  });
}

let ContactAction = {
  createGroup:(members, groupName, groupMasterUid) => _createGroup(members, groupName, groupMasterUid),
  muteUser:_muteUser,
  muteGroup:_muteGroup,
  deleteGroup:_deleteGroup,
  dismissGroup:_dismissGroup,
  modifyGroupName:_modifyGroupName,
  addGroupMembers:_addGroupMembers,
  deleteGroupMembers:_deleteGroupMembers
};

module.exports = ContactAction;
