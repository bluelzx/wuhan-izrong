/**
 * Created by vison on 16/4/5.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
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
var Register_selectOrg = require('./register_selectOrg');
var Register_uploadNameCard = require('./register_uploadNameCard')

var Register_accountInfo = React.createClass({
  getStateFromStores() {
    return {};
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
                  contentBackgroundColor='#18304D' title='输入账号信息' showBack={true} showBar={true}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input type="default" placeholder='真实姓名' maxlength={20} field='userName'
                 onChangeText={this._onChangeText} icon='user'/>
          <Input type="default" placeholder='用户名(邮箱)' maxlength={20} field='userName'
                 onChangeText={this._onChangeText} icon='user'/>
          <TouchableHighlight activeOpacity={0.8} underlayColor='#18304b'
                              onPress={()=>this.toPage(Register_selectOrg)}>
            <View style={styles.container}>

            </View>
          </TouchableHighlight>
          <Button
            containerStyle={{marginTop:20,backgroundColor:'#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>this.toPage(Register_uploadNameCard)}>
            下一步
          </Button>
        </View>

      </NavBarView>
    )
  }
});
var styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  container: {
    height: 47,
    backgroundColor: '#1151B1',
    marginTop: 20,
    borderRadius: 6
  }
});

module.exports = Register_accountInfo;
