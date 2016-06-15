/**
 * Created by vison on 16/4/6.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let { Alert, Button } = require('mx-artifacts');
let SMSTimer = require('../../comp/utils/smsTimer');
let CheckBox = require('../../comp/utils/checkboxUtil');
let Register_AccountInfo = require('./accountInfo');
let RegisterPotocol = require('./registerPotocol');
let DictStyle = require('../../constants/dictStyle');
let PlainStyle = require('../../constants/dictStyle');
let CallPhone = require('../../comp/utils/callPhone');
let AppInfoModule = require('NativeModules').AppInfoModule;

let Register_valiMobile = React.createClass({
  getStateFromStores() {
    return {
      mobileNo: '',
      verify: '',
      checkbox: true,
      disabled: true,
      smsDisabled: true
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
        }).then(()=>{
          if (Platform.OS === 'android') {
            AppInfoModule.getPushRegId((id, deviceModel) => {
              AppStore.saveApnsToken(id, true);
              AppStore.saveDeviceModel(deviceModel)
            });
          }
        }).catch((errorData) => {
          throw errorData;
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
    if(this.state.mobileNo.length == 0){
      this.setState({smsDisabled: true});
    }else{
      this.setState({smsDisabled: false});
    }
  },

  selectChange(select){
    this.setState({checkbox: select});
    if(this.state.checkbox && this.state.mobileNo.length != 0 && this.state.verify.length != 0){
      this.setState({disabled: false});
    }else{
      this.setState({disabled: true});
    }
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='注册'>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input placeholder='手机号' maxLength={11} field='mobileNo'
                 onChangeText={this._onChangeText} icon='phone' inputType='number-pad'
          />

          <SMSTimer ref="smsTimer"
                    func={LoginAction.sendSmsCodeToRegisterMobile}
                    parameter={this.state.mobileNo}
                    onChanged={this._onChangeText}
                    disabled={this.state.smsDisabled}
                    exec={this.props.exec}
          />
          <View style={{flexDirection: 'row'}}>
            <CheckBox content="已阅读并同意"
                      onChange={this.selectChange}
                      checkedUrl={require('../../image/utils/radioChecked.png')}
                      unCheckedUrl={require('../../image/utils/radioUncheck.png')}
                      checked={this.state.checkbox}
            />
            <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.content}
                                onPress={()=>this.toPage(RegisterPotocol)}
            >
              <Text style={{ marginLeft: -5,marginTop: 20, color: 'grey', fontSize: 16, lineHeight: 20}}>
                《用户协议》
              </Text>
            </TouchableHighlight>
          </View>

          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabledBackgroundColor = '#b3c7f5'
            enabledBackgroundColor = '#4b76df'
            disabled={this.state.disabled}
            onPress={()=>this.validateSmsCode()}
          >
            下一步
          </Button>
        </View>
      </NavBarView>
    );
  }
//<View style={{position: 'absolute',bottom:20,left:50,right:50,flexDirection: 'column'}}>
//  <View style={{flexDirection: 'row', justifyContent: 'center',flex:1,alignItems:'center'}}>
//    <Text style={[DictStyle.fontSize,DictStyle.fontColor]}>联系客服:</Text>
//    <TouchableOpacity onPress={()=>{CallPhone.callPhone('022-28405347')}}>
//      <Text style={[DictStyle.fontSize,DictStyle.fontColor,{textDecorationLine: 'underline'}]}>022-28405347</Text>
//    </TouchableOpacity>
//  </View>
//</View>
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

