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
  TouchableHighlight,
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');

let ImUserInfo = React.createClass({


  getStateFromStores: function() {
    return ContactStore.getUserInfoByUserId(this.props.param.userId);
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },

  switchControl(open){
    this.setState({switchOpen: open});
    //TODO: 在这里调用后台借口可能会卡机
    this.props.exec(() => {
      return ContactAction.muteUser(this.props.param.userId, value);
    });

  },

  render: function () {
    let {title}  = this.props;
    let privateDesc = "未公开";
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='详细资料' showBack={true} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false} backgroundColor='#18304b'>

          <TouchableHighlight style={{backgroundColor:'#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                              onPress={()=>this.selectPhoto()}>
            <View style={styles.layout}>
              <Image style={styles.head} resizeMode="cover" source={require('../../image/user/head.png')}/>
              <Text style={{color:'#ffffff',fontSize:18, marginRight:20}}>张某某</Text>
            </View>
          </TouchableHighlight>
          <Item showArrow={false} desc="手机号:" imgPath={require('../../image/user/mobileNo.png')} value={this.state.publicMobile?this.state.mobileNumber:privateDesc}/>
          <Item showArrow={false} desc="座机号:" imgPath={require('../../image/user/telephoneNo.png')} value={this.state.publicPhone?this.state.phoneNumber:privateDesc}/>
          <Item showArrow={false} desc="QQ:" imgPath={require('../../image/user/qqNo.png')} value={this.state.publicQQ?this.state.qqNo:privateDesc}/>
          <Item showArrow={false} desc="微信:" imgPath={require('../../image/user/wechatNo.png')} value={this.state.publicWeChat?this.state.weChatNo:privateDesc}/>
          <Item showArrow={false} desc="电子邮箱:" imgPath={require('../../image/user/email.png')} value={this.state.publicEmail?this.state.email:privateDesc}/>
          <Item showArrow={false} desc="机构:" imgPath={require('../../image/user/comp.png')} value={this.state.orgValue}/>
          <Item showArrow={false} desc="部门:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.publicDepart?this.state.department:privateDesc}/>
          <Item showArrow={false} desc="职位:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.publicTitle?this.state.jobTitle:privateDesc}/>
          <View style={{backgroundColor:'#162a40',height:50,marginTop:20}}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <Text style={{color: '#ffffff',fontSize:18,marginLeft:20}}>屏蔽此人</Text>
              <Switch style={{margin:20}}
                      value={this.state.switchOpen}
                      onValueChange={this.switchControl}/>
            </View>
          </View>

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
    borderBottomColor: '#0a1926'
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
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  }
});

module.exports = ImUserInfo;
