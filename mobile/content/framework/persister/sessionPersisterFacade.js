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
let SessionIdSplit = require('../../comp/utils/sessionIdSplitUtils');
let SessionPersisterFacade = {
  deleteSession: (sessionId) => _deleteSession(sessionId),
  queryAllSession: (currUserId) => _queryAllSession(currUserId),
  getGroupIdBySessionId: (sid, cuid) => _getGroupIdBySessionId(sid, cuid),
  getUserIdBySessionId: (sid, cuid) => _getUserIdBySessionId(sid, cuid),
  updateSession: (param, notAdd, noticeType, currUserId)=>_updateSession(param, notAdd, noticeType, currUserId),
  querySessionById: (id, type) => _querySessionById(id, type),
  setBadgeZero: (sessionId) => _setBadgeZero(sessionId),
  updateInViteSession:(sessionId) => _updateInViteSession(sessionId),
  getSessionBadge:() => _getSessionBadge(),
}

let _deleteSession = function(sessionId) {
  _realm.write(() => {
    let session = _realm.objects(SESSION).filtered('sessionId = \'' + sessionId + '\'');
    _realm.delete(session);
  });
}

let _queryAllSession = function(currUserId) {
  let ret = [];
  _realm.objects(SESSION).sorted('lastTime',[true]).forEach((item)=>{
    if(currUserId == SessionIdSplit.getUserIdFromSessionId(item.sessionId)) {
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
    }
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

let _updateSession = function (param, notAdd, noticeType, currUserId){
  _realm.write(()=>{
    if (param.type == SESSION_TYPE.GROUP_NOTICE) {
      let d = _realm.objects(SESSION).filtered('type = \'' + SESSION_TYPE.GROUP_NOTICE + '\'');
      let groupSession = [];
      d.forEach((item) => {
        if (item && !_.isEmpty(item)) {
          let userId = SessionIdSplit.getUserIdFromSessionId(item.sessionId);
          if (currUserId == userId) {
            groupSession.push(item);
            let wd = _realm.objects(SESSION).filtered('sessionId = \'' + item.sessionId + '\'');
            _realm.delete(wd)
          }
        }
      });
      if (groupSession.length > 0) {
        if (noticeType == SESSION_TYPE.INVITE) {
          param.badge = groupSession[0].badge + 1;
        } else {
          param.badge = groupSession[0].badge + 100000;
        }
      } else {
        if (param.type == SESSION_TYPE.INVITE) {
          param.badge = 1;
        } else {
          param.badge = 100000;
        }
      }
    } else {
      let p = _realm.objects(SESSION).filtered("sessionId = '" + param.sessionId + "'");
      if(p.length > 0){
        if(p[0].lastTime > param.lastTime){
          return;
        }
        if(param.type == SESSION_TYPE.GROUP || param.type == SESSION_TYPE.USER){
          if(!notAdd){
            param.badge = p[0].badge + 1;
          }
        }
      }
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

let _getSessionBadge = function(){
  let result = _realm.objects(SESSION);
  let ret = 0;
  result.forEach((item)=>{
    if(item && item.badge){
      if(item.type == SESSION_TYPE.USER ||item.type == SESSION_TYPE.GROUP || item.type == SESSION_TYPE.PLATFORMINFO){
        ret += item.badge;
      }
    }
  });
  return ret;
}

module.exports = SessionPersisterFacade;
