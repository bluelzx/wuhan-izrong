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
  } = React;
let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let Login = require('../../biz/login/login');
let Item = require('../../comp/utils/item');
let UserInfo = require('../../biz/personal/userInfo');
let AboutUs = require('./aboutUs');
let {Button} = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');

let Personal = React.createClass({

  getStateFromStores: function(){
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgId);
    return {
      userName: userInfo.realName,
      orgName: orgBean.orgValue,
      photoFileUrl: userInfo.photoFileUrl
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name});
    }
  },

  returnImg: function(){
    let url = require('../../image/user/head.png');
    if (!_.isEmpty(this.state.photoFileUrl)) {
      url = {uri: this.state.photoFileUrl};
      return url;
    }
      return url;
  },

  render: function () {
    let {title} = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人' showBack={false} showBar={true}
      >
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          <View style={{backgroundColor: '#18304b', height:10}}/>
            <TouchableHighlight activeOpacity={0.8} underlayColor='#18304b' style={{backgroundColor:'#162a40'}}
                                onPress={()=>this.toPage(UserInfo)}
            >
              <View style={styles.layout}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={styles.head} resizeMode="cover" source={this.returnImg()}/>
                  <View style={{marginLeft: 20, marginTop:10}}>
                    <Text style={{fontSize: 18, color: '#ffffff'}}>{this.state.userName}</Text>
                    <Text style={{fontSize: 18, color: '#ffffff', marginTop: 10, width: 200}} numberOfLines={1}>{this.state.orgName}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          <View style={{backgroundColor: '#18304b', height:10}}/>
          <Item desc="用户指导" img = {false} value={this.state.realName}
                func={() => this.toPage(AboutUs)}
          />
          <Item desc="关于我们" img = {false} value={this.state.realName}
                func={() => this.toPage(AboutUs)}
          />
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
