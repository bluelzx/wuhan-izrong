/**
 * Created by baoyinghai on 4/19/16.
 */
let _realm = require('./realmManager');
const DEFAULT_GROUP_IMAGE = "";
const _ = require('lodash');
const {
  MESSAGE,
} = require('./schemas');

let _saveMessage = (message) => {
  _realm.write(() => {
    _realm.create(MESSAGE, message, true);
  });
};

let _getMessageBySessionId = (sessionId, page) => {
  let msgs = _realm.objects(MESSAGE).filtered('sessionId == $0', sessionId).sorted('revTime', true);
  // return msgs;
  let start = (page - 1) * 5;
  let end = page * 5;
  return msgs.slice(start, end);
};

let _resetMessageStatus = (msgId) => {
  _realm.write(() => {
    _realm.create(MESSAGE, {
      msgId: msgId,
      status: 'Seen'
    }, true);
  });
};

let ImPersister = {
  saveMessage: (message) => _saveMessage(message),
  getMessageBySessionId: (sessionId, page) => _getMessageBySessionId(sessionId, page),
  resetMessageStatus: (msgId) => _resetMessageStatus(msgId)
};

module.exports = ImPersister;
