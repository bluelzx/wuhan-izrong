/**
 * Created by vison on 16/4/6.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform
  } = React;
var AppStore = require('../../framework/store/appStore');
//var UserStore = require('../../framework/store/userStore');
var LoginAction = require('../../framework/action/loginAction');
//var Register_checkPhone = require('./register_checkPhone');
//var Forget_checkPhone = require('./forget_checkPhone');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Input = require('../../comp/utils/input');
var { Alert, Button } = require('mx-artifacts');
var SMSTimer = require('../../comp/utils/smsTimer')
var CheakBox = require('../../comp/utils/checkbox')
var Register_AccountInfo = require('./register_accountInfo');

var Register_valiMobile = React.createClass({
  getStateFromStores() {
    return {
      valiMobile:'13275805130',
      checkbox: true,
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

  selectChange(select){
    this.setState({checkbox: select})
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='短信验证' showBack={true} showBar={true}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input type="default" placeholder='手机号' maxlength={20} field='userName'
                 onChangeText={this._onChangeText} icon='user'/>
          <SMSTimer  ref="smsTimer" onChanged={this._onChange} func={'sendSMSCodeToNewMobile'}/>
          <CheakBox content="已阅读并同意用户协议"
                    onChange={this.selectChange}
                    checkedUrl={require('../../image/utils/checkbox_checked.png')}
                    unCheckedUrl={require('../../image/utils/checkbox_normal.png')}
                    checked={this.state.checkbox}/>
          <Button
            containerStyle={{marginTop:20,backgroundColor:'#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>this.toPage(Register_AccountInfo)}>
            下一步
          </Button>
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

module.exports = Register_valiMobile;
