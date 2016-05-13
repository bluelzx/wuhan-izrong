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
let DictStyle = require('../../constants/dictStyle');

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
    if (!Validation.isMobile(this.state.mobileNo)) {
      Alert('请输入11位数字的手机号码');
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
        <Text style={{fontSize:20}}>爱资融同业平台</Text>
      </View>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='登录' showBack={false}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.renderLogo()}
          <View style={{marginTop:10}}>
            <Input  type="default" placeholder='手机号' maxLength={11}
                    field='mobileNo' onChangeText={this._onChangeText} icon='phone' inputType="number-pad"
            />
          </View>


          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.sendSmsCodeToLoginMobile()}
          >
            登录
          </Button>

          <Button
            containerStyle={{marginTop: 20, backgroundColor: '#4fb9fc'}}
            style={{fontSize: 20, color: '#ffffff'}}
            onPress={()=>this.toOther(Register_valiMobile)}
          >
            新用户注册
          </Button>
        </View>
        <View style={{position: 'absolute',bottom:20,left:50,right:50,flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center',flex:1,alignItems:'center'}}>
            <Text style={[DictStyle.fontSize,DictStyle.fontColor]}>联系客服: </Text>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={[DictStyle.fontSize,DictStyle.fontColor,{textDecorationLine: 'underline'}]}>022-28405347</Text>
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
    height: 110,
    width: 100
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
