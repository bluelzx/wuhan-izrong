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
let { MSG_TYPE, MSG_CONTENT_TYPE, ITEM_TYPE } = require('../../constants/dictIm');
let AppStore = require('../../framework/store/appStore');
let ContactStore = require('../../framework/store/contactStore');


let Chat = React.createClass({

  componentDidMount() {
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
    return {
      chatInfo: {
        type: this.props.param.type
      },
      userInfo: ContactStore.getUserInfo()
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

  getInitialState: function() {
    return {
      chatInfo: {
        type: this.props.param.type
      },
      userInfo: ContactStore.getUserInfo()
    }
  },

  tagDetail: function(){
    //let id = this.props.param.id;//groupId or userId  ,!!!deferent from ownerId
    let comp = EditGroup;
    let item = this.props.param;
    if(item.chatType==ITEM_TYPE.USER){
      comp = ImUserInfo;
    }else if(item.groupMasterUid == this.state.userInfo.userId){
      comp = EditGroupMaster;
    }else{
      // 普通成员
    }
    this.props.navigator.push({
      comp: comp,
      param:item
    });
  },

  renderEdit: function () {
    return (
      <TouchableOpacity
        onPress={this.tagDetail}>
       <Image style={{width:25,height:25}} source={this.props.param.chatType==ITEM_TYPE.GROUP?DictIcon.imGroupMore:DictIcon.imUserMore}/>
      </TouchableOpacity>

    );
  },

  render: function () {
    let item = this.props.param;
    let title = item.title;

    return (
      <NavBarView
        navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
        contentBackgroundColor='#15263A' title={title}
        showBar={true}
        actionButton={this.renderEdit}
      >
        <Messenger param={item}></Messenger>
      </NavBarView>
    );
  }
});
module.exports = Chat;
