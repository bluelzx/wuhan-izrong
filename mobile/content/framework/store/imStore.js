let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

let { MSG_TYPE, MSG_CONTENT_TYPE, SESSION_TYPE } = require('../../constants/dictIm');

let Persister = require('../persister/persisterFacade');
let SessionAction = require('../action/sessionAction');
let ContactStore = require('./contactStore');

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};
const {CHANGE_EVENT} = require('../../constants/dictIm');
//
//
//let testMessages = [
//  {
//    msgId: 'user:3:1261049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
//    content: 'Are you building a chat app?',
//    name: 'React-Native',
//    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
//    position: 'left',
//    date: new Date(2015, 10, 16, 19, 0)
//  },
//  {
//    msgId: 'user:3:1361049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
//    content: "Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger!",
//    name: 'Developer',
//    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
//    position: 'right',
//    date: new Date(2015, 10, 17, 19, 0)
//    // If needed, you can add others data (eg: userId, messageId)
//  },
//  {
//    msgId: 'user:3:1461049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
//    contentType: 'image',
//    content: 'http://192.168.64.169:9081/fas/app/pub/File/downLoad/571614d8961ace061a5c2099',
//    name: 'Developer',
//    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
//    position: 'right',
//    date: new Date(2015, 10, 18, 19, 0)
//  }
//];

let _data = {
  toId: '',
  sessionId: '',
  page: 1,
  userId: '',
  userPhotoFileUrl: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  messages: []
};

let ImStore = _.assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback, event = CHANGE_EVENT.CHANGE) {
    this.on(event, callback);
  },
  removeChangeListener: function (callback, event = CHANGE_EVENT.CHANGE) {
    this.removeListener(event, callback);
  },
  emitChange: function (event = CHANGE_EVENT.CHANGE, data = {}) {
    this.emit(event, data);
  },

  imInit: () => _imInit(),
  sessionInit: (data) => _sessionInit(data),
  getMessages: () => _data.messages,
  saveMsg: (message) => _saveMsg(message),
  ackMsg: (msgId, toUid) => _ackMsg(msgId, toUid),
  getEarlier: () => _getEarlier(),

});

// Private Functions
let _imInit = () => {

};

let _resovleMessages = (bInit = false) => {
  let savedMessages = Persister.getMessageBySessionId(_data.sessionId, _data.page);
  let tmpMessages = [];
  let tmpMessage = {};
  savedMessages.forEach((object, index, collection) => {
    if (object.fromUId) { // Received
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        name: object.fromUId,
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: object.revTime
      };
    } else { // Sent
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        name: _data.userId,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: object.revTime,
        status: object.status
      };
    }

    bInit ? null : tmpMessages.unshift(tmpMessage);
    _data.messages.unshift(tmpMessage);
  });

  if (bInit) {
    ImStore.emitChange();
  } else {
    return tmpMessages;
  }
};

let _sessionInit = (data) => {
  _data.toId = data.toId;
  _data.sessionId = data.sessionId;
  _data.page = 1;
  _data.messages = [];
  _resovleMessages(true);
  ImStore.emitChange();
};

let _saveMsg = (message) => {

  console.log(message);
  if(message.type == SESSION_TYPE.USER){
    let user = ContactStore.getUserInfoByUserId(message.toId || message.fromUId);
    SessionAction.updateSession(message.type, message.sessionId,user.realName,message.content,message.revTime,message.contentType);
  }else if(message.type == SESSION_TYPE.GROUP){
    let group = ContactStore.getGroupDetailById(message.groupId);
    SessionAction.updateSession(message.type, message.sessionId,group.groupName,message.content,message.revTime,message.contentType);
  }else if(message.type == SESSION_TYPE.INVITE){
    let group = ContactStore.getGroupDetailById(message.groupId);
    SessionAction.updateSession(message.type, message.sessionId,group.groupName,'群邀请',message.revTime,message.contentType, message.groupId);
    return ;
  }



  if (message.sessionId === _data.sessionId) {
    if (message.fromUId) { // Received
      // TODO. Get user info by id.
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: message.fromUId,
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: message.revTime
      });
    } else { // Send
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: _data.userId,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: message.revTime,
        status: message.status
      });
    }

    ImStore.emitChange();
  }

  Persister.saveMessage(message);
};

let _ackMsg = (msgId, toUid) => {
  if (_data.toId === toUid) {
    _data.messages.find((value, index, arr) => {
      if (value.msgId === msgId) {
        value.status = 'Seen';
        return true;
      }
      return false;
    });

    ImStore.emitChange();
  }

  // TODO. Update realm of the status for message.
  Persister.resetMessageStatus(msgId);
  // ImStore.emitChange(CHANGE_EVENT.UPDATE, message);
};

let _getEarlier = () => {
  _data.page++;
  return _resovleMessages(false);
  // ImStore.emitChange();
};

module.exports = ImStore;
