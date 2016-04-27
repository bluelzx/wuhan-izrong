/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  SESSION,
  MESSAGE
  } = require('./schemas');
let { SESSION_TYPE } = require('../../constants/dictIm');

let SessionPersisterFacade = {
  deleteSession: (sessionId) => _deleteSession(sessionId),
  queryAllSession: () => _queryAllSession(),
  getGroupIdBySessionId: (sid, cuid) => _getGroupIdBySessionId(sid, cuid),
  getUserIdBySessionId: (sid, cuid) => _getUserIdBySessionId(sid, cuid),
  updateSession: (param)=>_updateSession(param),
  querySessionById: (id, type) => _querySessionById(id, type),
  setBadgeZero: (sessionId) => _setBadgeZero(sessionId),
  updateInViteSession:(sessionId) => _updateInViteSession(sessionId),
}

let _deleteSession = function(sessionId) {
  _realm.write(() => {
    let session = _realm.objects(SESSION).filtered('sessionId = \'' + sessionId + '\'');
    _realm.delete(session);
  });
}

let _queryAllSession = function() {
  let ret = [];
  _realm.objects(SESSION).forEach((item)=>{
    let p = {
      sessionId: item.sessionId,
      type: item.type,
      badge:item.badge,
      title: item.title,
      content:item.content,
      lastTime: item.lastTime,
      contentType: item.contentType
    };
    ret.push(p);
  });
  return ret;
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
    let p = _realm.objects(SESSION).filtered("sessionId = '" + param.sessionId + "'");
    if(p.length > 0){
      param.badge = p[0].badge + 1;
    }
    _realm.create(SESSION, param, true);
  });
}

let _setBadgeZero = function (sessionId) {
  _realm.write(()=> {
    _realm.create(SESSION, {sessionId: sessionId, badge: 0}, true);
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

let _updateInViteSession = function(sessionId) {
  _realm.write(()=>{
    _realm.create(SESSION,{sessionId:sessionId, type:SESSION_TYPE.INVITED}, true);
  })
}

module.exports = SessionPersisterFacade;
