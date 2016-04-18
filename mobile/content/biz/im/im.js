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
  DeviceEventEmitter,
  Image
  }=React;
let NavBarView = require('../../framework/system/navBarView');
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
let { MSG_TYPE, MSG_CONTENT_TYPE, ITEM_TYPE } = require('../../constants/dictIm');

let _getSessionKey = (t, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return t + ':' + id;
};

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
    let option = null;
    //if (type == MSG_TYPE.REC_GROUP_MSG) {
    //  option = Object.assign({},
    //    {
    //      id: item.groupId,
    //      ownerId: item.ownerId
    //    });
    //} else {
    //  option = Object.assign({}, {id: item.userId});
    //}
    let param = {};
    if(MSG_TYPE.REC_GROUP_MSG == item.msgType){ // 区分聊天窗口类型
      param.chatType = ITEM_TYPE.GROUP;
      param.title = item.groupName;
      param.groupId = item.gid;
      param.groupMasterUid = item.groupMasterUid;
      param.sessionId = _getSessionKey(param.chatType, param.groupId);
    }else{
      param.chatType = ITEM_TYPE.USER;
      param.title = item.realName;
      param.userId = item.fromUid;
      param.sessionId = _getSessionKey(param.chatType, param.userId);
    }
    this.props.navigator.push({
      comp: Chat,
      param: param
    });
  },

  componentWillMount:function() {
    //DeviceEventEmitter.addListener('keyboardWillShow', function(e: Event) {
    //  console.log('hello RC, I am Android Native');
    //});
  },

  renderSpread: function(item) {
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
              <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.createDate)}</Text>
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

        }
      }
    ];
    return (
      <Swipeout key={item.gid} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>this.toOther(item)}>
          <View
            style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
            <HeadPic badge={item.badge} style={{height: 40,width: 40, marginRight:15}} source={DictIcon.imMyGroup} />
            <View
              style={{ height:40, width:width-70}}>
              <View
                style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#ffffff'}}>{item.groupName}</Text>
                <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.sendDate)}</Text>
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
      <Swipeout key={item.fromUid} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>this.toOther(item)}>
          <View
            style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
            <HeadPic badge={item.badge} style={{height: 40,width: 40, marginRight:15}} source={require('../../image/user/head.png')} />
            <View
              style={{ height:40, width:width-70}}>
              <View
                style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#ffffff'}}>{item.realName}</Text>
                <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.sendDate)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{MSG_CONTENT_TYPE.TEXT==item.contentType?item.content:'点击查看详情'}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  },

  renderItem: function(item, index) {

    if(item.msgType == MSG_TYPE.REC_P2P_MSG)
    return this.renderUser(item, index);
    else {
      return this.renderGroup(item, index);
    }
    //let id = item.groupId;
    //if(item.type == CONSTANT.USER){
    //  id = item.userId;
    //}
    //return (
    //  <Swipeout key={id} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
    //    <TouchableHighlight onPress={()=>this.toOther(item, item.type)}>
    //      <View
    //        style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
    //        <HeadPic badge={item.badge} style={{height: 40,width: 40, marginRight:15}} source={item.type==CONSTANT.GROUP?DictIcon.imMyGroup:require('../../image/user/head.png')} />
    //        <View
    //          style={{ height:40, width:width-70}}>
    //          <View
    //            style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
    //            <Text style={{color:'#ffffff'}}>{item.title}</Text>
    //            <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.recTime)}</Text>
    //          </View>
    //          <Text numberOfLines={1}
    //                style={{marginTop:5,color:'#687886'}}>{item.content}</Text>
    //        </View>
    //      </View>
    //    </TouchableHighlight>
    //  </Swipeout>
    //);
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
