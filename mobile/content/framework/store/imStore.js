let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

//let { MsgTypes } = require('../../constants/notification');

let AppStore = require('./appStore');
let Persister = require('../persister/persisterFacade');

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};
const {CHANGE_EVENT} = require('../../constants/dictIm');


let testMessages = [
  {
    msgId: 'user:3:1261049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
    content: 'Are you building a chat app?',
    name: 'React-Native',
    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    position: 'left',
    date: new Date(2015, 10, 16, 19, 0)
  },
  {
    msgId: 'user:3:1361049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
    content: "Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger!",
    name: 'Developer',
    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    position: 'right',
    date: new Date(2015, 10, 17, 19, 0)
    // If needed, you can add others data (eg: userId, messageId)
  },
  {
    msgId: 'user:3:1461049417501:0A6848BA-5E72-410B-A259-1DDA7E7F71C8',
    contentType: 'image',
    content: 'http://192.168.64.169:9081/fas/app/pub/File/downLoad/571614d8961ace061a5c2099',
    name: 'Developer',
    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    position: 'right',
    date: new Date(2015, 10, 18, 19, 0)
  }
];

let _data = {
  sessionId: '',
  toId: '',
  userId: AppStore.getUserId(),
  userPhotoFileUrl: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  messages: testMessages
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
  ackMsg: (msgId, toUid) => _ackMsg(msgId, toUid)
});

// Private Functions
let _imInit = () => {

};

let _sessionInit = (data) => {
  _data.sessionId = data.sessionId;
  _data.toId = data.toId;
};

let _saveMsg = (message) => {



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

    ImStore.emitChange(CHANGE_EVENT.CHANGE);
  }
};

let _ackMsg = (msgId, toUid) => {
  if (_data.toId === toUid) {
    _data.messages.find((value, index, arr) => {
      if (value.msgId === msgId) {
        value.status = 'Sent';
        return true;
      }
      return false;
    });

    ImStore.emitChange(CHANGE_EVENT.CHANGE);
  }

  // TODO. Update realm of the status for message.

  // ImStore.emitChange(CHANGE_EVENT.UPDATE, message);
};

module.exports = ImStore;
