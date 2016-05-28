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
  // return msgs;
  let start = (page - 1) * 5;
  let end = page * 5;
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

let ImPersister = {
  saveMessage: (message, ownerId) => _saveMessage(message, ownerId),
  getMessageBySessionId: (sessionId, page, ownerId) => _getMessageBySessionId(sessionId, page, ownerId),
  resetMessageStatus: (msgId, isMute) => _resetMessageStatus(msgId, isMute),
  modifyImgUrl:(msgId, url)=>_modifyImgUrl(msgId,url)
};

module.exports = ImPersister;
