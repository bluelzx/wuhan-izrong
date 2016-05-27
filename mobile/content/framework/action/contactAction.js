let contactStore = require('../store/contactStore');
let AppLinks = require('../../constants/appLinks');
let ErrorMsg = require('../../constants/errorMsg');
let _ = require('lodash');

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
    BFetch(AppLinks.createGroup, param).then((response)=> {
      //等接受邀请后再修改群信息\群主默认同意
      contactStore.createGroup(response.gid, groupName, groupMasterUid, [groupMasterUid], false);
      resolve(response);
    },reject);
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
      resolve(groupId);
    },reject);
  });
}

let _storeDeleteGroup = function(groupId){
  contactStore.dismissGroup(groupId);
}

let _storeLeaveGroup = function(groupId){
  contactStore.leaveGroup(groupId);
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
      resolve(groupId);
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
      resolve();//等被邀请人接受之后,在更改本地数据
    },(response)=>{
      console.log(response);
      reject(response)}
    );
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

/**
 * 接受邀请
 * @param groupId 邀请加入的群组id
 */
let _acceptInvitation = function (groupId) {
  let param = {
    gid: groupId
  }
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.acceptInvitation, param).then((response)=> {
      //TODO:将membersDetails遍历加入到IMUserInfo表中
      _updateGroupInfo(response.gid,response.groupName, response.groupOwnerId, response.members, false, response.groupImageUrl);
      contactStore.saveMembersDetails(response.membersDetails);
      resolve(response);
    }).catch((err)=>{
      reject(err);
    });
  });
}

/*** 更新群组信息
 * @param groupId int
 * @param groupImageUrl string
 * @param groupName string
 * @param groupMasterUid int
 * @param members int[]
 * @param mute bool
 * */
let _updateGroupInfo = function (groupId, groupName, groupMasterUid, members, mute, groupImageUrl) {
  contactStore.createGroup(groupId, groupName, groupMasterUid, members, mute)
}

/** 查询好友
 *  @param keyWord string
 * */
let _getTop3IMUserByKeyWord = function(keyWord) {
  let param = {
    keyWord:keyWord
  };

  return new Promise((resolve, reject) => {
    PFetch( AppLinks.getTop3IMUserByKeyWord, param).then((response)=>{
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

/** 查询全部好友
 *  @param keyWord string
 * */
let _searchUser = function(keyWord) {
  let param = {
    keyWord:keyWord
  };

  return new Promise((resolve, reject) => {
    PFetch( AppLinks.searcUser, param).then((response)=>{
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**添加好友
 * @param userId
 * */
let _addFriend = function(userId) {
  let param = {
    uid:userId
  }

  return new Promise((resolve, reject) => {
    BFetch(AppLinks.addFriend, param).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**接受好友邀请
 * @param usrId
 * */
let _acceptFriend = function(userId) {
  let param = {uid:userId};
  return new Promise((resolve, reject) => {
    BFetch(AppLinks.acceptFriend, param).then((response) => {
      if(_.isEmpty(response)){
        resolve();
      }
      contactStore.addFriend(response);
      resolve(response);
    }).catch((err) => {
      reject(err);
    });

  });
}

let _getUserInfoFromServer = function(userId){
let param = {uid:userId};
  return new Promise((resolve,reject) => {
    BFetch(AppLinks.getUserInfoById, param).then((response) => {
      if(_.isEmpty(response)){
        throw ErrorMsg.GETUSERINFOFROMIMSERVER;
      }
      contactStore.addFriend(response,true);
      resolve(response);
    }).catch((err)=>{
      reject(err);
    });
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
  deleteGroupMembers:_deleteGroupMembers,
  acceptInvitation:_acceptInvitation,
  updateGroupInfo:_updateGroupInfo,
  storeDeleteGroup:_storeDeleteGroup,
  storeLeaveGroup:_storeLeaveGroup,
  addFriend:_addFriend,

  acceptFriend:_acceptFriend,
  searchUser:_searchUser,
  getTop3IMUserByKeyWord:_getTop3IMUserByKeyWord,
  getUserInfoFromServer:_getUserInfoFromServer
};

module.exports = ContactAction;
