let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

//let { MsgTypes } = require('../../constants/notification');

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
    text: 'Are you building a chat app?',
    name: 'React-Native',
    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    position: 'left',
    date: new Date(2015, 10, 16, 19, 0)
  },
  {
    text: "Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger!",
    name: 'Developer',
    image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    position: 'right',
    date: new Date(2015, 10, 17, 19, 0)
    // If needed, you can add others data (eg: userId, messageId)
  },
];

let _data = {
  sessionId: '',
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
  getMessages: () => _data.messages,
  saveMsg: (message) => _saveMsg(message),
  ackMsg: (msgId, toUid) => _ackMsg(msgId, toUid)
});

// Private Functions
let _imInit = () => {

};

let _saveMsg = (message) => {

  if (message.sessionId === _data.sessionId) {
    _data.messages.push(message.data);
    ImStore.emitChange(CHANGE_EVENT.CHANGE);
  }
};

let _ackMsg = (msgId, toUid) => {

  ImStore.emitChange(CHANGE_EVENT.UPDATE, message);
};

module.exports = ImStore;
