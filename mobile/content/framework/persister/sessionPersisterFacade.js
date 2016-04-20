/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  SESSION,
  MESSAGE
  } = require('./schemas');

let SessionPersisterFacade = {
  deleteSession:(sessionId) => _deleteSession(sessionId),
  queryAllSession:() => _queryAllSession(),
  getGroupIdBySessionId: (sid, cuid) => _getGroupIdBySessionId(sid, cuid),
  getUserIdBySessionId:(sid, cuid) => _getUserIdBySessionId(sid, cuid),
  updateSession:(param)=>_updateSession(param),
}

let _deleteSession = function(sessionId) {
  let session = _realm.objects(SESSION).filtered('sessionId = ' + sessionId);
  _realm.write(() => {
    _realm.delete(session);
  });
}

let _queryAllSession = function() {
  return _realm.objects(SESSION);
}

let _getGroupIdBySessionId = function(sid, cuid) {
  let l = _realm.objects(MESSAGE).filtered('sessionId = \'' + sid + '\'')[0];
  let tagId = l.groupId;
  return  tagId ;
}

let _getUserIdBySessionId = function(sid, cuid) {
  let l = _realm.objects(MESSAGE).filtered('sessionId = \'' + sid + '\'')[0];
  let tagId = l.fromUId;
  if(tagId == cuid)
    tagId = l.toId;
  return  tagId ;
}

let _updateSession = function (param){
  _realm.write(()=>{
    _realm.create(SESSION,param,true);
  });
}

module.exports = SessionPersisterFacade;
