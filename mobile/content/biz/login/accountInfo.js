/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  Image
} = React;
let AppStore = require('../../framework/store/appStore');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let {Button, Alert} = require('mx-artifacts');
let Register_selectOrg = require('./selectOrg');
let Register_uploadNameCard = require('./uploadNameCard');
let Icon = require('react-native-vector-icons/Ionicons');
let Validation = require('../../comp/utils/validation');

let Register_accountInfo = React.createClass({
  getStateFromStores() {
    return {
      disabled: true,
      realName: '',
      userName: '',
      orgValue: '选择机构',
      orgId: ''
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

  toPage: function (name, param) {
      const {navigator} = this.props;
      if (navigator) {
        navigator.push(
          {
            comp: name,
            param: param,
            callBack: this.callback
          }
        );
      }
  },
  next: function(name, param){
    if(!Validation.realName(this.state.realName)){
      Alert('请输入20个字符内的中文或英文');
    }else if(!Validation.isEmail(this.state.userName)){
      Alert('请输入60个字符内的有效的邮箱地址');
    }else if(this.state.orgValue == '选择机构'){
      Alert('请选择机构');
    }else{
      this.toPage(name, param);
    }
  },

  callback: function (item) {
    this.setState({
      orgValue: item.orgValue,
      orgId: item.id,
      disabled:false
    });
  },

  _onChangeText(key, value){
    this.setState({[key]: value});
    if (this.state.realName.length == 0 || this.state.userName.length == 0 || this.state.orgValue == '选择机构') {
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
                  contentBackgroundColor='#18304D' title='输入账号信息' showBack={true} showBar={true}
      >
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input placeholder='真实姓名' maxLength={20} field='realName'
                 onChangeText={this._onChangeText} icon='user' inputType='default'
          />
          <Input placeholder='用户名(邮箱)' maxLength={60} field='userName'
                 onChangeText={this._onChangeText} icon='user' inputType ='email-address'
          />
          <TouchableHighlight activeOpacity={0.8} underlayColor='#4fb9fc'
                              onPress={()=>this.toPage(Register_selectOrg)}
                              style ={{marginTop: 20, borderRadius: 6}}
          >
            <View style={styles.selectOrg}>
              <View style = {{flex: 1, alignItems: 'center'}}>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../image/user/comp.png')}
                />
              </View>

                <Text style={{color: '#ffffff', fontSize: 18, flex: 5}}
                      numberOfLines={1}
                >
                  {this.state.orgValue}
                </Text>

              <Icon
                style={{flex: 1}}
                name="ios-arrow-right" size={28} color={'#ffffff'}
              />
            </View>
          </TouchableHighlight>

          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.next(Register_uploadNameCard,
                 {
                    mobileNo: this.props.param.mobileNo,
                    realName: this.state.realName,
                    userName: this.state.userName,
                    orgId: this.state.orgId
                 })}
          >
            下一步
          </Button>
        </View>
        <View style={{position: 'absolute',bottom:20,left:50,right:50,flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center',marginBottom:10}}>
            <Text style={{fontSize: 15, color: '#ffffff'}}>如未找到您所在的机构</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
            <Text style={{fontSize: 16, color: '#ffffff'}}>联系客服: </Text>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={{fontSize: 16, color: '#ffffff', textDecorationLine: 'underline'}}>022-28405347</Text>
            </TouchableOpacity>
          </View>
        </View>
      </NavBarView>
    );
  }
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  selectOrg: {
    flex: 1,
    height: 47,
    backgroundColor: '#148bf9',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

module.exports = Register_accountInfo;
