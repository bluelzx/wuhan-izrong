/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Image
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let _ = require('lodash');
let Icon = require('react-native-vector-icons/Ionicons');
let DateHelper = require('../../comp/utils/dateHelper');
let { Device } = require('mx-artifacts');
let Swipeout= require('react-native-swipeout');
let Contacts = require('./contacts');
let Chat = require('./chat');
let SearchBar = require('./searchBar');
let DictIcon = require('../../constants/dictIcon');
let Spread = require('./spread');
let HeadPic = require('./headerPic');
let AppStore = require('../../framework/store/appStore');

let ContactStore = require('../../framework/store/contactStore');
let SessionStore = require('../../framework/store/sessionStore');
let ContactAction = require('../../framework/action/contactAction');
let { MSG_CONTENT_TYPE, SESSION_TYPE } = require('../../constants/dictIm');
let NameCircular = require('./nameCircular');

let WhitePage = React.createClass({

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
    return {data:ContactStore.getIMNotificationMessage()};
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },

  textChange: function() {
  },

  renderContact: function() {
    return (
      <TouchableOpacity onPress={()=>{
//      SessionAction.updateSession(MSG_TYPE.REC_P2P_MSG,'2',
//'hahahaha',
//'hello',
// new Date(),
// MSG_CONTENT_TYPE.TEXT
//      );
      this.props.navigator.push({
            comp: Contacts
      });
      }}>
        <Image style={{width:20,height:20}} source={DictIcon.imContact}/>
      </TouchableOpacity>
    );
  },

  unReadIcon: function(item){
    if (item.badge > 0) {
      return (
        <View style={[{marginLeft:22,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},item.badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
          <Text style={{color:'white',fontSize:11}}>{item.badge >= 99 ? "99+" : item.badge}</Text>
        </View>
      )
    }
  },

  renderImg: function(item, index) {
    return (
      <View style={{marginTop:5,backgroundColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20, marginRight:15}}>
        {this.unReadIcon(item)}
      </View>
    );
  },

  toOther: function(item) {
    let userinfo = ContactStore.getUserInfo();
    let option = null;
    let param = {};
    if(SESSION_TYPE.GROUP == item.type){ // 区分聊天窗口类型
      let g = SessionStore.getGroupInfoBySessionId(item.sessionId,userinfo.userId)
      param.chatType = SESSION_TYPE.GROUP;
      param.title = item.title;
      param.groupId = g.groupId; //query
      param.groupMasterUid = g.groupMasterUid; //query
    }else{
      let u = SessionStore.getUserInfoBySessionId(item.sessionId,userinfo.userId)
      param.chatType = SESSION_TYPE.USER;
      param.title = item.title;
      param.userId = u.userId;  //query
    }
    this.props.navigator.push({
      comp: Chat,
      param: param
    });
  },


  renderSpread: function(item) {
    if(_.isEmpty(item)){
      return;
    }

    let {width} = Device;
    return (
      <TouchableHighlight onPress={()=> this.props.navigator.push({comp: Spread})}>
        <View
          style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
          <HeadPic badge={item.badge} style={{height: 40,width: 40, marginRight:15}} source={DictIcon.imSpread} />
          <View
            style={{ height:40, width:width-70}}>
            <View
              style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={{color:'#ffffff'}}>{'环渤海银银合作平台'}</Text>
              <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.lastTime)}</Text>
            </View>
            <Text numberOfLines={1}
                  style={{marginTop:5,color:'#687886'}}>{item.content}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },


  renderGroup: function(item, index){
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: function(){
          SessionStore.deleteSession(item.sessionId);
        }
      }
    ];
    return (
      <Swipeout key={item.sessionId} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>this.toOther(item)}>
          <View
            style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
            <HeadPic badge={item.badge} style={{height: 40,width: 40, marginRight:15}} source={DictIcon.imMyGroup} />
            <View
              style={{ height:40, width:width-70, paddingHorizontal:10,justifyContent:'center'}}>
              <View
                style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#ffffff'}}>{item.title}</Text>
                <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.lastTime)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{MSG_CONTENT_TYPE.TEXT==item.contentType?item.content:'点击查看详情'}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  },

  renderUser: function(item, index){
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: function(){

        }
      }
    ];
    return (
      <Swipeout key={item.sessionId} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>this.toOther(item)}>
          <View
            style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
            <View style={{height: 40,width: 40, marginRight:15}}>
              <NameCircular badge={item.badge} name={item.title}/>
            </View>
            <View
              style={{ height:40, width:width-70,paddingHorizontal:10, justifyContent:'center'}}>
              <View
                style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#ffffff'}}>{item.title}</Text>
                <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.lastTime)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{MSG_CONTENT_TYPE.TEXT==item.contentType?item.content:'点击查看详情'}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  },

  acceptInvite: function(item) {
    this.props.exec(
      ()=>{
        return ContactAction.acceptInvitation(item.badge);
      }
    );
  },

  renderInvite:function(item, index) {
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: function(){
          SessionStore.deleteSession(item.sessionId);
        }
      }
    ];
    return (
      <Swipeout key={item.sessionId} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <View
          style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
          <HeadPic badge={0} style={{height: 40,width: 40, marginRight:15}} source={DictIcon.imMyGroup}/>
          <View
            style={{ flexDirection:'row',paddingHorizontal:10, height:40, width:width-70, justifyContent:'space-between', alignItems:'center'}}>
            <View>
              <Text style={{color:'#ffffff'}}>{item.title}</Text>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{MSG_CONTENT_TYPE.TEXT == item.contentType ? item.content : '点击查看详情'}</Text>
            </View>
            <TouchableHighlight style={{marginRight:10}} onPress={()=>this.acceptInvite(item)}>
              <Text
                style={{borderRadius:5,color:'#ffffff', paddingHorizontal:20,paddingVertical:5,backgroundColor:'#3EC3A4'}}>{'接受'}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Swipeout>
    );
  },

  renderItem: function(item, index) {
    if(item.type == SESSION_TYPE.USER){
      return this.renderUser(item, index);
    }else if(item.type == SESSION_TYPE.GROUP){
      return this.renderGroup(item, index);
    }else if(item.type == SESSION_TYPE.INVITE){
      return this.renderInvite(item, index);
    }else{
      throw 'IM 会话类型不存在';
    }
  },

  renderMessage: function() {
    let msg = new Array();
    this.state.data.msg.map((item, index)=>{
      msg.push(this.renderItem(item, index));
    });
    return msg;
  },

  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='IM' showBack={false}
                  showBar={true}
                  actionButton={this.renderContact}>
       <SearchBar textChange={this.textChange}/>
        <View>
          {this.renderSpread(this.state.data.platformInfo)}
          {this.renderMessage()}
        </View>
      </NavBarView>
    );
  }
});

module.exports = WhitePage;
