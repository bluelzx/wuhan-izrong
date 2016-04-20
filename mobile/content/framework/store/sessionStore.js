/**
 * Created by baoyinghai on 4/20/16.
 */

let PersisterFacade = require('../persister/persisterFacade');
let ContactStore = require('./contactStore');
let AppStore = require('./appStore');


let _deleteSession = function(sessionId) {
  PersisterFacade.deleteSession(sessionId);
}

let _queryAllSession = function() {
  return PersisterFacade.queryAllSession();
}

let _getGroupInfoBySessionId = function(sessionId, currentUserId) {
  let groupId = PersisterFacade.getGroupIdBySessionId(sessionId, currentUserId);
  return ContactStore.getUserInfoByUserId(groupId);
}

let _getUserInfoBySessionId = function(sessionId, currentUserId) {
  let uid = PersisterFacade.getUserIdBySessionId(sessionId, currentUserId);
  return ContactStore.getGroupDetailById(uid);

}

let _updateSession = function(param){
  PersisterFacade.updateSession(param);
  AppStore.emitChange();
}

let sessionStore = {
  deleteSession:_deleteSession,
  queryAllSession:_queryAllSession,
  getGroupInfoBySessionId:_getGroupInfoBySessionId,
  getUserInfoBySessionId:_getUserInfoBySessionId,
  updateSession:_updateSession
}

module.exports = sessionStore;
