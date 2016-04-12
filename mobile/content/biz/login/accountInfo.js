/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image
  } = React;
let AppStore = require('../../framework/store/appStore');
//let UserStore = require('../../framework/store/userStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let { Alert, Button } = require('mx-artifacts');
let Register_selectOrg = require('./selectOrg');
let Register_uploadNameCard = require('./uploadNameCard');
let Icon = require('react-native-vector-icons/Ionicons');

let Register_accountInfo = React.createClass({
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
            <View style={styles.selectOrg}>
              <Image
                style={{height:20,width:20}}
                source={require('../../image/login/select_org.png')}/>
              <Text style={{color:'#ffffff',fontSize:18}}>选择机构</Text>
                <Icon name="ios-arrow-right" size={28} color={'#ffffff'}/>
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
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  selectOrg: {
    flex:1,
    height: 47,
    backgroundColor: '#1151B1',
    marginTop: 20,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around'
  }
});

module.exports = Register_accountInfo;