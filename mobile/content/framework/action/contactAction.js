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
  let memberList = [];
  for(let i in members){
    param.members.push(members[i].userId);
    memberList.push(members[i]);
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.createGroup, param).then((response)=>{
      console.log(response.gid);
      contactStore.createGroup(response.gid, groupName,groupMasterUid,memberList,false);
      resolve(response.gid);
    }, reject);
  });
};


/**
 * 屏蔽某个用户
 * @param userId 用户Id
 * @param value  true:屏蔽  false:不屏蔽
 * */
let _muteUser = function(userId, value){
  return ;
}

/**
 * 屏蔽某个群组
 * @param groupId  群组Id
 * @param value  true:屏蔽  false:不屏蔽
 * */
let _muteGroup = function(groupId, value){
  return ;
}
/**
 * 退出群
 * @param groupId  群组Id
 * */
let _deleteGroup = function(groupId){
  return ;
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
  return ;
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
  let memberList = [];
  for(let i in members){
    param.uid.push(members[i].userId);
    memberList.push(members[i]);
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.kickOutMember, param).then((response)=>{
      contactStore.kickOutMember(groupId, memberList);
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
