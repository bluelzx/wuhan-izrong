'use strict';

let React = require('react-native');
let {
  Text,
  View,
  ListView,
  TextInput,
  Dimensions,
  Animated,
  LayoutAnimation,
  Image,
  TouchableHighlight,
  Platform,
  PixelRatio,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter
  } = React;

let dismissKeyboard = require('react-native-dismiss-keyboard');
let moment = require('moment');
let Icon = require('react-native-vector-icons/Ionicons');
let TimerMixin = require('react-timer-mixin');
let Publish = require('../../biz/publish/publish');

let { Spinner, Button } = require('mx-artifacts');

let AutoExpandingTextInput = require('./autoExpandingTextInput');
//let Message = require('./Message');
import Message from './message';

let DictIcon = require('../../constants/dictIcon');

let ImagePicker = require('../utils/imagePicker');

let UserInfoAction = require('../../framework/action/userInfoAction');
//let BizAction  = require('');

let GiftedMessenger = React.createClass({
  mixins: [TimerMixin],

  firstDisplay: true,
  listHeight: 0,
  footerY: 0,
  inputHeight: 0,

  getDefaultProps() {
    return {
      displayNames: true,
      displayNamesInsideBubble: false,
      placeholder: '',
      styles: {},
      autoFocus: true,
      onErrorButtonPress: (message, rowID) => {},
      loadEarlierMessagesButton: false,
      loadEarlierMessagesButtonText: '加载历史消息',
      onLoadEarlierMessages: (oldestMessage, callback) => {},
      parseText: false,
      handleUrlPress: (url) => {},
      handlePhonePress: (phone) => {},
      handleEmailPress: (email) => {},
      initialMessages: [],
      messages: [],
      handleSend: (message, rowID) => {},
      handleSendImage: (uri) => {},
      handleImageError: (error) => {},
      maxHeight: Dimensions.get('window').height,
      senderName: 'Sender',
      senderImage: null,
      sendButtonText: '发送',
      onImagePress: null,
      onMessageLongPress: null,
      hideTextInput: false,
      //keyboardDismissMode: 'on-drag',
      keyboardDismissMode: 'interactive',
      keyboardShouldPersistTaps: false,
      submitOnReturn: false,
      forceRenderImage: false,
      renderStatus: false,
      onChangeText: (text) => {},
      autoScroll: false,
      defaultTextInputHeight: 60,
      maxTextInputHeight: 100,
      panelHeight: 120,
    };
  },

  propTypes: {
    displayNames: React.PropTypes.bool,
    displayNamesInsideBubble: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    styles: React.PropTypes.object,
    autoFocus: React.PropTypes.bool,
    onErrorButtonPress: React.PropTypes.func,
    loadMessagesLater: React.PropTypes.bool,
    loadEarlierMessagesButton: React.PropTypes.bool,
    loadEarlierMessagesButtonText: React.PropTypes.string,
    onLoadEarlierMessages: React.PropTypes.func,
    parseText: React.PropTypes.bool,
    handleUrlPress: React.PropTypes.func,
    handlePhonePress: React.PropTypes.func,
    handleEmailPress: React.PropTypes.func,
    initialMessages: React.PropTypes.array,
    messages: React.PropTypes.array,
    handleSend: React.PropTypes.func,
    handleSendImage: React.PropTypes.func,
    handleImageError: React.PropTypes.func,
    onCustomSend: React.PropTypes.func,
    renderCustomText: React.PropTypes.func,
    maxHeight: React.PropTypes.number,
    senderName: React.PropTypes.string,
    senderImage: React.PropTypes.object,
    sendButtonText: React.PropTypes.string,
    onImagePress: React.PropTypes.func,
    onMessageLongPress: React.PropTypes.func,
    hideTextInput: React.PropTypes.bool,
    keyboardDismissMode: React.PropTypes.string,
    keyboardShouldPersistTaps: React.PropTypes.bool,
    forceRenderImage: React.PropTypes.bool,
    renderStatus: React.PropTypes.bool,
    onChangeText: React.PropTypes.func,
    autoScroll: React.PropTypes.bool,
    defaultTextInputHeight: React.PropTypes.number,
    maxTextInputHeight: React.PropTypes.number,
    panelHeight: React.PropTypes.number,
  },

  getInitialState: function() {
    this._data = [];
    this._rowIds = [];

    if (this.props.hideTextInput === false) {
      //if (this.props.styles.hasOwnProperty('textInputContainer')) {
      //  textInputHeight = this.props.styles.textInputContainer.height || textInputHeight;
      //}
    }

    this.inputHeight = this.props.defaultTextInputHeight;
    this.listViewMaxHeight = this.props.maxHeight - this.inputHeight;
    //this.listViewMaxHeight = this.props.maxHeight - this.props.textInputHeight - this.props.panelHeight;

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      if (typeof r1.status !== 'undefined') {
        return true;
      }
      return r1 !== r2;
    }});
    return {
      dataSource: ds.cloneWithRows([]),
      text: '',
      textInputHeight: new Animated.Value(this.inputHeight),
      disabled: true,
      height: new Animated.Value(this.listViewMaxHeight),
      isLoadingEarlierMessages: false,
      allLoaded: false,
      appearAnim: new Animated.Value(0),
      showPanel: false,
      isRefreshing: false
    };
  },

  getMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID)]];
      }
    }
    return null;
  },

  getPreviousMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID - 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]];
      }
    }
    return null;
  },

  getNextMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID + 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]];
      }
    }
    return null;
  },

  renderDate(rowData = {}, rowID = null) {
    let diffMessage = null;
    if (rowData.isOld === true) {
      diffMessage = this.getPreviousMessage(rowID);
    } else {
      diffMessage = this.getNextMessage(rowID);
    }
    if (rowData.date instanceof Date) {
      if (diffMessage === null) {
        return (
          <Text style={[this.styles.date]}>
            {moment(rowData.date).calendar()}
          </Text>
        );
      } else if (diffMessage.date instanceof Date) {
        let diff = moment(rowData.date).diff(moment(diffMessage.date), 'minutes');
        if (diff > 5) {
          return (
            <Text style={[this.styles.date]}>
              {moment(rowData.date).calendar()}
            </Text>
          );
        }
      }
    }
    return <View></View>;
  },

  renderRow(rowData = {}, sectionID = null, rowID = null) {

    let diffMessage = null;
    if (rowData.isOld === true) {
      diffMessage = this.getPreviousMessage(rowID);
    } else {
      diffMessage = this.getNextMessage(rowID);
    }

    return (
      <View>
        {this.renderDate(rowData, rowID)}
        <Message
          chatInfo={this.props.chatInfo}
          rowData={rowData}
          rowID={rowID}
          onErrorButtonPress={this.props.onErrorButtonPress}
          displayNames={this.props.displayNames}
          displayNamesInsideBubble={this.props.displayNamesInsideBubble}
          diffMessage={diffMessage}
          position={rowData.position}
          forceRenderImage={this.props.forceRenderImage}
          renderStatus={this.props.renderStatus}
          onImagePress={this.props.onImagePress}
          onMessageLongPress={this.props.onMessageLongPress}
          renderCustomText={this.props.renderCustomText}

          styles={this.styles}
        />
      </View>
    )
  },

  onChangeText(text) {
    this.setState({
      text: text
    })
    if (text.trim().length > 0) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }

    this.props.onChangeText(text);
  },

  componentDidMount() {
    //LayoutAnimation.spring();

    this.scrollResponder = this.refs.listView.getScrollResponder();

    if (this.props.messages.length > 0) {
      this.appendMessages(this.props.messages);
    } else if (this.props.initialMessages.length > 0) {
      this.appendMessages(this.props.initialMessages);
    } else {
      // Set allLoaded, unless props.loadMessagesLater is set
      if (!this.props.loadMessagesLater) {
        this.setState({
          allLoaded: true
        });
      }
    }

    if (Platform.OS === 'android') {
      this._listeners = [
        DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardDidShow),
        DeviceEventEmitter.addListener('keyboardDidHide', this.onKeyboardDidHide)
      ];
    } else {
      this._listeners = [
        DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardWillShow),
        DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardWillHide)
      ];
    }
  },

  componentWillUnmount() {
    this._listeners.forEach((/** EmitterSubscription */listener) => {
      listener.remove();
    });
  },

  componentWillReceiveProps(nextProps) {
    if (this._data.length !== this.props.messages.length) {
      this.setTimeout(() => {
        // inspired by http://stackoverflow.com/a/34838513/1385109
        this.scrollToBottom();
      }, (Platform.OS === 'android' ? 500 : 400));
    }

    this._data = [];
    this._rowIds = [];
    this.appendMessages(nextProps.messages);

    //let textInputHeight = 44;
    //if (nextProps.styles.hasOwnProperty('textInputContainer')) {
    //  textInputHeight = nextProps.styles.textInputContainer.height || textInputHeight;
    //}

    if (nextProps.maxHeight !== this.props.maxHeight) {
      this.listViewMaxHeight = nextProps.maxHeight;
    }

    if (nextProps.hideTextInput && !this.props.hideTextInput) {
      //this.listViewMaxHeight += this.props.defaultTextInputHeight;
      this.listViewMaxHeight += this.inputHeight;

      this.setState({
        height: new Animated.Value(this.listViewMaxHeight),
      });
    } else if (!nextProps.hideTextInput && this.props.hideTextInput) {
      //this.listViewMaxHeight -= this.props.defaultTextInputHeight;
      this.listViewMaxHeight -= this.inputHeight;

      this.setState({
        height: new Animated.Value(this.listViewMaxHeight),
      });
    }
  },

  onKeyboardWillHide(e) {
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight,
      duration: 150,
    }).start();
  },

  onKeyboardWillShow(e) {
    this._hidePanel();
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight - (e.endCoordinates ? e.endCoordinates.height : e.end.height),
      duration: 200,
    }).start();
  },

  onKeyboardDidShow(e) {
    if(Platform.OS === 'android') {
      this.onKeyboardWillShow(e);
    }
    this.scrollToBottom();
  },

  onKeyboardDidHide(e) {
    if(Platform.OS === 'android') {
      this.onKeyboardWillHide(e);
    }
  },

  scrollToBottom() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      let scrollDistance = this.listHeight - this.footerY;
      this.scrollResponder.scrollTo({
        y: -scrollDistance,
        x: 0,
        animated: false
      });
    }
  },

  onSend() {
    let message = {
      content: this.state.text.trim(),
      name: this.props.senderName,
      image: this.props.senderImage,
      position: 'right',
      date: new Date()
    };
    if (this.props.onCustomSend) {
      this.props.onCustomSend(message);
    } else {
      let rowID = this.appendMessage(message, true);
      this.props.handleSend(message, rowID);
      this.onChangeText('');
    }

    this._resetTextInput();
  },

  handleBizInfo() {
    let param = Object.assign({
      callBack:(item)=>{
        console.log('handleBizInfo callBack');
        let message = {
          content: JSON.stringify(item),
          name: this.props.senderName,
          image: this.props.senderImage,
          position: 'right',
          date: new Date()
        };
        if (this.props.onCustomSend) {
          this.props.onCustomSend(message);
        } else {
          let rowID = this.appendMessage(message, true);
          this.props.handleBizInfo(message, rowID);
        }
      }, isFromIM: true,
    },this.props.chatInfo);

    this.props.navigator.push({
      comp:Publish,
      param:param
    });

  },


  handleNameCard() {
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgId);
    let p  = {photoFileUrl: userInfo.photoFileUrl,
      realName: userInfo.realName,
      userId: userInfo.userId,
      mobileNumber: userInfo.mobileNumber,
      publicMobile: userInfo.publicMobile,
      phoneNumber: userInfo.phoneNumber,
      publicPhone: userInfo.publicPhone,
      qqNo: userInfo.qqNo,
      publicQQ: userInfo.publicQQ,
      weChatNo: userInfo.weChatNo,
      publicWeChat: userInfo.publicWeChat,
      email: userInfo.email,
      publicEmail: userInfo.publicEmail,
      orgBeanName: orgBean.orgValue,
      department: userInfo.department,
      publicDepart: userInfo.publicDepart,
      jobTitle: userInfo.jobTitle,
      publicTitle: userInfo.publicTitle,
      address: userInfo.address,
      publicAddress: userInfo.publicAddress,
      nameCardFileUrl: userInfo.nameCardFileUrl
    };
    let message = {
      content: JSON.stringify(p),
      name: this.props.senderName,
      image: this.props.senderImage,
      position: 'right',
      date: new Date()
    };
    if (this.props.onCustomSend) {
      this.props.onCustomSend(message);
    } else {
      let rowID = this.appendMessage(message, true);
      this.props.handleNameCard(message, rowID);
     // this.onChangeText('');
    }

   // this._resetTextInput();
  },

  postLoadEarlierMessages(messages = [], allLoaded = false) {
    this.prependMessages(messages);
    this.setState({
      isLoadingEarlierMessages: false
    });
    if (allLoaded === true) {
      this.setState({
        allLoaded: true,
      });
    }
  },

  preLoadEarlierMessages() {
    this.setState({
      isLoadingEarlierMessages: true
    });
    this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this.postLoadEarlierMessages);
  },

  renderLoadEarlierMessages() {
    if (this.props.loadEarlierMessagesButton === true) {
      if (this.state.allLoaded === false) {
        if (this.state.isLoadingEarlierMessages === true) {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Spinner />
            </View>
          );
        } else {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Button
                containerStyle={{
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  paddingHorizontal: 12,
                  height: 47,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                style={this.styles.loadEarlierMessagesButton}
                onPress={() => {this.preLoadEarlierMessages()}}
              >
                {this.props.loadEarlierMessagesButtonText}
              </Button>
            </View>
          );
        }
      }
    }
    return <View></View>;
  },


  _postLoadEarlierMessages(messages = [], allLoaded = false) {
    this.prependMessages(messages);
    this.setState({
      isRefreshing: false
    });
    if (allLoaded === true) {
      this.setState({
        allLoaded: true,
      });
    }
  },

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this._postLoadEarlierMessages);
  },

  prependMessages(messages = []) {
    let rowID = null;
    for (let i = 0; i < messages.length; i++) {
      this._data.push(messages[i]);
      this._rowIds.unshift(this._data.length - 1);
      rowID = this._data.length - 1;
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
    return rowID;
  },

  prependMessage(message = {}) {
    let rowID = this.prependMessages([message]);
    return rowID;
  },

  appendMessages(messages = []) {
    let rowID = null;
    for (let i = 0; i < messages.length; i++) {
      messages[i].isOld = true;
      this._data.push(messages[i]);
      this._rowIds.push(this._data.length - 1);
      rowID = this._data.length - 1;
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });

    return rowID;
  },

  appendMessage(message = {}, scrollToBottom = true) {
    // let rowID = this.appendMessages([message]);
    let rowID = this._data.length;

    if (scrollToBottom === true) {
      this.setTimeout(() => {
        // inspired by http://stackoverflow.com/a/34838513/1385109
        this.scrollToBottom();
      }, (Platform.OS === 'android' ? 200 : 100));
    }

    return rowID;
  },

  refreshRows() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
  },

  setMessageStatus(status = '', rowID) {
    if (status === 'ErrorButton') {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = 'ErrorButton';
        this.refreshRows();
      }
    } else {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = status;

        // only 1 message can have a status
        for (let i = 0; i < this._data.length; i++) {
          if (i !== rowID && this._data[i].status !== 'ErrorButton') {
            this._data[i].status = '';
          }
        }
        this.refreshRows();
      }
    }
  },

  _onAccessibilityTap() {
    //console.log('onAccessibilityTap');
    this._hidePanel();
  },

  renderAnimatedView() {
    return (
      <Animated.View
        style={{
          height: this.state.height,
        }}
      >
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}

          //accessible={true}
          //onAccessibilityTap={this._onAccessibilityTap}
          onResponderMove={this._onAccessibilityTap}

          //refreshControl={
          //  <RefreshControl
          //    refreshing={this.state.isRefreshing}
          //    onRefresh={this._onRefresh}
          //    tintColor="#ff0000"
          //    title="Loading..."
          //    colors={['#ff0000', '#00ff00', '#0000ff']}
          //    progressBackgroundColor="#ffff00"
          //  />
          //}

          renderHeader={this.renderLoadEarlierMessages}
          onLayout={(event) => {
            let layout = event.nativeEvent.layout;
            this.listHeight = layout.height;
            this.scrollToBottom();
            //if (this.firstDisplay === true) {
            //  requestAnimationFrame(() => {
            //    this.firstDisplay = false;
            //    this.scrollToBottom();
            //  });
            //}

          }}
          renderFooter={() => {
            return (
              <View
                onLayout={(event) => {
                  let layout = event.nativeEvent.layout;
                  this.footerY = layout.y;

                  if (this.props.autoScroll) {
                    this.scrollToBottom();
                  }
                }}
              ></View>
            );
          }}

          style={this.styles.listView}
          enableEmptySections={true}

          keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
          keyboardDismissMode={this.props.keyboardDismissMode}

          initialListSize={10}
          pageSize={this.props.messages.length}

          {...this.props}
        />

      </Animated.View>
    );
  },

  _animateTextInput(variation) {
    this.inputHeight += variation;
    Animated.timing(this.state.textInputHeight, {
      toValue: this.inputHeight,
      duration: 150,
    }).start();

    this.listHeight -= variation;
    Animated.timing(this.state.height, {
      toValue: this.listHeight,
      duration: 150,
    }).start();
  },

  _resetTextInput() {
    if (this.inputHeight !== this.props.defaultTextInputHeight) {
      this._animateTextInput(this.props.defaultTextInputHeight - this.inputHeight);
    }
  },

  _onChangeHeight(before, after) {
    console.log('before: ' + before + ' after: ' + after);
    this._animateTextInput(after - before);
  },

  _renderIcon() {
    if (this.state.disabled) {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          onPress={this._handleMore}
        >
          <Image
            style={{
              width: 36,
              height: 36
            }}
            source={DictIcon.imMore}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          containerStyle={{
            justifyContent: 'center',
            borderRadius: 6,
            backgroundColor: '#0f60b1',
            paddingHorizontal: 10,
            height: this.props.defaultTextInputHeight - 20,
          }}
          style={{
            fontSize: 15,
            letterSpacing: 1
          }}
          styleDisabled={this.styles.sendButtonDisabled}
          onPress={this.onSend}
          disabled={this.state.disabled}
        >
          {this.props.sendButtonText}
        </Button>
      </View>

    );
  },

  renderTextInput() {
    if (this.props.hideTextInput === false) {
      return (
        <Animated.View style={{height: this.state.textInputHeight}}>
          <View
            style={{
              flex: 1,
              borderTopWidth: 3 / PixelRatio.get(),
              borderBottomWidth: 3 / PixelRatio.get(),
              borderColor: '#0f263d',
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingTop: 8,
              backgroundColor: '#153757',
            }}
          >
            <AutoExpandingTextInput
              minHeight={this.props.defaultTextInputHeight - 20}
              maxHeight={this.props.maxTextInputHeight}
              onChangeHeight={this._onChangeHeight}

              style={{
                //alignSelf: 'flex-end',
                flex: 4,
                padding: 0,
                fontSize: 15,
                marginLeft: 10,
                marginRight: 0,
                //marginVertical: 10,
                borderRadius: 6,
                backgroundColor: '#0a1926',
                color: 'white',
              }}
              placeholder={this.props.placeholder}
              ref='autoExpandingTextInput'
              onChangeText={this.onChangeText}
              value={this.state.text}
              autoFocus={this.props.autoFocus}
              returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
              onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}
              enablesReturnKeyAutomatically={true}
              multiline={true}
              blurOnSubmit={false}
            />
            {this._renderIcon()}
          </View>
        </Animated.View>
      );
    }
  },

  _showPanel() {
    if (!this.state.showPanel) {
      dismissKeyboard();
      this.listViewMaxHeight -= this.props.panelHeight;

      Animated.timing(this.state.height, {
        toValue: this.listViewMaxHeight,
        duration: 150,
      }).start();

      this.setState({
        showPanel: true
      });

      this.scrollToBottom();
    }
  },

  _hidePanel() {
    if (this.state.showPanel) {
      this.listViewMaxHeight += this.props.panelHeight;

      Animated.timing(this.state.height, {
        toValue: this.listViewMaxHeight,
        duration: 150,
      }).start();

      this.setState({
        showPanel: false
      });

      this.scrollToBottom();
    }
  },

  _handleMore() {
    //LayoutAnimation.spring();
    if (this.state.showPanel) {
      this._hidePanel();
    } else {
      this._showPanel();
    }
  },

  renderPanel() {
    //LayoutAnimation.spring();
    if (this.state.showPanel) {
      return (
        <Animated.View style={this.styles.panelContainer}>

          <ImagePicker
            type="library"
            onSelected={(response) => this.props.handleSendImage(response)}
            onError={(error) => this.props.handleImageError(error)}
            title="选择图片"
            fileId="selectImage"
            allowsEditing={true}
            style={this.styles.panelItem}
          >
            <Image
              style={this.styles.panelIcon}
              source={DictIcon.imImg}
            />
            <Text style={this.styles.panelText}>照片</Text>
          </ImagePicker>

          <ImagePicker
            type="camera"
            onSelected={(response) => { console.log(response)}}
            title="选择图片"
            fileId="selectCamera"
            allowsEditing={true}
            style={this.styles.panelItem}
          >
            <Image
              style={this.styles.panelIcon}
              source={DictIcon.imPhoto}
            />
            <Text style={this.styles.panelText}>拍摄</Text>
          </ImagePicker>

          <TouchableOpacity
            style={this.styles.panelItem}
            onPress= {() => this.handleBizInfo()}
          >
            <Image
              style={this.styles.panelIcon}
              source={DictIcon.imQuote}
            />
            <Text style={this.styles.panelText}>业务</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={this.styles.panelItem}
            onPress= {() => this.handleNameCard()}
          >
            <Image
              style={this.styles.panelIcon}
              source={DictIcon.imCard}
            />
            <Text style={this.styles.panelText}>名片</Text>
          </TouchableOpacity>

        </Animated.View>
      );
    }
  },

  render() {
    // LayoutAnimation.spring();
    return (
      <View
        style={this.styles.container}
        ref='container'
      >
        {this.renderAnimatedView()}
        {this.renderTextInput()}
        {this.renderPanel()}
      </View>
    );
  },

  componentWillMount() {
    this.styles = {
      container: {
        flex: 1
      },
      listView: {
        flex: 1,
      },
      date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      link: {
        color: '#007aff',
        textDecorationLine: 'underline',
      },
      linkLeft: {
        color: '#000',
      },
      linkRight: {
        color: '#fff',
      },
      loadEarlierMessages: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadEarlierMessagesButton: {
        fontSize: 14,
      },
      panelContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: '#153757',
        paddingTop: 5,
        flex: 1
      },
      panelItem: {
        flex: 1,
        margin: 5,
        borderRadius: 3,
        flexDirection: 'column',
        //alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 100
        //marginHorizontal: 70
      },
      panelIcon: {
        width: 69,
        height: 69
      },
      panelText: {
        fontSize: 14,
        color: '#0f60b1'
      }
    };

    Object.assign(this.styles, this.props.styles);
  }
});

module.exports = GiftedMessenger;
