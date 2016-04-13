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
    let id = this.props.param.id;//groupId or userId  ,!!!deferent from ownerId
    if(this.props.param.type=="user"){
      this.props.navigator.push({
        comp: ImUserInfo,
        param:{
          id:id
        }
      });
    }else{
      let comp = EditGroup;
      if(this.props.param.ownerId == this.state.myId){
        comp = EditGroupMaster;
      }
      this.props.navigator.push({
        comp: comp,
        param:{
          id:id
        }

      });
    }
  },

  renderEdit: function () {
    return (
      <TouchableOpacity
        onPress={this.tagDetail}>
       <Image style={{width:25,height:25}} source={this.props.param.type=="user"?DictIcon.imUserMore:DictIcon.imGroupMore}/>
      </TouchableOpacity>

    );
  },

  render: function () {
    let {title} = this.props.param;
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
