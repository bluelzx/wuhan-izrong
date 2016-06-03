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
  Image,
  InteractionManager
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
let LoginAction = require('../../framework/action/loginAction');
let DictStyle = require('../../constants/dictStyle');
let CallPhone = require('../../comp/utils/callPhone');
let PlainStyle = require('../../constants/dictStyle');


let Register_accountInfo = React.createClass({
  getStateFromStores() {
    return {
      disabled: true,
      realName: '',
      email: '',
      referenceMobileNo: '',
      orgValue: '选择机构',
      orgId: ''
    };
  },

  getOrgList: function () {
    this.props.exec(() => {
      return LoginAction.getOrgList({})
        .then((response) => {
          AppStore.saveOrgList(response);
        }).catch((errorData) => {
          throw errorData;
        });
    }, false);
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
    InteractionManager.runAfterInteractions(() => {
      this.getOrgList();
    });
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name, param, callback) {
    const {navigator} = this.props;
    if (navigator) {
      navigator.push(
        {
          comp: name,
          param: param,
          callBack: callback
        }
      );
    }
  },

  next: function (name, param) {
    dismissKeyboard();
    if (!Validation.realName(this.state.realName)) {
      Alert('姓名只可输入10个字符内的英文或中文');
    } else if (!Validation.isEmail(this.state.email)) {
      Alert('请输入60个字符内的有效的邮箱地址');
    } else if (this.state.orgValue == '选择机构') {
      Alert('请选择机构');
    } else if (this.state.referenceMobileNo != '' && !Validation.isMobile(this.state.referenceMobileNo)) {
      Alert('请输入正确的推荐人手机号码');
    } else {
      this.props.exec(()=> {
        return LoginAction.validateEmail({
          email: this.state.email
        }).then((response) => {
          this.toPage(name, param);
        }).catch((errorData) => {
          throw errorData;
        });
      });
    }
  },

  callback: function (item) {
    if (this.state.realName.length == 0 || this.state.email.length == 0) {
      this.setState({
        orgValue: item.orgValue,
        orgId: item.id,
        disabled: true
      });
    } else {
      this.setState({
        orgValue: item.orgValue,
        orgId: item.id,
        disabled: false
      });
    }
  },

  _onChangeText(key, value){
    this.setState({[key]: value});
    if (this.state.realName.length == 0 || this.state.email.length == 0 || this.state.orgValue == '选择机构') {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='输入账号信息'>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Input placeholder='真实姓名' maxLength={20} field='realName'
                 onChangeText={this._onChangeText} icon='realName' inputType='default'
          />
          <Input placeholder='邮箱' maxLength={60} field='email'
                 onChangeText={this._onChangeText} icon='email' inputType='email-address'
          />
          <Input placeholder='推荐人手机号,赢取神秘大奖~' maxLength={11} field='referenceMobileNo'
                 onChangeText={this._onChangeText} icon='phone' inputType='number-pad'
          />

          <TouchableHighlight activeOpacity={0.8} underlayColor='#4fb9fc'
                              onPress={()=>this.toPage(Register_selectOrg,{needAll:false},this.callback)}
                              style={{marginTop: 12, borderRadius: 6}}
          >
            <View style={styles.selectOrg}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../image/user/comp.png')}
                />
              </View>
              <Text style={{color: '#3b4549', fontSize: 18,marginLeft:20,flex: 5}} numberOfLines={1}>
                {this.state.orgValue}
              </Text>

              <Icon
                style={{flex: 1}}
                name="ios-arrow-right" size={28} color={'#4074e6'}
              />
            </View>
          </TouchableHighlight>
          <Button
            containerStyle={{marginTop: 40}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabledBackgroundColor='#b3c7f5'
            enabledBackgroundColor='#4b76df'
            disabled={this.state.disabled}
            onPress={()=>this.next(Register_uploadNameCard,
                 {
                    mobileNo: this.props.param.mobileNo,
                    realName: this.state.realName,
                    email: this.state.email,
                    referenceMobileNo:this.state.referenceMobileNo,
                    orgId: this.state.orgId
                 })}
          >
            下一步
          </Button>
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
    backgroundColor: '#ffffff',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#5d9bec',
    borderWidth: 1
  },

  containerStyle: {
    height: 47,
    borderColor: '#5d9bec',
    borderWidth: 1,
    marginTop: 12,
    backgroundColor: PlainStyle.colorSet.inputBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6
  },

  iconStyle: {
    width: 16,
    height: 16,
    marginLeft: 9
  }
});

module.exports = Register_accountInfo;
