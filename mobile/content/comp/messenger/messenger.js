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
let ReverseGiftedMessenger = require('./reverseGiftedMessenger');
let { Alert, Communications, Device } = require('mx-artifacts');

let ImAction = require('../../framework/action/imAction');
let ImStore = require('../../framework/store/imStore');
let { MSG_CONTENT_TYPE, COMMAND_TYPE, SESSION_TYPE } = require('../../constants/dictIm');
let { IM_SESSION } = require('../../constants/dictEvent');
let KeyGenerator = require('../../comp/utils/keyGenerator');

let Messenger = React.createClass({

  getDefaultProps() {
    return {
      param: {
        sessionId: 'sessionId',
        chatType: SESSION_TYPE.USER,
        userId: ''
      }
    };
  },

  propTypes: {
    param: React.PropTypes.object,
  },

  _getStateFromStores() {
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

  componentDidMount() {
    ImStore.addChangeListener(this._onChange, IM_SESSION);
    //if (this.props.param.isFromBizDetail) {
    //  this._sendMessage(MSG_CONTENT_TYPE.BIZINFO, this.props.param.content);
    //}
  },

  componentWillUnmount() {
    ImStore.removeChangeListener(this._onChange, IM_SESSION);
  },

  _onChange() {
    this.setState(this._getStateFromStores());
  },

  _sendMessage(contentType, content, isReSend = false, msgId = '', isNotSend, localUri) {
    if (this.props.param.chatType === SESSION_TYPE.GROUP && !ImAction.isInGroupById(this.props.param.groupId, this.props.param.myId)) {
      //TODO: 用户已不在群组....
      Alert('您已不在该群组');
    } else {
      let msgToSend = {
        sessionId: this.props.param.sessionId,
        msgId: isReSend ? msgId : KeyGenerator.getMessageKey(this.props.param.sessionId, this.props.param.myId),
        fromUId: null,
        contentType: contentType,
        content: content,
        revTime: new Date(),
        isRead: true,
        status: 'Sending',//'ErrorButton',
        //status: 'isMute',
        localUri:localUri
      };
      if (this.props.param.chatType === SESSION_TYPE.USER) {
        _.assign(msgToSend, {
          // toId: this.props.param.userId,
          toId: this.props.param.userId,
          groupId: null,
          type: SESSION_TYPE.USER,
          msgType: COMMAND_TYPE.SEND_P2P_MSG
        });
      } else if (this.props.param.chatType === SESSION_TYPE.GROUP) {
        _.assign(msgToSend, {
          toId: null,
          groupId: this.props.param.groupId,
          type: SESSION_TYPE.GROUP,
          msgType: COMMAND_TYPE.SEND_GROUP_MSG
        });
      }

      ImAction.send(msgToSend, isReSend, this.props.param.myId, isNotSend);
      return msgToSend.msgId;
    }
  },

  handleSend(message = {}, rowID = null) {
    this._sendMessage(MSG_CONTENT_TYPE.TEXT, message.content);
    // => In this case, you need also to set onErrorButtonPress
    // this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    // this._GiftedMessenger.setMessageStatus('ErrorButton', rowID);
  },

  handleNameCard(message = {}, rowID = null) {
    this._sendMessage(MSG_CONTENT_TYPE.NAMECARD, message.content);
  },

  handleBizInfo(message = {}, rowID = null){
    this._sendMessage(MSG_CONTENT_TYPE.BIZINFO, message.content);
  },

  handleSendImage(uri) {
    let p = new Promise((resolve,reject)=>{
      resolve( this._sendMessage(MSG_CONTENT_TYPE.IMAGE, '' , false, '', true, uri))
    }).catch((err)=>{
      throw err;
    });

    let self = this;
    p.then((msgId)=>{
      ImAction.uploadImage(uri).then((response)=>{
        ImStore.modifyImgUrl(msgId,response.fileUrl)
        self._sendMessage(MSG_CONTENT_TYPE.IMAGE, response.fileUrl, true,msgId,false, uri);
      });
    }).catch((err)=>{
      Alert('图片上传失败');
    });

    //ImAction.uploadImage(uri)
    //  .then((response) => {
    //    this._sendMessage(MSG_CONTENT_TYPE.IMAGE, response.fileUrl);
    //  }).catch((errorData) => {
    //    console.log('Image upload error ' + JSON.stringify(errorData));
    //    Alert('图片上传失败');
    //  });
  },

  handleImageError(error) {
    console.log('Image select error ' + JSON.stringify(error));
    Alert('图片选择失败');
  },



  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {
  }) {

    // Your logic here
    // Eg: Retrieve old messages from your server
    let earlierMessages = ImStore.getEarlier();

    // newest messages have to be at the begining of the array
    // let earlierMessages = [
    //   {
    //     content: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
    //     name: 'Developer',
    //     image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    //     position: 'right',
    //     date: new Date(2014, 0, 1, 20, 0),
    //   }, {
    //     content: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
    //     name: 'React-Native',
    //     image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    //     position: 'left',
    //     date: new Date(2013, 0, 1, 12, 0),
    //   },
    // ];

    setTimeout(() => {
      callback(earlierMessages, true);
      //callback(earlierMessages, earlierMessages.length < 10 ? true : false); // when second parameter is true, the "Load earlier messages" button will be hidden
      //callback(earlierMessages, false);
    }, 1000);
  },

  // handleReceive(message = {}) {
  //   // this._GiftedMessenger.appendMessage(message);
  //   let tmpMessages = this.state.messages.concat(message);
  //   this.setState({
  //     messages: tmpMessages
  //   });
  // },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server
    // this.handleSend(message, rowID, true);
    this._sendMessage(MSG_CONTENT_TYPE.TEXT, message.content, true, message.msgId);
    // ImAction.send(message, true);

    // setTimeout(() => {
    //   // will set the message to a custom status 'Sent' (you can replace 'Sent' by what you want - it will be displayed under the row)
    //   this._GiftedMessenger.setMessageStatus('Sent', rowID);
    //   setTimeout(() => {
    //     // will set the message to a custom status 'Seen' (you can replace 'Seen' by what you want - it will be displayed under the row)
    //     this._GiftedMessenger.setMessageStatus('Seen', rowID);
    //     setTimeout(() => {
    //       // append an answer
    //       this.handleReceive({
    //         content: 'I saw your message',
    //         name: 'React-Native',
    //         image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
    //         position: 'left',
    //         date: new Date()
    //       });
    //     }, 500);
    //   }, 1000);
    // }, 500);
  },

  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
  },

  render() {

    if(this.state.messages.length < 10) {
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
          navigator={this.props.navigator}
          autoFocus={false}
          messages={this.state.messages}
          handleSend={this.handleSend}
          handleNameCard={this.handleNameCard}
          handleBizInfo={this.handleBizInfo}
          handleSendImage={this.handleSendImage}
          handleImageError={this.handleImageError}
          onErrorButtonPress={this.onErrorButtonPress}
          maxHeight={Device.height - Device.navBarHeight}
          loadEarlierMessagesButton={false}
          onLoadEarlierMessages={this.onLoadEarlierMessages}
          loadMessagesLater={false}
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
          chatInfo={this.props.param}
          sessionId={this.props.param.sessionId}
        />

      );
    }else{
      return (
        <ReverseGiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

          displayNames={false}
          displayNamesInsideBubble={false}
          navigator={this.props.navigator}
          autoFocus={false}
          messages={this.state.messages}
          handleSend={this.handleSend}
          handleNameCard={this.handleNameCard}
          handleBizInfo={this.handleBizInfo}
          handleSendImage={this.handleSendImage}
          handleImageError={this.handleImageError}
          onErrorButtonPress={this.onErrorButtonPress}
          maxHeight={Device.height - Device.navBarHeight}
          loadEarlierMessagesButton={true}
          onLoadEarlierMessages={this.onLoadEarlierMessages}
          loadMessagesLater={true}
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
          chatInfo={this.props.param}
          sessionId={this.props.param.sessionId}
        />

      );
    }
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
