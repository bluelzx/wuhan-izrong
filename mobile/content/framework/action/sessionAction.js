/**
 * Created by baoyinghai on 4/20/16.
 */

let SessiontStore = require('../store/sessionStore');

/**
 * 增加和更新
 * @param sessionId  string
 * @param type       enum
 * @param optional   Object
 *
 *
 sessionId: {type: 'string', optional: true},
 type: {type: 'string', optional: true},
 badge:{type: 'int', optional: true},
 title: {type: 'string', optional: true},
 content:{type: 'string', optional: true},
 lastTime: {type: 'date', optional: true},
 contentType: {type: 'string', optional: true}
 */
let _updateSession = function (type, sessionId, title, content, lastTime, contentType, opts) {
  let  groupId = opts && opts.groupId;
  let notAdd = opts && opts.notAdd;
  let noticeType = opts && opts.noticeType;
  let param = {
    sessionId:sessionId,
    type: type,
    badge:0,
    title: title,
    content:content,
    lastTime: lastTime,
    contentType: contentType
  };
  if(!notAdd){
    param.badge = 1;
  }
  SessiontStore.updateSession(param, notAdd, noticeType);
}

/**
 * 删除会话
 * @param sessionId
 * */
let _deleteSession = function(sessionId) {
  SessiontStore.deleteSession(sessionId);
}

/**
 * 查询会话
 * */
let _queryAllSession = function(ownerId) {
  return SessiontStore.queryAllSession(ownerId);
}

let sessionAction = {
  updateSession:_updateSession,
  deleteSession:_deleteSession,
  queryAllSession:_queryAllSession
}

module.exports = sessionAction;
