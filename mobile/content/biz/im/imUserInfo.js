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

let ImUserInfo = React.createClass({


  getStateFromStores: function() {
    let userInfo = ContactStore.getUserInfoByUserId(this.props.param.userId);
    console.log(userInfo.mute);
    return{
      data:userInfo,
      mute:userInfo.mute
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
      <View style={{backgroundColor:'transparent',height:50,marginTop:20}}>
        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{color:  DictStyle.colorSet.commonTextColor,fontSize:18,marginLeft:20}}>屏蔽此人</Text>
          <Switch style={{margin:20}}
                  value={this.state.mute}
                  onValueChange={this.switchControl}/>
        </View>
      </View>
    );
  },

  renderAdd: function() {
    return (
      <TouchableOpacity onPress={()=>''}>
        <View style={{marginRight:10,borderRadius:6,flex:1,backgroundColor:'#44B5E6',height:40,justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'#ffffff',textAlign:'center'}}>加为好友</Text>
        </View>
      </TouchableOpacity>
    );
  },

  render: function () {
    let {title}  = this.props;
    let privateDesc = "未公开";
    return (
      <NavBarView navigator={this.props.navigator} title='详细资料'>
        <ScrollView automaticallyAdjustContentInsets={false}  style={{paddingLeft:10}} horizontal={false}>

          <View style={{backgroundColor:'transparent'}} >
            <View style={styles.layout}>
              <View style={{paddingLeft:16}}>
                <HeaderPic  photoFileUrl={this.state.data.photoFileUrl}  certified={this.state.data.certified} name={this.state.data.realName}/>
              </View>
              <Text style={{color:'#979fa2',fontSize:18, marginRight:20}}>{this.state.data.realName}</Text>
            </View>
          </View>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="手机号:" imgPath={require('../../image/user/mobileNo.png')} value={this.state.data.publicMobile?this.descValue(this.state.data.mobileNumber):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="座机号:" imgPath={require('../../image/user/telephoneNo.png')} value={this.state.data.publicPhone?this.descValue(this.state.data.phoneNumber):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="QQ:" imgPath={require('../../image/user/qqNo.png')} value={this.state.data.publicQQ?this.descValue(this.state.data.qqNo):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="微信:" imgPath={require('../../image/user/wechatNo.png')} value={this.state.data.publicWeChat?this.descValue(this.state.data.weChatNo):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="电子邮箱:" imgPath={require('../../image/user/email.png')} value={this.state.data.publicEmail?this.descValue(this.state.data.email):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="机构:" imgPath={require('../../image/user/comp.png')} value={this.state.data.orgValue}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="部门:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.data.publicDepart?this.descValue(this.state.data.department):privateDesc}/>
          <Item itemStyle={{backgroundColor:'transparent'}} hiddenArrow={true} wrap={true} desc="职位:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.data.publicTitle?this.descValue(this.state.data.jobTitle):privateDesc}/>
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
  }
});

module.exports = ImUserInfo;
