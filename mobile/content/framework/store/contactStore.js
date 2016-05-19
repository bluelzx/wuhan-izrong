/**
 * Created by baoyinghai on 16/4/12.
 */

let { SESSION_TYPE, MSG_CONTENT_TYPE } = require('../../constants/dictIm');
let PersisterFacade = require('../persister/persisterFacade');
let AppStore = require('./appStore');
//let SessionStore = require('./sessionStore');
let { IM_CONTACT, IM_GROUP, IM_SESSION, IM_SESSION_LIST } = require('../../constants/dictEvent');

let _getContact = function(){
  //我的群  第一个元素必须为群组
  //联系人按群组分类
  let groups = PersisterFacade.getAllGroups();
  return [
    {
      orgMembers: groups
    }
  ].concat(_getUsers());
}

let _getUsers = function() {
  return PersisterFacade.getUsersGroupByOrg();
}

let _getAllUsers = function() {
  return PersisterFacade.getAllUsersGroupByOrg();
}

let _getIMNotificationMessage = function(userId) {

  let sessions = PersisterFacade.queryAllSession(userId);
  //let platformInfo = {};
  ////按照msgType 分两组, p2p 和 group, p2p 按照fromUid再分组,取组内最新的一条瓶装数据,并统计未读数量  ,最终结果再按照时间排序
  //let msgs = [];
  //sessions.forEach((session) => {
  //  if(session.type == MSG_TYPE.PLATFORM_INFO){ // TODO:两种判断
  //    platformInfo = session;
  //  }else{
  //    msgs.push(session);
  //  }
  //});
  return {
    msg:sessions           // 用户和群组的通知
  };
}

let _getUserInfoByUserId = function(id) {
  return PersisterFacade.getUserInfoByUserId(id);
}

let _getGroupDetailById = function(id) {
  return PersisterFacade.getGroupInfoByGroupId(id);
}

let _getUsersExpress = function(groupId) {
  return PersisterFacade.getUsersExpress(groupId);
}

let _getUserInfo = function() {
  return PersisterFacade.getLoginUserInfo();
}

let _getUsersByGroupId = function (groupId) {
  return PersisterFacade.getGroupMembersByGroupId(groupId);
}

let _getUserInfoBySessionId = function(id, currentUserId){
  let msg = PersisterFacade.getLastMessageBySessionId(id);
  let userId = msg.toId;
  if(msg.toId == currentUserId){
    userId = msg.fromId;
  }
  return _getUserInfoByUserId(userId);
}

let _getGroupInfoBySessionId = function(id, currentUserId) {
  let msg = PersisterFacade.getLastMessageBySessionId(id);
  let groupId = msg.groupId;
  return _getGroupDetailById(groupId);
}

/**
 *  groupId: {type: 'int', optional: true},
 groupName: {type: 'string', optional: true},
 groupMasterUid: {type: 'int', optional: true},
 memberNum: {type: 'int', optional: true},
 members: {type: 'list', objectType: 'imUserInfo'},
 mute: {type: 'bool', optional: true}
 */

let _createGroup = function(groupId, groupName,groupMasterUid,members,mute){
  PersisterFacade.createGroup(groupId, groupName,groupMasterUid,members.length,members,mute);
  AppStore.emitChange(IM_CONTACT);
  AppStore.emitChange(IM_GROUP);
  AppStore.emitChange(IM_SESSION);
}

let _kickOutMember = function(groupId, members) {
  PersisterFacade.kickOutMember(groupId, members);
  AppStore.emitChange(IM_GROUP);
}

let _modifyGroupName = function(groupId, groupName) {
  PersisterFacade.modifyGroupName(groupId, groupName);
  AppStore.emitChange(IM_CONTACT);
  AppStore.emitChange(IM_GROUP);
}

let _dismissGroup = function(groupId) {
  PersisterFacade.dismissGroup(groupId);
  AppStore.emitChange(IM_CONTACT);
  AppStore.emitChange(IM_GROUP);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _setContactMute = function(userId, value) {
  PersisterFacade.setContactMute(userId, value);
  AppStore.emitChange(IM_GROUP);
}

let _setGroupMute = function(groupId, value){
  PersisterFacade.setGroupMute(groupId, value);
  AppStore.emitChange(IM_GROUP);
}

let _leaveGroup = function(groupId){
  PersisterFacade.leaveGroup(groupId);
  AppStore.emitChange(IM_CONTACT);
  AppStore.emitChange(IM_SESSION);
  AppStore.emitChange(IM_GROUP);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _addFriend = function(userInfo) {
  PersisterFacade.addFriend(userInfo);
  AppStore.emitChange(IM_CONTACT);
}

let _syncReq = function(data){
  //TODO:....
  AppStore.updateLastSyncTime(data);
}


let _newFriendNotic = function(param, userId) {
  let orgValue = PersisterFacade.getOrgValueByOrgId(param.orgId);
  PersisterFacade.createNewNotic(param.noticId, param.userId, param.realName, orgValue, param.photoFileUrl,param.certificated, userId);
  //updateSession
  let p = {
    sessionId: param.noticId,
    type: SESSION_TYPE.NEWFRIEND,
    badge:0,
    title: '',
    content:'',
    lastTime: new Date(),
    contentType: MSG_CONTENT_TYPE.NULL
  };
  PersisterFacade.updateSession(p, {notAdd:false});
  PersisterFacade.addFriend(param);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _isStranger = function(userId){
  return PersisterFacade.isStranger(userId);
}

let _getOrgValueByOrgId = function(orgId){
  return PersisterFacade.getOrgValueByOrgId(orgId);
}

let ContactStore = {
  getGroupInfoBySessionId:_getGroupInfoBySessionId,  //根据会话Id获得群组信息
  getUserInfoBySessionId:_getUserInfoBySessionId,       //根据会话Id获得用户信息
  getContact:_getContact ,                 //获得联系人和群组信息   ok
  getIMNotificationMessage:_getIMNotificationMessage,  //获得推送的通知消息
  getUsers:_getUsers,                             //获得所有用户 按照org分组    ok
  getUserInfoByUserId:_getUserInfoByUserId,       // 根据userId获得用户信息   ok
  getGroupDetailById:_getGroupDetailById,          //更具groupId获得群组信息    ok
  getUsersExpress:_getUsersExpress,               //获得除了已存在groupId群组中的用户
  getUserInfo:_getUserInfo,                       // 获得当前用户信息  ok
  getUsersByGroupId:_getUsersByGroupId ,           //获得群组成员  ok

  createGroup:_createGroup,
  kickOutMember:_kickOutMember,    //踢人
  modifyGroupName:_modifyGroupName,
  dismissGroup:_dismissGroup,
  setContactMute:_setContactMute, //屏蔽用户
  setGroupMute:_setGroupMute,
  leaveGroup:_leaveGroup,

  addFriend:_addFriend,
  newFriendNotic:_newFriendNotic,

  syncReq:_syncReq, //同步全部信息
  getAllUsers:_getAllUsers,                             //获得所有用户 按照org分组    ok 包括非好友部分
  isStranger:_isStranger,
  getOrgValueByOrgId:_getOrgValueByOrgId
};



module.exports = ContactStore;
