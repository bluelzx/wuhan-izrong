/**
 * Created by vison on 16/4/8.
 */
'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
//let NameCircular = require('./nameCircular').NameCircular;
let HeaderPic = require('./headerPic');
let DictStyle = require('../../constants/dictStyle');
let { Button} = require('mx-artifacts');

let ImUserInfo = React.createClass({


  getStateFromStores: function() {
    ////// 是否已经是好友
    let userInfo;
    if(!this.props.param.isStranger){
      userInfo = ContactStore.getUserInfoByUserId(this.props.param.userId);
    }else{
      userInfo = this.props.param;
    }

    console.log(userInfo.mute);
    return{
      data:userInfo,
      mute:userInfo.mute||false,
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },

  switchControl(open){
    this.setState({mute: open});
    //TODO: 在这里调用后台借口可能会卡机
    this.props.exec(() => {
      return ContactAction.muteUser(this.props.param.userId, open);
    });

  },

  descValue: function(value){
    if(!value || value.length==0){
      return '未填写';
    }else{
      return value;
    }
  },

  renderMute: function() {
    if(ContactStore.getUserInfo().userId == this.props.param.userId)
      return null;
    else
      return (
      <View style={[{height:50,marginTop:5},styles.itemBackColor,{borderBottomWidth:0.5,borderBottomColor:'#F4F4F4'}]}>
        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{color:  DictStyle.colorSet.commonTextColor,fontSize:18,marginLeft:20}}>屏蔽此人</Text>
          <Switch style={{margin:20}}
                  value={this.state.mute}
                  onValueChange={this.switchControl}/>
        </View>
      </View>
    );
  },

  addFriend: function() {
    this.props.exec(()=>{
      return ContactAction.addFriend(this.props.param.userId).then((response)=>{
        ContactStore.addFriend(this.props.param);
      }).then((response)=>{
        this.props.navigator.popToTop();
      }).catch((err)=>{
        throw err;
      });
    });

  },

  renderAdd: function() {

    //<TouchableOpacity onPress={()=>this.addFriend()}>
    //  <View
    //    style={{marginRight:10,borderRadius:6,flex:1,backgroundColor:'#44B5E6',height:40,justifyContent:'center', alignItems:'center'}}>
    //    <Text style={{color:'#ffffff',textAlign:'center'}}>加为好友</Text>
    //  </View>
    //</TouchableOpacity>
    if(!this.props.param.isStranger){
     return null;
    }else {
      return (
        <View style={{paddingHorizontal:10}}>
      <Button
        containerStyle={{marginTop: 20, backgroundColor: '#4fb9fc'}}
        style={{fontSize: 20, color: '#ffffff'}}
        onPress={()=>this.addFriend()}
      >
        加为好友
      </Button>
          </View>
      );
    }
  },

  render: function () {
    let {title}  = this.props;
    let privateDesc = "未公开";
    return (
      <NavBarView navigator={this.props.navigator} title='详细资料'>
        <ScrollView automaticallyAdjustContentInsets={false}  horizontal={false}>

          <View style={styles.itemBackColor} >
            <View style={styles.layout}>
              <View style={{paddingLeft:16}}>
                <HeaderPic  photoFileUrl={this.state.data.photoFileUrl}  certified={this.state.data.certified} name={this.state.data.realName}/>
              </View>
              <Text style={{color:'#979fa2',fontSize:18, marginRight:20}}>{this.state.data.realName}</Text>
            </View>
          </View>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="手机号:" imgPath={require('../../image/user/mobileNo.png')} value={this.state.data.publicMobile?this.descValue(this.state.data.mobileNumber):privateDesc}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="座机号:" imgPath={require('../../image/user/telephoneNo.png')} value={this.state.data.publicPhone?this.descValue(this.state.data.phoneNumber):privateDesc}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="QQ:" imgPath={require('../../image/user/qqNo.png')} value={this.state.data.publicQQ?this.descValue(this.state.data.qqNo):privateDesc}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="微信:" imgPath={require('../../image/user/wechatNo.png')} value={this.state.data.publicWeChat?this.descValue(this.state.data.weChatNo):privateDesc}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="电子邮箱:" imgPath={require('../../image/user/email.png')} value={this.state.data.publicEmail?this.descValue(this.state.data.email):privateDesc}/>
          <View style={{marginTop:5,backgroundColor:'transparent',borderBottomWidth:0.5,borderBottomColor:'#F4F4F4'}}></View>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="机构:" imgPath={require('../../image/user/comp.png')} value={this.state.data.orgValue}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="部门:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.data.publicDepart?this.descValue(this.state.data.department):privateDesc}/>
          <Item itemStyle={styles.itemBackColor} hiddenArrow={true} wrap={true} desc="职位:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.data.publicTitle?this.descValue(this.state.data.jobTitle):privateDesc}/>
          {this.renderMute()}
          {this.renderAdd()}
          <View style={{height:20}}></View>
        </ScrollView>
      </NavBarView>
    );
  }
});

let styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84,
    borderBottomWidth: 0.5,
    borderBottomColor: DictStyle.colorSet.demarcationColor
  },
  img: {
    width: 63,
    height: 63,
    borderRadius: 5,
    marginTop: 18,
    borderColor: '#7f7f7f',
    borderWidth: 1
  },
  head: {
    width: 60,
    height: 60,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  },
  itemBackColor:{
    backgroundColor:'#FEFEFE'
  }
});

module.exports = ImUserInfo;
