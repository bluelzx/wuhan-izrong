'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
  Dimensions
  } = React;
var AppStore = require('../../framework/store/appStore');
//var UserStore = require('../../framework/store/userStore');
var LoginAction = require('../../framework/action/loginAction');
//var Register_checkPhone = require('./register_checkPhone');
//var Forget_checkPhone = require('./forget_checkPhone');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var VerifyCode = require('../../comp/utils/verifyCode');
var Input = require('../../comp/utils/input');
var { Alert, Button } = require('mx-artifacts');
var Register_valiMobile = require('./register_valiMobile');
var Login_ValiSMS = require('./login_valiSMS');
var {height, width} = Dimensions.get('window');
var TabView = require('../../framework/system/tabView');


var Login = React.createClass({
  getStateFromStores() {
    //var user = UserStore.getUserInfoBean();
    var deviceModel = 'IOS';
    if (Platform.OS != 'ios') {
      deviceModel = 'ANDROID';
    }
    return {
      loaded: false,
      checked: true,
      userName: '',
      password: '',
      verify: '',
      active: false,
      deviceModel: deviceModel,
      APNSToken: AppStore.getAPNSToken()
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
  login: function () {
    if (this.state.userName && this.state.password && this.state.verify) {
      dismissKeyboard();

      this.props.exec(() => {
        return LoginAction.login({
          userName: this.state.userName,
          password: this.state.password,
          deviceToken: this.state.APNSToken,
          deviceModel: this.state.deviceModel,
          captcha: this.state.verify
        }).then((response) => {
          //this.props.navigator.pop();
          this.props.navigator.replace({
            comp: TabView
          });
        }).catch((errorData) => {
          //Alert(msg.msgContent);
          this.refs['verifyCode'].changeVerify();
          //throw errorData;
          return Promise.reject(errorData);
        });
      });
    }
  },
  toOther: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  _onChangeText(key, value){
    this.setState({[key]: value});
    if (this.state.userName.length == 0 || this.state.password.length == 0 || this.state.verify.length == 0) {
      this.setState({checked: true});
    } else {
      this.setState({checked: false});
    }
  },
  renderLogo: function () {
    return (
      <View style={{alignItems:'center',flexDirection:'column'}}>
        <Image style={{marginTop:30,height:80,width:160}}
               resizeMode='cover'
               source={require("../../image/login/logo.png")}/>
        <Text style={{color:'#ffffff',marginTop:20,fontSize:18}}>环渤海银银合作平台</Text>
      </View>
    )
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='登录' showBack={false} showBar={true}>
        <View style={[{flexDirection: 'column', flex: 1}, styles.paddingLR]}>
          {this.renderLogo()}
          <Input containerStyle={{height: 47, borderColor: '#0a1926',borderWidth: 0.5,marginTop: 20,
          backgroundColor: '#0a1926',flexDirection: 'row',alignItems: 'center',borderRadius: 6}}
                 type="default" placeholder='手机号' maxlength={20} field='userName'
                 onChangeText={this._onChangeText} icon='user'/>

          <Button
            containerStyle={{marginTop:20,backgroundColor:'#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>this.toPage(Login_ValiSMS)}>
            登录
          </Button>

          <Button
            containerStyle={{marginTop:20,backgroundColor:'#ffffff'}}
            style={{fontSize: 20, color: '#1151B1'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>this.toPage(Register_valiMobile)}>
            新用户注册
          </Button>
        </View>
        <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end'}}>
          <View style={{flexDirection:'row',justifyContent:'center',marginBottom:30}}>
            <Text style={{fontSize: 16, color: '#ffffff'}}>联系客服:</Text>
            <Text style={{fontSize: 16, color: '#ffffff',textDecorationLine:'underline'}}>021-35885888</Text>
          </View>
        </View>
      </NavBarView>
    )
  }
});
var styles = StyleSheet.create({
  radio: {
    width: 40, height: 40
  },
  menu: {
    paddingTop: 24, paddingBottom: 50,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'
  },
  rememberMe: {
    height: 60, width: 21, flexDirection: 'row', alignItems: 'center'
  },
  contact: {
    alignItems: 'center', height: 45,
  },
  colorPath: {
    fontSize: 15, color: '#333333'
  },
  leftButton: {
    marginTop: 30, left: 20, height: 40,
  },
  rightButton: {
    marginTop: 30, height: 40, right: 20,
  },
  paddingLR: {
    paddingLeft: 12, paddingRight: 12,
  },
});

module.exports = Login;
