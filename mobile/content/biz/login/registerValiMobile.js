/**
 * Created by vison on 16/4/6.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  View,
  Text,
  TouchableHighlight
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let { Alert, Button } = require('mx-artifacts');
let SMSTimer = require('../../comp/utils/smsTimer');
let CheakBox = require('../../comp/utils/checkboxUtil');
let Register_AccountInfo = require('./accountInfo');
let RegisterPotocol = require('./registerPotocol');

let Register_valiMobile = React.createClass({
  getStateFromStores() {
    return {
      mobileNo: '',
      verify: '',
      checkbox: true,
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

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name});
    }
  },

  validateSmsCode: function () {
    if (this.state.mobileNo && this.state.verify) {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.validateSmsCode({
          mobileNo: this.state.mobileNo,
          inputSmsCode: this.state.verify
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
            if (!this.state.disabled) {
              navigator.push(
                {
                  comp: Register_AccountInfo,
                  param: {
                    mobileNo: this.state.mobileNo
                  }
                });
            }
          }
        }).catch((errorData) => {
          Alert(errorData.msgContent);
        });
      });
    }
  },


  _onChangeText(key, value){
    this.setState({[key]: value});
    if (this.state.mobileNo.length == 0 || this.state.verify.length == 0 || !this.state.checkbox) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },

  selectChange(select){
    this.setState({checkbox: select});
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='短信验证' showBack={true} showBar={true}
      >
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input containerStyle={styles.inputStyle} placeholder='手机号' maxLength={11} field='mobileNo'
                 onChangeText={this._onChangeText} icon='user' inputType='number-pad'
          />

          <SMSTimer ref="smsTimer"
                    func={'sendSmsCodeToRegisterMobile'}
                    parameter={this.state.mobileNo}
                    onChanged={this._onChangeText}
                    exec={this.props.exec}
          />
          <View style={{flexDirection: 'row'}}>
            <CheakBox content="已阅读并同意"
                      onChange={this.selectChange}
                      checkedUrl={require('../../image/utils/checkbox_checked.png')}
                      unCheckedUrl={require('../../image/utils/checkbox_normal.png')}
                      disabled={this.state.checkbox}
            />
            <TouchableHighlight activeOpacity={0.8} underlayColor='#18304b'
                                onPress={()=>this.toPage(RegisterPotocol)}
            >
              <Text style={{alignItems: 'center', marginTop: 20, color: '#ffffff', fontSize: 16, lineHeight: 20}}>
                《用户协议》
              </Text>
            </TouchableHighlight>
          </View>

          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.validateSmsCode()}
          >
            下一步
          </Button>
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
  }
});

module.exports = Register_valiMobile;

