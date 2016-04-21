/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  SESSION,
  MESSAGE
  } = require('./schemas');
let { MSG_TYPE, MSG_CONTENT_TYPE, SESSION_TYPE } = require('../../constants/dictIm');

let SessionPersisterFacade = {
  deleteSession:(sessionId) => _deleteSession(sessionId),
  queryAllSession:() => _queryAllSession(),
  getGroupIdBySessionId: (sid, cuid) => _getGroupIdBySessionId(sid, cuid),
  getUserIdBySessionId:(sid, cuid) => _getUserIdBySessionId(sid, cuid),
  updateSession:(param)=>_updateSession(param),
  querySessionById:(id, type) => _querySessionById(id, type),
}

let _deleteSession = function(sessionId) {
  _realm.write(() => {
    let session = _realm.objects(SESSION).filtered('sessionId = \'' + sessionId + '\'');
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
  if(!tagId || tagId == cuid)
    tagId = l.toId;
  return  tagId ;
}

let _updateSession = function (param){
  _realm.write(()=>{
    _realm.create(SESSION,param,true);
  });
}

let _querySessionById = function(id, type){
  let r = "";
  if(type == SESSION_TYPE.USER) {
    r =  _realm.objects(MESSAGE).filtered('type == $0 ', type).filtered('toId == $0 || fromUId == $0', id);
  }else{
    r =  _realm.objects(MESSAGE).filtered('type == $0 ', type).filtered('groupId == $0', id);
  }
  return (!!r &&  !!r[0] )? r[0].sessionId:null;
}

module.exports = SessionPersisterFacade;
