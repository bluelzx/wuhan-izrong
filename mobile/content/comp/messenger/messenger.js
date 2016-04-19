'use strict';

let React = require('react-native');
let {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  View,
  Text
} = React;

let _ = require('lodash');
let GiftedMessenger = require('./giftedMessenger');
let {Communications, Device} = require('mx-artifacts');

let ImAction = require('../../framework/action/imAction');
let ImStore = require('../../framework/store/imStore');
let { MSG_CONTENT_TYPE, COMMAND_TYPE, SESSION_TYPE } = require('../../constants/dictIm');


// let _getMessageKey = (f, t) => {
//   // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
//   return f + ':' + t + ':' + new Date().getTime() + ':' + _device_id;
// };

let Messenger = React.createClass({

  getDefaultProps() {
    return {
      param: {
        sessionId: 'sessionId',
        chatType: SESSION_TYPE.USER,
        userId: ''
      },
    }
      ;
  },

  propTypes: {
    param: React.PropTypes.object,
  },

  _getStateFromStores: function () {
    return {
      messages: ImStore.getMessages(),
      // token: AppStore.getToken()
    };
  },

  getInitialState() {
    return _.assign(this._getStateFromStores(), {
      // messages: this.getMessages()
    });
  },

  handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server
    let msgToSend = {
      sessionId: this.props.param.sessionId,
      msgId: message.msgId,
      fromUId: null,
      contentType: MSG_CONTENT_TYPE.TEXT,
      content: message.text,
      msgType: {type: 'string', optional: true},
      revTime: null,
      isRead: true
    };
    if (this.props.param.chatType === SESSION_TYPE.USER) {
      msgToSend.data = {
        // toId: this.props.param.userId,
        toId: 'u002',
        type: SESSION_TYPE.USER,
        msgType: COMMAND_TYPE.SEND_P2P_MSG
      };
    } else if (this.props.param.chatType === SESSION_TYPE.GROUP) {
      msgToSend.data = {
        groupId: this.props.param.groupId,
        type: SESSION_TYPE.GROUP,
        msgType: COMMAND_TYPE.SEND_GROUP_MSG
      };
    }

    ImAction.send(msgToSend);

    // => In this case, you need also to set onErrorButtonPress
    // this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    // this._GiftedMessenger.setMessageStatus('ErrorButton', rowID);
  },

  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {
  }) {

    // Your logic here
    // Eg: Retrieve old messages from your server

    // newest messages have to be at the begining of the array
    let earlierMessages = [
      {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
        name: 'Developer',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'right',
        date: new Date(2014, 0, 1, 20, 0),
      }, {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
        name: 'React-Native',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2013, 0, 1, 12, 0),
      },
    ];

    setTimeout(() => {
      callback(earlierMessages, false); // when second parameter is true, the "Load earlier messages" button will be hidden
    }, 1000);
  },

  handleReceive(message = {}) {
    // this._GiftedMessenger.appendMessage(message);
    let tmpMessages = this.state.messages.concat(message);
    this.setState({
      messages: tmpMessages
    });
  },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server
    this.handleSend(message, rowID);

    setTimeout(() => {
      // will set the message to a custom status 'Sent' (you can replace 'Sent' by what you want - it will be displayed under the row)
      this._GiftedMessenger.setMessageStatus('Sent', rowID);
      setTimeout(() => {
        // will set the message to a custom status 'Seen' (you can replace 'Seen' by what you want - it will be displayed under the row)
        this._GiftedMessenger.setMessageStatus('Seen', rowID);
        setTimeout(() => {
          // append an answer
          this.handleReceive({
            text: 'I saw your message',
            name: 'React-Native',
            image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
            position: 'left',
            date: new Date()
          });
        }, 500);
      }, 1000);
    }, 500);
  },

  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
  },

  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

        displayNames={false}
        displayNamesInsideBubble={false}

        autoFocus={false}
        messages={this.state.messages}
        handleSend={this.handleSend}
        onErrorButtonPress={this.onErrorButtonPress}
        maxHeight={Device.height - Device.navBarHeight}
        loadEarlierMessagesButton={true}
        onLoadEarlierMessages={this.onLoadEarlierMessages}

        senderName='Developer'
        senderImage={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
        onImagePress={this.onImagePress}
        //displayNames={true}
        forceRenderImage={true}
        renderStatus={false}

        parseText={true} // enable handlePhonePress and handleUrlPress
        handlePhonePress={this.handlePhonePress}
        handleUrlPress={this.handleUrlPress}
        handleEmailPress={this.handleEmailPress}

        inverted={true}

        sessionId={this.props.param.sessionId}
      />

    );
  },

  handleUrlPress(url) {
    if (Platform.OS !== 'android') {
      LinkingIOS.openURL(url);
    }
  },

  handlePhonePress(phone) {
    if (Platform.OS !== 'android') {
      let BUTTONS = [
        'Text message',
        'Call',
        'Cancel',
      ];
      let CANCEL_INDEX = 2;

      ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Communications.phonecall(phone, true);
              break;
            case 1:
              Communications.text(phone);
              break;
          }
        });
    }
  },

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  },
});

module.exports = Messenger;
