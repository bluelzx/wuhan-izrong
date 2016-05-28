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
  ListView,
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
let DictIcon = require('../../constants/dictIcon');
let Spread = require('./spread');
let HeadPic = require('./headerPic');
let AppStore = require('../../framework/store/appStore');

let ContactStore = require('../../framework/store/contactStore');
let SessionStore = require('../../framework/store/sessionStore');
let NoticeStore = require('../../framework/store/noticeStore');
let ContactAction = require('../../framework/action/contactAction');
let { MSG_CONTENT_TYPE, SESSION_TYPE, NOTICE_TYPE } = require('../../constants/dictIm');
let NameCircular = require('./nameCircular').NameCircular;
let {sessionFilter} = require('./searchBarHelper');
let { IM_SESSION_LIST } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');
let PlainStyle = require('../../constants/dictStyle');
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let data;
let GroupNotice = React.createClass({

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
    let userInfo = ContactStore.getUserInfo();
    data = NoticeStore.getNotificationMessage(userInfo.userId);
    return {
      data: data,
      dataSource: ds.cloneWithRows(data)
    };
  },

  getInitialState: function () {
    return Object.assign(this.getStateFromStores(), {keyWord: ''});
  },

  toOther: function (item) {
    // TODO:  事务
    let userinfo = ContactStore.getUserInfo();
    SessionStore.setBadgeZero(item.sessionId);

    let option = null;
    let param = {};
    if (SESSION_TYPE.GROUP == item.type) { // 区分聊天窗口类型
      let g = SessionStore.getGroupInfoBySessionId(item.sessionId, userinfo.userId)
      param.chatType = SESSION_TYPE.GROUP;
      param.title = item.title;
      param.groupId = g.groupId; //query
      param.groupMasterUid = g.groupMasterUid; //query
    } else {
      let u = SessionStore.getUserInfoBySessionId(item.sessionId, userinfo.userId)
      param.chatType = SESSION_TYPE.USER;
      param.title = item.title;
      param.userId = u.userId;  //query
    }
    this.props.navigator.push({
      comp: Chat,
      param: param
    });
  },

  showText: (item)=> {
    if (MSG_CONTENT_TYPE.TEXT == item.contentType) {
      return item.content
    } else if (MSG_CONTENT_TYPE.IMAGE == item.contentType) {
      return '[图片]'
    } else if (MSG_CONTENT_TYPE.NAMECARD == item.contentType) {
      return '[名片]';
    } else if (MSG_CONTENT_TYPE.BIZINFO) {
      return '[业务信息]';
    } else {
      return '点击查看详情'
    }
  },

  acceptInvite: function (item) {
    //TODO:判断本地是否有该群,再判断用户是否在群中 judge
    let user = ContactStore.getUserInfo();
    let judge = ContactStore.judgeGroup(item.groupId, user.userId);
    if (judge) {
      NoticeStore.updateInViteNotice(item.noticeId);
      Alert('你已加入该群');
    } else {
      this.props.exec(
        ()=> {
          return ContactAction.acceptInvitation(item.groupId).then(()=> {
            NoticeStore.updateInViteNotice(item.noticeId);
          }).then(() => {
              this.toChat(item)
            }
          ).catch((err)=> {
            if (err.errCode && err.errCode == 'GROUP_NOT_EXIST') {
              NoticeStore.updateInViteNotice(item.noticeId);
              Alert('该群已被解散')
            }
            //Alert(err);
          });
        }
      );
    }
  },

  deleteSession: function (sessionId) {
    SessionStore.deleteSession(sessionId);
  },

  getIdFromSessionId: function (sessionId) {
    let i = sessionId.indexOf(':');
    return parseInt(sessionId.substring(i + 1));
  },

  renderBtn (item) {
    if (item.isInvited) {
      return (
        <View style={{height:50,flexDirection:'column', justifyContent:'center'}}>
          <Text style={{color:PlainStyle.colorSet.imTimeTextColor}}>已接受</Text>
        </View>
      );
    } else {
      return (
        <TouchableHighlight style={{borderRadius: 5, backgroundColor: '#1095ef',paddingHorizontal:20,paddingVertical:5}}
                            underlayColor='#08a0f7' onPress={()=>{this.acceptInvite(item)}}>
          <Text
            style={{color: '#ffffff', textAlign:'center'}}>{'接受'}</Text>
        </TouchableHighlight>
      );
    }
  },

  toChat(item) {
    let user = ContactStore.getUserInfo();
    let judge = ContactStore.judgeGroup(item.groupId, user.userId);
    if (judge) {
      let param = {
        chatType: SESSION_TYPE.GROUP,
        title: item.groupName,
        groupId: item.groupId,
        groupMasterUid: item.groupOwnerId
      };
      this.props.navigator.push({
        comp: Chat,
        param: param
      })
    }
  },

  renderRow (item) {
    let {width} = Device;
    if (item.msgType == NOTICE_TYPE.INVITE) {
      return (
        <TouchableOpacity style={{backgroundColor: '#FEFEFE'}} activeOpacity={1} onLongPress={()=>{
            Alert('确定删除该条记录?', () => {
              let last = false;
              if (this.state.data.length == 1) {
                last = true;
              }
              NoticeStore.deleteNotice(item.noticeId);
              if (last) {
                this.deleteSession(item.noticeId);
                this.props.navigator.pop();
              }
            },()=>{})
          }} onPress={()=>{item.isInvited ? this.toChat(item) : null}}>
          <View
            style={{borderBottomColor: PlainStyle.colorSet.demarcationColor,borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, marginHorizontal:10,justifyContent:'center'}}>
            <HeadPic badge={0} style={{ height:40,width: 40, marginRight:15,justifyContent:'center', marginTop: 5}}
                     source={DictIcon.imGroupNotice}/>
            <View
              style={{height:50, width:width-70,paddingHorizontal:10, justifyContent:'center',flexDirection:'row'}}>
              <View
                style={{flexDirection:'column', justifyContent:'center',flex:1, marginRight: 10}}>
                <Text numberOfLines={1} style={{color:PlainStyle.colorSet.imTitleTextColor}}>{item.title}</Text>
                <Text numberOfLines={2}
                      style={{color:'#8a9499', marginTop: 6}}>{item.content}</Text>
              </View>
              <View style={{height:50,flexDirection:'column', justifyContent:'center'}}>
                {this.renderBtn(item)}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={{backgroundColor: '#FEFEFE'}} activeOpacity={1} onLongPress={()=>{
            Alert('确定删除该条记录?', () => {
              let last = false;
              if (this.state.data.length == 1) {
                last = true;
              }
              NoticeStore.deleteNotice(item.noticeId);
              if (last) {
                this.deleteSession(item.noticeId);
                this.props.navigator.pop();
              }
            },()=>{})
          }} onPress={()=>{item.msgType == NOTICE_TYPE.UPDATE_GROUP_NAME ? this.toChat(item) : null}}>
          <View
            style={{borderBottomColor: PlainStyle.colorSet.demarcationColor, borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:16,justifyContent:'center'}}>
            <HeadPic badge={0} style={{ height:40,width: 40, marginRight:15,justifyContent:'center', marginTop: 5}}
                     source={DictIcon.imGroupNotice}/>
            <View
              style={{height:50, width:width-70,paddingHorizontal:10, justifyContent:'center',flexDirection:'row'}}>
              <View
                style={{flexDirection:'column', justifyContent:'center',flex:1, marginRight: 10}}>
                <Text numberOfLines={1} style={{color:PlainStyle.colorSet.imTitleTextColor}}>{item.title}</Text>
                <Text numberOfLines={2}
                      style={{color:'#8a9499', marginTop: 6}}>{item.content}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='群通知' showBack={true}>
        {this.state.data && <ListView renderRow={this.renderRow} dataSource={this.state.dataSource}/>}
      </NavBarView>
    );
  }
});

module.exports = GroupNotice;
