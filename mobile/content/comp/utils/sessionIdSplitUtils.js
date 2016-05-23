/**
 * Created by amarsoft on 16/5/18.
 */
'use strict';

let _getUserIdFromSessionId = (sessionId) => {
  let arr = sessionId.split(':');
  return parseInt(arr[2]);
};

let _getIdFromSessionId = (sessionId) => {
  let arr = sessionId.split(':');
  return parseInt(arr[1]);
}

let SessionSplit = {
  getUserIdFromSessionId: (sessionId) => _getUserIdFromSessionId(sessionId),
  getIdFromSessionId: (sessionId) => _getIdFromSessionId(sessionId)
};

module.exports = SessionSplit;
