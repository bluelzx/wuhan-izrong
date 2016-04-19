let ImAction = require('../action/imAction');
let { MSG_TYPE, SESSION_TYPE } = require('../../constants/dictIm');
let KeyGenerator = require('../../comp/utils/keyGenerator');

let Resolver = {

  deal: function (message) {
    switch (message.type) {
      case 'message':
        this._dealMessage(message.data);
    }
  },
  _dealMessage: function (message) {
    switch (message.msgType) {
      case MSG_TYPE.REC_P2P_MSG:
        ImAction.receive({
          sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.USER, message.fromUid),
          msgId: message.msgId,
          fromUId: message.fromUid,
          groupId: '',
          toId: '',
          type: SESSION_TYPE.USER,
          contentType: message.contentType,
          content: message.content,
          msgType: message.msgType,
          revTime: message.sendDate,
          isRead: false
        });
        break;
      default:
        console.log('None message type matched! [%s]', message.msgType);
    }
  }

};

module.exports = Resolver;
