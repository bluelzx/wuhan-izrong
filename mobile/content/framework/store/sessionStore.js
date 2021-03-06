/**
 * Created by baoyinghai on 4/20/16.
 */
let PersisterFacade = require('../persister/persisterFacade');
let ContactStore = require('./contactStore');
let AppStore = require('./appStore');
let { IM_SESSION_LIST } = require('../../constants/dictEvent');


let _deleteSession = function(sessionId) {
  PersisterFacade.deleteSession(sessionId);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _queryAllSession = function(ownerId) {
  return PersisterFacade.queryAllSession(ownerId);
}

let _getGroupInfoBySessionId = function(sessionId, currentUserId) {
  let groupId = PersisterFacade.getGroupIdBySessionId(sessionId, currentUserId);
  return ContactStore.getGroupDetailById(groupId);
}

let _getUserInfoBySessionId = function(sessionId, currentUserId) {
  let uid = PersisterFacade.getUserIdBySessionId(sessionId, currentUserId);
  return ContactStore.getUserInfoByUserId(uid);

}

let _updateSession = function(param, notAdd, noticeType, currUserId){
  PersisterFacade.updateSession(param, notAdd, noticeType, currUserId);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _querySessionById = function(id, type){
  PersisterFacade.querySessionById(id, type);
}

let _setBadgeZero = function(sessionId) {
  PersisterFacade.setBadgeZero(sessionId);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _updateInViteSession = function(sessionId) {
  PersisterFacade.updateInViteSession(sessionId);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _getSessionIdByUserId = function(userId) {
  return PersisterFacade.getSessionIdByUserId(userId);
}

let sessionStore = {
  deleteSession:_deleteSession,
  queryAllSession:_queryAllSession,
  querySessionById:_querySessionById,
  getGroupInfoBySessionId:_getGroupInfoBySessionId,
  getUserInfoBySessionId:_getUserInfoBySessionId,
  updateSession:_updateSession,
  setBadgeZero: (sessionId) => _setBadgeZero(sessionId),
  updateInViteSession:(sessionId) => _updateInViteSession(sessionId),
  getSessionIdByUserId: (userId) => _getSessionIdByUserId(userId)
}

module.exports = sessionStore;
