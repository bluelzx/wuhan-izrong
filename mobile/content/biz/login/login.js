'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
  } = React;
let lodash = require('lodash');
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let {Alert, Button, Communications} = require('mx-artifacts');
let Register_valiMobile = require('./registerValiMobile');
let Login_ValiSMS = require('./loginValiSMS');
let Validation = require('../../comp/utils/validation');

let Login = React.createClass({
  getStateFromStores() {
    return {
      mobileNo: '',
      disabled: true
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

  sendSmsCodeToLoginMobile: function () {
    if (Validation.isMobile(this.state.mobileNo)) {
      Alert('请输入已注册的手机号码');
    } else {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.sendSmsCodeToLoginMobile({
          mobileNo: this.state.mobileNo
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
            if (!this.state.disabled) {
              navigator.push(
                {
                  comp: Login_ValiSMS,
                  param: {
                    mobileNo: this.state.mobileNo
                  }
                });
            }
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
    if (this.state.mobileNo.length == 0) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },
  renderLogo: function () {
    return (
      <View style={{alignItems: 'center', flexDirection: 'column'}}>
        <Image style={styles.logo}
               resizeMode='cover'
               source={require('../../image/login/logo.png')}
        />
        <Text style={{color: '#ffffff', marginTop: 18, fontSize: 15}}>环渤海银银合作平台</Text>
      </View>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='登录' showBack={false} showBar={true}
      >
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.renderLogo()}
          <Input containerStyle={styles.inputStyle} type="default" placeholder='手机号' maxLength={11}
                 field='mobileNo' onChangeText={this._onChangeText} icon='phone' inputType="number-pad"
          />

          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.sendSmsCodeToLoginMobile()}
          >
            登录
          </Button>

          <Button
            containerStyle={{marginTop: 20, backgroundColor: '#ffffff'}}
            style={{fontSize: 20, color: '#1151B1'}}
            onPress={()=>this.toOther(Register_valiMobile)}
          >
            新用户注册
          </Button>
        </View>
        <View style={{flexDirection: 'column', marginTop: 30}}>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
            <Text style={{fontSize: 16, color: '#ffffff'}}>联系客服:</Text>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={{fontSize: 16, color: '#ffffff', textDecorationLine: 'underline'}}>021-35885888</Text>
            </TouchableOpacity>
          </View>
        </View>
      </NavBarView>
    );
  }
});
let styles = StyleSheet.create({
  radio: {
    width: 40,
    height: 40
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
  },
  logo: {
    marginTop: 30,
    height: 60,
    width: 120
  },
  inputStyle: {
    height: 47,
    borderColor: '#0a1926',
    borderWidth: 0.5,
    marginTop: 20,
    backgroundColor: '#0a1926',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6
  }
});

module.exports = Login;
