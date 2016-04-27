/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button } = require('mx-artifacts');
let SMSTimer = require('../../comp/utils/smsTimer');
let TabView = require('../../framework/system/tabView');
let Validation = require('../../comp/utils/validation');
let PhoneNumber = require('../../comp/utils/numberHelper').phoneNumber;

let ValiSMS = React.createClass({
  getStateFromStores() {
    let deviceModel = 'IOS';
    if (Platform.OS != 'ios') {
      deviceModel = 'ANDROID';
    }
    let APNSToken = AppStore.getAPNSToken();
    return {
      disabled: true,
      verify: '',
      deviceModel: deviceModel,
      APNSToken: APNSToken,
      mobileNo: this.props.param.mobileNo
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
    if (this.state.verify.length != 6) {
      Alert('请输入完整的短信验证码');
    } else {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.login({
          mobileNo: this.props.param.mobileNo,
          inputSmsCode: this.state.verify,
          deviceToken: this.state.APNSToken,
          deviceModel: this.state.deviceModel
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
            this.props.navigator.resetTo({
              comp: 'tabView'
            });
          }
        }).catch((errorData) => {
          throw errorData;
        });
      });
    }
  },

  toOther: function (name) {
    this.props.navigator.push({
      comp: name
    });
  },

  _onChangeText(key, value){
    this.setState({[key]: value});
    if (this.state.verify.length == 0) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='短信验证' showBack={true} showBar={true}
      >
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16, color: '#ffffff', marginTop: 20}}>已发送短信验证码至</Text>
            <Text
              style={{fontSize: 16, color: '#ffffff', marginTop: 20}}>{PhoneNumber(this.props.param.mobileNo)}</Text>
          </View>
          <SMSTimer ref="smsTimer"
                    onChanged={this._onChangeText}
                    func={'sendSmsCodeToLoginMobile'}
                    parameter={this.state.mobileNo}
                    exec={this.props.exec}
          />
          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.login()}
          >
            确定
          </Button>
        </View>
      </NavBarView>
    );
  }
});
let styles = StyleSheet.create({
  radio: {
    width: 40, height: 40
  },
  menu: {
    paddingTop: 24,
    paddingBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rememberMe: {
    height: 60,
    width: 21,
    flexDirection: 'row',
    alignItems: 'center'
  },
  contact: {
    alignItems: 'center',
    height: 45
  },
  colorPath: {
    fontSize: 15,
    color: '#333333'
  },
  leftButton: {
    marginTop: 30,
    left: 20,
    height: 40
  },
  rightButton: {
    marginTop: 30,
    height: 40,
    right: 20
  },
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  }
});

module.exports = ValiSMS;
