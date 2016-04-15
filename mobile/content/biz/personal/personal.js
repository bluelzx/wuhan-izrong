/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
let Login = require('../../biz/login/login');
let Item = require('../../comp/utils/item');
let UserInfo = require('../../biz/personal/userInfo');
let AboutUs = require('./aboutUs');
let SelectOrg  = require('../../biz/login/selectOrg');
let UserInfoAction = require('../../framework/action/userInfoAction');
let AppStore = require('../../framework/store/appStore');

let Personal = React.createClass({
  getInitialState: function () {
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgBeanId);
    return {
      userName: userInfo.realName,
      orgName: orgBean.orgValue
    }
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },

  toPage: function () {
    const { navigator } = this.props;
    if (navigator) {
      if (AppStore.getToken()){
        navigator.push({comp: UserInfo});
      }else{
        navigator.push({comp: Login});
      }
    }
  },

  returnImg: function () {

  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人' showBack={false} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          <View style={{backgroundColor:"#18304b",height:10}}/>
          <View style={{backgroundColor:'#162a40'}}>
            <TouchableHighlight activeOpacity={0.8} underlayColor='#18304b'
                                onPress={()=>this.toPage()}>
              <View style={styles.layout}>
                <View style={{flexDirection:'row'}}>
                  <Image style={styles.head} resizeMode="cover" source={require('../../image/user/head.png')}/>
                  <View style={{marginLeft:20,marginTop:10}}>
                    <Text style={{fontSize: 18,color: '#ffffff'}}>{this.state.userName}</Text>
                    <Text style={{fontSize: 18,color: '#ffffff',marginTop:10,width:200}} numberOfLines={1}>{this.state.orgName}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{backgroundColor:"#18304b",height:10}}/>
          <Item desc="用户指导" img = {false} value={this.state.realName}
                func={() => this.toPage(AboutUs)}/>
          <Item desc="关于我们" img = {false} value={this.state.realName}
                func={() => this.toPage(AboutUs)}/>

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
    height: 84
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


module.exports = Personal;
