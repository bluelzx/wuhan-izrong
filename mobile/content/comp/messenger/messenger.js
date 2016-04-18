'use strict';

let React = require('react-native');
let {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  View,
  Text
  } = React;

let GiftedMessenger = require('./giftedMessenger');
let { Communications, Device } = require('mx-artifacts');

let ImSocket = require('../../framework/network/imSocket');
let { MSG_CONTENT_TYPE, COMMAND_TYPE } = require('../../constants/dictIm');

let Messenger = React.createClass({

  getDefaultProps() {
    return {
      sessionId: 'sessionId',
      toUid: 'u002',
    };
  },

  propTypes: {
    sessionId: React.PropTypes.string,
    toUid: React.PropTypes.string
  },

  getMessages() {
    return [
      {text: 'Are you building a chat app?', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)},
      {
        text: "Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger! Yes, and I use Gifted Messenger!",
        name: 'Developer',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'right',
        date: new Date(2015, 10, 17, 19, 0)
        // If needed, you can add others data (eg: userId, messageId)
      },
    ];
  },

  handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server
    let msgToSend = {
      toUid: this.props.toUid,
      contentType: MSG_CONTENT_TYPE.TEXT,
      content: message.text,
      msgId: 'uuid',
      command: COMMAND_TYPE.SEND_P2P_MSG
    };

    ImSocket.send(msgToSend)
      .then(() => {
        // this._GiftedMessenger.setMessageStatus('Seen', rowID);
        // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
        this._GiftedMessenger.setMessageStatus('Sent', rowID);
      }).catch((error) => {
        // => In this case, you need also to set onErrorButtonPress
        this._GiftedMessenger.setMessageStatus('ErrorButton', rowID);
      });
  },

  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {}) {

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
    this._GiftedMessenger.appendMessage(message);
  },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server

    setTimeout(() => {
      // will set the message to a custom status 'Sent' (you can replace 'Sent' by what you want - it will be displayed under the row)
      this._GiftedMessenger.setMessageStatus('Sent', rowID);
      setTimeout(() => {
        // will set the message to a custom status 'Seen' (you can replace 'Seen' by what you want - it will be displayed under the row)
        this._GiftedMessenger.setMessageStatus('Seen', rowID);
        setTimeout(() => {
          // append an answer
          this.handleReceive({text: 'I saw your message', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date()});
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
        messages={this.getMessages()}
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
