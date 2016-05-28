/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let _ = require('lodash');
let Icon = require('react-native-vector-icons/Ionicons');
let DateHelper = require('../../comp/utils/dateHelper');
let { Device,Alert } = require('mx-artifacts');
let Swipeout = require('react-native-swipeout');
let Contacts = require('./contacts');
let Chat = require('./chat');
let SearchBar = require('./searchBar');
let GroupNotice = require('./groupNotice');
let DictIcon = require('../../constants/dictIcon');
let Spread = require('./spread');
let HeadPic = require('./headerPic');
let AppStore = require('../../framework/store/appStore');

let ContactStore = require('../../framework/store/contactStore');
let SessionStore = require('../../framework/store/sessionStore');
let ContactAction = require('../../framework/action/contactAction');
let { MSG_CONTENT_TYPE, SESSION_TYPE } = require('../../constants/dictIm');
//let NameCircular = require('./nameCircular').NameCircular;
let {sessionFilter} = require('./searchBarHelper');
let { IM_SESSION_LIST } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');
let NewFriendList = require('./newFriendList');

let PlainStyle = require('../../constants/dictStyle');
let SessionIdSplit = require('../../comp/utils/sessionIdSplitUtils');
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

  getStateFromStores: function () {
    let userInfo = AppStore.getLoginUserInfo();
    return {data: ContactStore.getIMNotificationMessage(userInfo.userId)};
  },

  getInitialState: function () {
    return Object.assign(this.getStateFromStores(), {keyWord: ''});
  },


  textChange: function (text) {
    this.setState({keyWord: text});
  },

  renderContact: function () {
    return (
      <TouchableOpacity onPress={()=>{
       // AppStore.updateLastSyncTime(new Date());
      this.props.navigator.push({
            comp: Contacts
      });
      }}>
        <Image style={{width:25,height:25}} source={DictIcon.imContact}/>
      </TouchableOpacity>
    );
  },

  unReadIcon: function (item) {
    if (item.badge > 0) {
      return (
        <View style={[{marginLeft:22,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},item.badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
          <Text style={{color:'white',fontSize:11}}>{item.badge >= 99 ? "99+" : item.badge}</Text>
        </View>
      )
    }
  },

  renderImg: function (item, index) {
    return (
      <View style={{marginTop:5,backgroundColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20, marginRight:15}}>
        {this.unReadIcon(item)}
      </View>
    );
  },

  toOther: function (item) {
    // TODO:  事务
    let userInfo = ContactStore.getUserInfo();
    SessionStore.setBadgeZero(item.sessionId);

    let option = null;
    let param = {};
    if (SESSION_TYPE.GROUP == item.type) { // 区分聊天窗口类型
      let g = SessionStore.getGroupInfoBySessionId(item.sessionId, userInfo.userId)
      param.chatType = SESSION_TYPE.GROUP;
      param.title = item.title;
      param.groupId = g.groupId; //query
      param.groupMasterUid = g.groupMasterUid; //query
    }else{
      //let u = SessionStore.getUserInfoBySessionId(item.sessionId,userInfo.userId)
      param.chatType = SESSION_TYPE.USER;
      param.title = item.title;
      param.userId = this.getIdFromSessionId(item.sessionId);  //query
    }
    this.props.navigator.push({
      comp: Chat,
      param: param
    });
  },


  renderSpread: function (item, index, length) {
    if (_.isEmpty(item)) {
      return;
    }
    return (
      <TouchableOpacity key={item.sessionId}
                        style={[ItemStyle.back]}
                        onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{});
          }
        }
                          onPress={()=>{SessionStore.setBadgeZero(item.sessionId); this.props.navigator.push({comp: Spread})}}>
        <View
          style={{
          flex:1,
          alignItems:'center',
          borderBottomColor: PlainStyle.colorSet.demarcationColor,
          borderBottomWidth:0.5,
          flexDirection:'row',
          paddingVertical:7,
          marginHorizontal: 10}}
        >
          <HeadPic badge={item.badge} showBadge={true} source={DictIcon.imSpread} />
          <View
            style={{ flex:1,paddingHorizontal:10}}>
            <View
              style={{flexDirection:'row', justifyContent:'space-between',flex:1}}>
              <Text style={[{color:DictStyle.colorSet.imTitleTextColor},FontSize.realName]}>{'爱资融同业平台'}</Text>
              <Text style={[{color:DictStyle.colorSet.imTimeTextColor},FontSize.rightTime]}>{DateHelper.descDate(item.lastTime)}</Text>
            </View>
            <Text numberOfLines={1}
                  style={[{marginTop:5,color:DictStyle.colorSet.sessionDetailColor},FontSize.bottomDesc]}>{item.content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderGroupNotice (item, index, length) {
    if (_.isEmpty(item)) {
      return;
    }
    return (
      <TouchableOpacity key={item.sessionId}
                        style={[ItemStyle.back]}
                        onLongPress={
        ()=>
          {
            Alert('确定删除所有群通知消息吗?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        }
                        onPress={()=>{SessionStore.setBadgeZero(item.sessionId); this.props.navigator.push({comp: GroupNotice})}}>
        <View
          style={{
          flex:1,
          alignItems:'center',
          borderBottomColor: PlainStyle.colorSet.demarcationColor,
          borderBottomWidth:0.5,
          flexDirection:'row',
          paddingVertical:7,
          marginHorizontal: 10}}>
          <HeadPic badge={item.badge} source={DictIcon.imGroupNotice} showBadge={true}/>
          <View
            style={{  flex:1,paddingHorizontal:10}}>
            <View style={{flexDirection:'row', justifyContent:'space-between',flex:1}}>
                <Text style={[{color:DictStyle.colorSet.imTitleTextColor},FontSize.realName]}>{'群通知'}</Text>
                <Icon name="ios-arrow-right" size={20} color={PlainStyle.colorSet.arrowColor}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderGroup: function (item, index, length) {
    return (
        <TouchableOpacity key={item.sessionId}
                          style={[ItemStyle.back]}
                          onPress={()=>this.toOther(item)}
                          onLongPress={()=>{
                                Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})}}
        >
          <View
            style={{
            flex:1,
            alignItems:'center',
            borderBottomColor: DictStyle.colorSet.demarcationColor,
            borderBottomWidth:0.5,
            flexDirection:'row',
            paddingVertical:7,
            marginHorizontal:10}}
          >
            <HeadPic badge={item.badge} showBadge={true} source={DictIcon.imMyGroup} />
            <View
              style={{ flex:1,paddingHorizontal:10}}
            >
              <View
                style={{flexDirection:'row', justifyContent:'space-between',flex:1}}>
                <Text numberOfLines={1} style={[{flex:1,color:DictStyle.colorSet.imTitleTextColor},FontSize.realName]}>{item.title}</Text>
                <Text style={[{color:DictStyle.colorSet.imTimeTextColor},FontSize.rightTime]}>{DateHelper.descDate(item.lastTime)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={[{marginTop:5,color:DictStyle.colorSet.sessionDetailColor},FontSize.bottomDesc]}>{this.showText(item)}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  },

  showText:(item)=> {
    //JSON.parse(item.content);
    if(item.type == SESSION_TYPE.USER) {
      if (MSG_CONTENT_TYPE.TEXT == item.contentType) {
        return item.content
      } else if (MSG_CONTENT_TYPE.IMAGE == item.contentType) {
        return '[图片]'
      } else if(MSG_CONTENT_TYPE.NAMECARD == item.contentType){
        return '[名片]';
      }else if(MSG_CONTENT_TYPE.BIZINFO){
        return '[发布业务信息]1条';
      }else {
        return '点击查看详情'
      }
    } else {
      let arr = item.content.split(':::');
      if (MSG_CONTENT_TYPE.TEXT == item.contentType) {
        return arr[0] + '：' + arr[1];
      } else if (MSG_CONTENT_TYPE.IMAGE == item.contentType) {
        return arr[0] + '：[图片]'
      } else if(MSG_CONTENT_TYPE.NAMECARD == item.contentType){
        return arr[0] + '：[名片]';
      }else if(MSG_CONTENT_TYPE.BIZINFO){
        return arr[0] + '：[业务信息]';
      }else {
        return '点击查看详情'
      }
    }

  },

  renderUser: function (item, index, length) {
    let tagUser = ContactStore.getUserInfoByUserId(this.getIdFromSessionId(item.sessionId));
    return (
      <TouchableOpacity key={item.sessionId}
                        style={[ItemStyle.back]}
                        onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        } onPress={()=>this.toOther(item)}>
          <View
            style={{
            borderBottomColor: DictStyle.colorSet.demarcationColor,
            borderBottomWidth:0.5,
            flexDirection:'row',
            paddingVertical:7,
            marginHorizontal:10,
            alignItems:'center',flex:1}}
          >
              <HeaderPic badge={item.badge} showBadge={true} photoFileUrl={tagUser.photoFileUrl}  certified={tagUser.certified} name={tagUser.realName}/>
             <View
              style={{ flex:1,paddingHorizontal:10}}
             >
              <View
                style={{flexDirection:'row', justifyContent:'space-between',flex:1}}>
                <Text numberOfLines={1} style={[{flex:1,color:DictStyle.colorSet.imTitleTextColor},FontSize.realName]}>{item.title + '-' + item.orgValue }</Text>
                <Text style={[{color:DictStyle.colorSet.imTimeTextColor},FontSize.rightTime]}>{DateHelper.descDate(item.lastTime)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={[{marginTop:5,color:'#8A9499'}, FontSize.bottomDesc]}>{this.showText(item)}</Text>
            </View>
          </View>
        </TouchableOpacity>

    );
  },

  acceptInvite: function (item) {
    this.props.exec(
      ()=> {
        let groupId = this.getIdFromSessionId(item.sessionId);
        return ContactAction.acceptInvitation(groupId).then(()=> {
          SessionStore.updateInViteSession(item.sessionId);
        }).catch((err)=> {
          Alert(err);
        });
      }
    );
  },

  deleteSession: function (sessionId) {
    SessionStore.deleteSession(sessionId);
  },

  getIdFromSessionId: function(sessionId){
    return SessionIdSplit.getIdFromSessionId(sessionId);
  },

  renderNewFriend : function(item) {

    if(_.isEmpty(item)){
      return;
    }

    let {width} = Device;
    return (
      <TouchableOpacity style={[ItemStyle.back]}
                        key={item.sessionId}
                        onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item.sessionId)},()=>{})
          }
        }

                        onPress={()=>{SessionStore.setBadgeZero(item.sessionId); this.props.navigator.push({comp: NewFriendList,param:{noticId:item.sessionId}})}}>
        <View
          style={{
          flex:1,
          alignItems:'center',
          borderBottomColor:DictStyle.colorSet.demarcationColor,
          borderBottomWidth:0.5,
          flexDirection:'row',
          paddingVertical:7,
          marginHorizontal:10}}>

          <HeadPic badge={item.badge} source={DictIcon.imNewFriendNotic} showBadge={true}/>

            <View
              style={{  flex:1,paddingHorizontal:10}}
            >
              <View style={{flexDirection:'row', justifyContent:'space-between',flex:1}}>
                <Text style={[{color:DictStyle.colorSet.imTitleTextColor},FontSize.realName]}>{'新好友'}</Text>
                <Icon name="ios-arrow-right" size={20} color={DictStyle.colorSet.arrowColor}/>
              </View>
            </View>


        </View>
      </TouchableOpacity>
    );

  },

  renderItem: function(item, index, length) {

    if(item.type == SESSION_TYPE.USER ){
      return this.renderUser(item, index);
    }else if(item.type == SESSION_TYPE.GROUP ){
      return this.renderGroup(item, index);
    }
    //else if(item.type == SESSION_TYPE.INVITE ){
    //  return this.renderInvite(item, index);
    //}
    //else if(item.type == SESSION_TYPE.INVITED ){
    //  return this.renderInvited(item, index);
    //}
    else if(item.type == SESSION_TYPE.PLATFORMINFO ){
      return this.renderSpread(item);
    }else if(item.type == SESSION_TYPE.NEWFRIEND ){
      return this.renderNewFriend(item);
    }else if (item.type == SESSION_TYPE.GROUP_NOTICE) {
      return this.renderGroupNotice(item, index, length);
    }else{
      throw 'IM 会话类型不存在';
    }

  },

  renderMessage: function () {
    let msg = [];
    this.state.data.msg.forEach((item)=>{
      if(item.type == SESSION_TYPE.USER){
        let tagUser = ContactStore.getUserInfoByUserId(this.getIdFromSessionId(item.sessionId));
        item.orgValue = ContactStore.getOrgValueByOrgId(tagUser.orgId);
      }
    });
    let listData = this.state.data.msg;//sessionFilter(this.state.data.msg, 'title', 'content','orgValue', this.state.keyWord);
    if (_.isEmpty(listData) || listData.length == 0) {
      return this.renderNull();
    } else {
      let length = listData.length;
      listData.map((item, index)=> {
        msg.push(this.renderItem(item, index, length));
      });
      return msg;
    }
  },

  renderNull: function () {
    return (
      <Text style={{flex:1, marginTop:20, textAlign:'center', color:DictStyle.searchFriend.nullUnitColor}}>您当前没有新好友通知</Text>
    );
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='聊天' showBack={false} actionButton={this.renderContact}>

        {/*
         <SearchBar textChange={this.textChange}/>
         */}

        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={{flexDirection: 'column',marginTop:0,backgroundColor:'#F4F4F4'}}>
          {this.renderMessage()}
        </ScrollView>

      </NavBarView>
    );
  }
});


let FontSize = StyleSheet.create({
  realName:{
    fontSize:15
  },
  rightTime:{
    fontSize:11
  },
  bottomDesc:{
    fontSize:15
  }
});

let ItemStyle = StyleSheet.create({
  back:{
    backgroundColor:'#FEFEFE'
  }
});


module.exports = WhitePage;
