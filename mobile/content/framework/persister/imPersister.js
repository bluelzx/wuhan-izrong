/**
 * Created by baoyinghai on 4/19/16.
 */
let _realm = require('./realmManager');
const DEFAULT_GROUP_IMAGE = "";
const _ = require('lodash');
const {
  MESSAGE,
} = require('./schemas');

let _saveMessage = (message, ownerId) => {
  _realm.write(() => {
    message.ownerId = ownerId;
    _realm.create(MESSAGE, message, true);
  });
};

let _getMessageBySessionId = (sessionId, page, ownerId) => {
  let msgs = _realm.objects(MESSAGE).filtered('sessionId == $0 && ownerId=' + ownerId, sessionId).sorted('revTime', true);

  let pageSize = 10;
  //if(page != 1){
  //  pageSize = 15;
  //}
  //return msgs;
  let start = (page - 1) * pageSize;
  let end = page * pageSize;
  return msgs.slice(start, end);
};

let _resetMessageStatus = (msgId, isMute) => {
  _realm.write(() => {
    _realm.create(MESSAGE, {
      msgId: msgId,
      status: isMute?'isMute':'Seen'
    }, true);
  });
};

let _modifyImgUrl = function(msg,url){
  _realm.write(()=>{
    _realm.create(MESSAGE,{msgId:msg, content:url},true);
  });
}

let _modifyMsgState = function(msgId, status){
  _realm.write(()=>{
    _realm.create(MESSAGE,{msgId:msgId, status:status},true);
  });
}

let _getMessageByMessageId = function(msgId) {
  let ret = _realm.objects(MESSAGE).filtered('msgId == $0',msgId);
  return ret[0];
}

let ImPersister = {
  saveMessage: (message, ownerId) => _saveMessage(message, ownerId),
  getMessageBySessionId: (sessionId, page, ownerId) => _getMessageBySessionId(sessionId, page, ownerId),
  resetMessageStatus: (msgId, isMute) => _resetMessageStatus(msgId, isMute),
  modifyImgUrl:(msgId, url)=>_modifyImgUrl(msgId,url),
  modifyMsgState:(msgId, status)=>_modifyMsgState(msgId, status),
  getMessageByMessageId:(msgId) => _getMessageByMessageId(msgId)
};

module.exports = ImPersister;
