'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  ScrollView
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
          throw errorData;
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

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title="登录" showBack={false}>
          <View style={{flexDirection: 'column', flex: 1, paddingLeft: 12, paddingRight: 12}}>
            <Input placeholder='用户名/手机号' maxlength={20} field='userName'
                   onChangeText={this._onChangeText} icon='user' value={this.state.userName} />

            <Input placeholder='密码' maxlength={16} field='password' inputType='password'
                   onChangeText={this._onChangeText} icon='password' value={this.state.password} />

            <VerifyCode ref='verifyCode' onChanged={this._onChangeText} />

            <View style={{marginTop: 24}}>
              <Button onPress={this.login} disabled={this.state.checked}>登录</Button>
            </View>

            <View style={styles.menu}>
              <TouchableOpacity onPress={(()=>{this.toOther(Register_checkPhone)})}>
                <Text style={styles.colorPath}>新用户注册</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(()=>{this.toOther(Forget_checkPhone)})}>
                <Text style={styles.colorPath}>忘记密码?</Text>
              </TouchableOpacity>
            </View>
          </View>
      </NavBarView>
    );
  },

  //render: function () {
  //  //LoginAction.registerAPNS()
  //  return (
  //    <NavBarView title="登录" navigator={this.props.navigator} showBack={true}>
  //      <View style={[{flexDirection: 'column', flex: 1, marginTop: 20}, styles.paddingLR]}>
  //        <Input placeholder='用户名/手机号' maxlength={20} field='userName'
  //               onChangeText={this._onChangeText} icon='user' />
  //
  //        <Input placeholder='密码' maxlength={16} field='password' inputType='password'
  //               onChangeText={this._onChangeText} icon='password' />
  //
  //        <VerifyCode ref='verifyCode' onChanged={this._onChangeText}/>
  //
  //        <View style={{marginTop: 24}}>
  //          <Button onPress={this.login} disabled={this.state.checked}>登录</Button>
  //        </View>
  //        <View style={styles.menu}>
  //          <TouchableOpacity onPress={(()=>{this.toOther(Register_checkPhone)})}>
  //            <Text style={styles.colorPath}>新用户注册</Text>
  //          </TouchableOpacity>
  //          <TouchableOpacity onPress={(()=>{this.toOther(Forget_checkPhone)})}>
  //            <Text style={styles.colorPath}>忘记密码?</Text>
  //          </TouchableOpacity>
  //        </View>
  //      </View>
  //    </NavBarView>
  //  );
  //}
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
  }
});

module.exports = Login;
