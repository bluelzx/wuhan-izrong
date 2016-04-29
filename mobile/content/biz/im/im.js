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
  Image,
  ScrollView
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let _ = require('lodash');
let Icon = require('react-native-vector-icons/Ionicons');
let DateHelper = require('../../comp/utils/dateHelper');
let { Device,Alert } = require('mx-artifacts');
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
let NameCircular = require('./nameCircular').NameCircular;
let {sessionFilter} = require('./searchBarHelper');
let { IM_SESSION_LIST } = require('../../constants/dictEvent');

let WhitePage = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, IM_SESSION_LIST);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, IM_SESSION_LIST);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    return {data:ContactStore.getIMNotificationMessage()};
  },

  getInitialState: function(){
    return Object.assign(this.getStateFromStores(),{keyWord:''});
  },


  textChange: function(text) {
    this.setState({keyWord:text});
  },

  renderContact: function() {
    return (
      <TouchableOpacity onPress={()=>{
       // AppStore.updateLastSyncTime(new Date());
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
    // TODO:  事务
    let userinfo = ContactStore.getUserInfo();
    SessionStore.setBadgeZero(item.sessionId);

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
      <TouchableHighlight onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        }
                          onPress={()=> this.props.navigator.push({comp: Spread})}>
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

    return (
        <TouchableHighlight key={item.sessionId} onPress={()=>this.toOther(item)} onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        }>
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
                    style={{marginTop:5,color:'#687886'}}>{this.showText(item)}</Text>
            </View>
          </View>
        </TouchableHighlight>
    );
  },

  showText:(item)=> {
    if (MSG_CONTENT_TYPE.TEXT == item.contentType) {
      return item.content
    } else if (MSG_CONTENT_TYPE.IMAGE == item.contentType) {
      return '[图片]'
    } else if(MSG_CONTENT_TYPE.NAMECARD == item.contentType){
      return '[名片]';
    }else if(MSG_CONTENT_TYPE.BIZINFO){
      return '[业务信息]';
    }else {
      return '点击查看详情'
    }
  },

  renderUser: function(item, index){
    let {width} = Device;

    return (
        <TouchableHighlight key={item.sessionId}  onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        } onPress={()=>this.toOther(item)}>
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
                    style={{marginTop:5,color:'#687886'}}>{this.showText(item)}</Text>
            </View>
          </View>
        </TouchableHighlight>

    );
  },

  acceptInvite: function(item) {
    this.props.exec(
      ()=>{
        //item.badge == groupId
        return ContactAction.acceptInvitation(item.badge).then(()=>{
          SessionStore.updateInViteSession(item.sessionId);
        });
      }
    );
  },

  deleteSession: function(sessionId){
    SessionStore.deleteSession(sessionId);
  },

  renderInvite:function(item, index) {
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: ()=>this.deleteSession(item.sessionId)
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

  getIdFromSessionId: function(sessionId){
    let i = sessionId.indexOf(':');
    return parseInt(sessionId.substring(i+1));
  },

  renderInvited:function(item, index) {
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: ()=>this.deleteSession(item.sessionId)
      }
    ];
    return (
      <Swipeout key={item.sessionId} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>{
        let groupId = this.getIdFromSessionId(item.sessionId);
         let groupInfo = ContactStore.getGroupDetailById(groupId);
        let param = {};
        param.chatType = SESSION_TYPE.GROUP;
        param.title = groupInfo.groupName;
        param.groupId = groupInfo.groupId;
        param.groupMasterUid = groupInfo.groupMasterUid;
          this.props.navigator.push({comp:Chat, param:param});
        }}>
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

              <Text
                style={{borderRadius:5,color:'#ffffff', paddingHorizontal:20,paddingVertical:5}}>{'已接受'}</Text>

          </View>
        </View>
      </TouchableHighlight>
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
    }else if(item.type == SESSION_TYPE.INVITED){
      return this.renderInvited(item, index);
    }else{
      throw 'IM 会话类型不存在';
    }
  },

  renderMessage: function() {
    let msg = [];
    sessionFilter(this.state.data.msg,'title','content',this.state.keyWord).map((item, index)=>{
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
        <ScrollView style={{flexDirection: 'column'}}>
          {this.renderSpread(this.state.data.platformInfo)}
          {this.renderMessage()}
        </ScrollView>
      </NavBarView>
    );
  }
});

module.exports = WhitePage;
