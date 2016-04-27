/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, TouchableOpacity} = React;
let NavBarView = require('../../framework/system/navBarView');
let EditGroup = require('./editGroup');
let EditGroupMaster = require('./editGroupMaster');
let DictIcon = require('../../constants/dictIcon');
let ImUserInfo = require('./imUserInfo');
const Messenger = require('./../../comp/messenger/messenger');
let {  SESSION_TYPE } = require('../../constants/dictIm');
let AppStore = require('../../framework/store/appStore');
let ContactStore = require('../../framework/store/contactStore');
let SessionStore = require('../../framework/store/sessionStore');
let ImAction = require('../../framework/action/imAction');

let KeyGenerator = require('../../comp/utils/keyGenerator');

let Chat = React.createClass({

  componentDidMount() {
    let { param } = this.props;
    param.sessionId = SessionStore.querySessionById(this.props.param.userId || this.props.param.groupId,this.props.param.chatType);
    param.sessionId || (param.sessionId=KeyGenerator.getSessionKey(param.chatType, this.props.param.userId || this.props.param.groupId));

    ImAction.sessionInit({
      toId: param.userId,
      sessionId: param.sessionId
    });
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    //TODO:群组聊天时被踢
    let item = this.props.param;
    let title = '';

    if(item.chatType==SESSION_TYPE.USER){
      let userInfo = ContactStore.getUserInfoByUserId(item.userId);
      if(!userInfo || !userInfo.userId){
        this.props.navigator.popToTop();
      }
      title = userInfo.realName + '-' +userInfo.orgValue;
    }else{
      let groupInfo = ContactStore.getGroupDetailById(item.groupId);
      if(!groupInfo || !groupInfo.groupId){
        this.props.navigator.popToTop();
      }
      title = groupInfo?groupInfo.groupName:'未命名';
    }

    return {
      chatInfo: {
        type: this.props.param.type
      },
      userInfo: ContactStore.getUserInfo(),
      title:title
    }
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },

  getDefaultProps: function () {
    return {
      param: {
        title: '聊天'
      }
    };
  },

  tagDetail: function(){
    //let id = this.props.param.id;//groupId or userId  ,!!!deferent from ownerId
    let comp = EditGroup;
    let item = this.props.param;
    if(item.chatType==SESSION_TYPE.USER){
      comp = ImUserInfo;
    }else if(item.groupMasterUid == this.state.userInfo.userId){
      comp = EditGroupMaster;
    }else{
      // 普通成员
    }
    this.props.navigator.push({
      comp: comp,
      param: item
    });
  },

  renderEdit: function () {
    return (
      <TouchableOpacity
        onPress={this.tagDetail}>
       <Image style={{width:25,height:25}} source={this.props.param.chatType==SESSION_TYPE.GROUP?DictIcon.imGroupMore:DictIcon.imUserMore}/>
      </TouchableOpacity>

    );
  },

  render: function () {
    let item = this.props.param;
    let title = item.title;
    return (
      <NavBarView
        navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
        contentBackgroundColor='#15263A' title={this.state.title}
        showBar={true}
        actionButton={this.renderEdit}
      >
        <Messenger param={item} navigator={this.props.navigator}></Messenger>
      </NavBarView>
    );
  }
});
module.exports = Chat;
