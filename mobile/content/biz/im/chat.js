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
const Messenger = require('./messenger');
let msgType = require('../../constants/wsMsgType');
let ItemType = require('./itemType');

let Chat = React.createClass({

  getDefaultProps: function () {
    return {
      param: {
        title: '聊天'
      }
    };
  },

  getInitialState: function() {
    return {
      chatInfo:{
        type:this.props.param.type
      },
      myId:0
    }
  },

  tagDetail: function(){
    //let id = this.props.param.id;//groupId or userId  ,!!!deferent from ownerId
    let comp = EditGroup;
    let item = this.props.param;
    if(item.chatType==ItemType.USER){
      comp = ImUserInfo;
    }else if(item.groupOwnerId == this.state.myId){
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
       <Image style={{width:25,height:25}} source={this.props.param.chatType==ItemType.GROUP?DictIcon.imGroupMore:DictIcon.imUserMore}/>
      </TouchableOpacity>

    );
  },

  render: function () {
    let item = this.props.param;
    let title = "";
    if(item.chatType == ItemType.GROUP){
      title = item.groupName;
    }else{
      title = item.realName;
    }
    return (
      <NavBarView
        navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
        contentBackgroundColor='#15263A' title={title}
        showBar={true}
        actionButton={this.renderEdit}
      >
        <Messenger></Messenger>
      </NavBarView>
    );
  }
});
module.exports = Chat;
