/***
 * 创建群组
 * @param members 成员id
 * @param groupName 群名
 * @param groupMasterUid 群组
 */

let _createGroup = function(members, groupName, groupMasterUid) {
  //return or callback
  return 0;
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
  return ;
}

/**
 * 群主修改群名称
 * @param groupId
 * @param groupName
 * */
let _modifyGroupName = function(groupId, groupName) {
  return ;
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
  return ;
}

let ContactAction = {
  createGroup:_createGroup,
  muteUser:_muteUser,
  muteGroup:_muteGroup,
  deleteGroup:_deleteGroup,
  dismissGroup:_dismissGroup,
  modifyGroupName:_modifyGroupName,
  addGroupMembers:_addGroupMembers,
  deleteGroupMembers:_deleteGroupMembers
};

module.exports = ContactAction;
