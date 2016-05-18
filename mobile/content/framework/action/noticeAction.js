/**
 * Created by baoyinghai on 4/20/16.
 */

let NoticeStore = require('../store/noticeStore');

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
let _updateNotice = function (type, noticeId,groupName, lastTime, title, content, groupId, ownerId) {
  let param = {
    noticeId:noticeId,
    title: title,
    content:content,
    groupName: groupName,
    groupId:groupId,
    groupOwnerId: ownerId,
    revTime: lastTime,
    msgType: type,
    isInvited: false
  };
  NoticeStore.updateNotice(param);
}

/**
 * 删除会话
 * @param sessionId
 * */
let _deleteSession = function(sessionId) {
  //SessionStore.deleteSession(sessionId);
}

/**
 * 查询会话
 * */
let _queryAllSession = function(ownerId) {
  //return SessionStore.queryAllSession(ownerId);
}

let noticeAction = {
  updateNotice:_updateNotice,
  deleteSession:_deleteSession,
  queryAllSession:_queryAllSession
}

module.exports = noticeAction;
