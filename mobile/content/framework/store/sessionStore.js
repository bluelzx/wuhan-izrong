/**
 * Created by baoyinghai on 4/20/16.
 */

let PersisterFacade = require('../persister/persisterFacade');
let ContactStore = require('./contactStore');
let AppStore = require('./appStore');


let _deleteSession = function(sessionId) {
  PersisterFacade.deleteSession(sessionId);
  AppStore.emitChange();
}

let _queryAllSession = function() {
  return PersisterFacade.queryAllSession();
}

let _getGroupInfoBySessionId = function(sessionId, currentUserId) {
  let groupId = PersisterFacade.getGroupIdBySessionId(sessionId, currentUserId);
  return ContactStore.getGroupDetailById(groupId);
}

let _getUserInfoBySessionId = function(sessionId, currentUserId) {
  let uid = PersisterFacade.getUserIdBySessionId(sessionId, currentUserId);
  return ContactStore.getUserInfoByUserId(uid);

}

let _updateSession = function(param){
  PersisterFacade.updateSession(param);
  AppStore.emitChange();
}

let _querySessionById = function(id, type){
  PersisterFacade.querySessionById(id, type);
}

let sessionStore = {
  deleteSession:_deleteSession,
  queryAllSession:_queryAllSession,
  querySessionById:_querySessionById,
  getGroupInfoBySessionId:_getGroupInfoBySessionId,
  getUserInfoBySessionId:_getUserInfoBySessionId,
  updateSession:_updateSession
}

module.exports = sessionStore;
