/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, TouchableOpacity} = React;
let NavBarView = require('../../framework/system/navBarView');
let EditGroup = require('./editGroup');
let EditGroupMaster = require('./editGroupMaster');
let DictIcon = require('../../constants/dictIcon');
let { IM_SESSION } = require('../../constants/dictEvent');
let ImUserInfo = require('./imUserInfo');
const Messenger = require('./../../comp/messenger/messenger');
let AppStore = require('../../framework/store/appStore');
let ContactStore = require('../../framework/store/contactStore');
let SessionStore = require('../../framework/store/sessionStore');
let ImAction = require('../../framework/action/imAction');
let { MSG_CONTENT_TYPE, SESSION_TYPE } = require('../../constants/dictIm');

let KeyGenerator = require('../../comp/utils/keyGenerator');
var TimerMixin = require('react-timer-mixin');

let Chat = React.createClass({

  mixins: [TimerMixin],

  componentDidMount() {
    let user = ContactStore.getUserInfo();
    let { param } = this.props;

    if( param.chatType == SESSION_TYPE.USER && user.userId == param.userId){
      return ;
    }

    param.myId = user.userId;
    param.sessionId = SessionStore.querySessionById(this.props.param.userId || this.props.param.groupId,this.props.param.chatType);
    param.sessionId || (param.sessionId=KeyGenerator.getSessionKey(param.chatType, this.props.param.userId || this.props.param.groupId, user.userId));


    ImAction.sessionInit({
      toId: param.userId,
      sessionId: param.sessionId,
      userId:user.userId,
      myName:user.realName,
      photoFileUrl:user.photoFileUrl,
      certified:user.certified,
      messageType:param.chatType
    });
    AppStore.addChangeListener(this._onChange, IM_SESSION);
    if (this.props.param.isFromBizDetail) {
      let self = this;
      setTimeout(()=>{
        self.refs['BIZ_Message']._sendMessage(MSG_CONTENT_TYPE.BIZINFO, self.props.param.content);
      },1000);

    }
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, IM_SESSION);
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
      let groupInfo = null;
      try {
        groupInfo = ContactStore.getGroupDetailById(this.props.param.groupId);
      } catch (err) {
        this.props.navigator.popToTop();
        return {}
      };
      if (!groupInfo) {
        this.props.navigator.popToTop();
        return {}
      }
      //
      //let groupInfo = ContactStore.getGroupDetailById(item.groupId);
      //if(!groupInfo || !groupInfo.groupId){
      //  this.props.navigator.popToTop();
      //}
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
        style={{padding:50,marginRight:-50}}
        onPress={ ()=>this.requestAnimationFrame(this.tagDetail)}>
       <Image style={{width:25,height:25}} source={this.props.param.chatType==SESSION_TYPE.GROUP?DictIcon.imGroupMore:DictIcon.imUserMore}/>
      </TouchableOpacity>

    );
  },

  render: function () {
    let item = this.props.param;
    let title = item.title;

    let user = ContactStore.getUserInfo();
    let { param } = this.props;
    if( param.chatType == SESSION_TYPE.USER && user.userId == param.userId){
      return (
        <NavBarView
          navigator={this.props.navigator}
          title={this.state.title}
          actionButton={this.renderEdit}
        >
          <Text>自己不能和自己聊天</Text>
        </NavBarView>
      );
    }

    return (
      <NavBarView
        navigator={this.props.navigator}
        title={this.state.title}
        actionButton={this.renderEdit}
      >
        <Messenger ref="BIZ_Message" param={item} navigator={this.props.navigator}></Messenger>
      </NavBarView>
    );
  }
});
module.exports = Chat;
