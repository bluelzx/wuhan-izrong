'use strict';

let React = require('react-native');
let {
  StyleSheet,
  View,
  TextInput,
  Text,
  Picker,
  Switch,
  TouchableOpacity
  } = React;
let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let dateFormat = require('dateformat');
let date = dateFormat(new Date(), 'yyyy-mm-dd');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button} = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let AppStore = require('../../framework/store/appStore');
let Validation = require('../../comp/utils/validation');

let TextEdit = React.createClass({
  getInitialState: function () {
    let value = this.props.param.value;
    let type = this.props.param.type;
    if (type == 'number') {
      type = 'numeric';
    } else if (type == 'name') {
      type = 'default';
    } else {
      type = 'ascii-capable';
    }
    return {
      oldPublicValue: this.props.param.publicValue,
      publicName: this.props.param.publicName,
      oldValue: (value === null || value == '' || value == '未填写') ? '' : this.props.param.value.toString(),
      newValue: this.props.param.value,
      newPublicValue: this.props.param.publicValue,
      type: type,
      tele: this.props.param.type == 'telephone' ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[0] ) : '',
      phone: this.props.param.type == 'telephone' ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[1]) : '',
      disabled: true
    };
  },

  button(){
    return (
      <Button func={this.saveValue} content="保存"/>
    );
  },

  changeTime(itemValue, type){
    Promise.resolve(
      this.setState({[type]: itemValue})
      )
      .then(
        this.setDayList(this.state.year, this.state.month)
      );
  },

  validate: function () {
    switch (this.props.param.name) {
      case 'mobileNumber':
        if (Validation.isPhone(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入13个数字内的有效的手机号码');
        }
        break;
      case 'phoneNumber':
        this.setState({
          newValue: this.state.tele + '-' + this.state.phone
        });
        if (Validation.isTelephone(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入13个字符内的有效的座机号');
        }
        break;
      case 'qqNo':
        if (Validation.isQQ(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入20个数字内的QQ号码');
        }
        break;
      case 'weChatNo':
        if (Validation.isWechat(this.state.newValue)){
          this.updateUserInfo();
        }else{
          Alert('请输入40个字符内的微信号号码');
        }
        break;

      case 'department':
        if (Validation.isChineseAndEnglish(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入20个字符内的部门信息');
        }
        break;
      case 'jobTitle':
        if (Validation.isChineseAndEnglish(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入20个字符内的职位信息');
        }
        break;
      default:
        this.updateUserInfo();
    }
  },

  updateUserInfo: function () {
    let data = {};
    if (this.state.newValue != this.state.oldValue) {
      if (this.state.newPublicValue == this.state.oldPublicValue || this.state.publicName == '') {
        data = [{
          column: this.props.param.name,
          value: this.state.newValue
        }];
        this.update(data);
      } else {
        data = [{
          column: this.props.param.name,
          value: this.state.newValue
        },
          {
            column: this.props.param.publicName,
            value: this.state.newPublicValue
          }];
        this.update(data);
      }
    } else if (this.state.newPublicValue != this.state.oldPublicValue) {
      data = [{
        column: this.props.param.publicName,
        value: this.state.newPublicValue
      }];
      this.update(data);
    }
  },

  update: function (data) {

    this.props.exec(() => {
      return UserInfoAction.updateUserInfo(data)
        .then(() => {
          data.forEach((dataItem)=> {
            AppStore.updateUserInfo(dataItem.column, dataItem.value);
          });
          const { navigator } = this.props;
          if (navigator) {
            this.props.navigator.pop();
          }
        }).catch((errorData) => {
          Alert(errorData.msgContent);
        });
    });
  },

  renderUpdate: function () {
    return (
      <TouchableOpacity style={{width: 150}} onPress={()=>this.validate()}>
        <Text style={{color: this.state.disabled ? '#ffffff' : '#ffffff'}}>
          完成
        </Text>
      </TouchableOpacity>
    );
  },

  switchControl: function (open) {
    this.setState({newPublicValue: open});
  },

  renderSwitch: function () {
    if (this.state.publicName != '') {
      return (
        <View style={{backgroundColor: '#162a40', height: 50}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: '#ffffff', fontSize: 18, marginLeft: 20}}>公开此信息</Text>
            <Switch style={{margin: 20}}
                    value={this.state.newPublicValue}
                    onValueChange={this.switchControl}
            />
          </View>
        </View>
      );
    }
  },

  render: function () {
    if (this.props.param.name == 'phoneNumber') {
      return (
        <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                    contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true} showBar={true}
                    actionButton={this.renderUpdate}
        >
          <View
            style={{backgroundColor: '#162a40', marginTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#0a1926'}}
          >
            <View style={[styles.view, {flexDirection: 'row'}]}>
              <TextInput style={[styles.text, {width: 60}]} defaultValue={this.state.oldValue.split('-')[0]}
                         keyboardType='numeric'
                         underlineColorAndroid="transparent"
                         maxLength={4}
                         onChangeText={(text) => this.setState({tele: text})}
                         autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
              <Text style={styles.text}>-</Text>
              <TextInput style={[styles.text, {flex: 1, marginLeft: 10}]}
                         underlineColorAndroid="transparent"
                         defaultValue={this.state.oldValue.split('-')[1]}
                         keyboardType='numeric'
                         maxLength={8}
                         onChangeText={(text) => this.setState({phone: text})}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    } else if (this.props.param.needEdit) {
      return (
        <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                    contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true} showBar={true}
                    actionButton={this.renderUpdate}
        >
          <View
            style={{backgroundColor: '#162a40', marginTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#0a1926'}}
          >
            <View style={styles.view}>
              <TextInput style={styles.text} defaultValue={this.state.oldValue}
                         keyboardType={this.props.param.type}
                         underlineColorAndroid="transparent"
                         maxLength={this.props.param.maxLength}
                         onChangeText={(text) => {this.setState({newValue: text})}}
                         autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    }
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true} showBar={true}
                  actionButton={this.renderUpdate}
      >
        <View
          style={{backgroundColor: '#162a40', marginTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#0a1926'}}
        >
          <View style={styles.view}>
            <Text style={styles.text}>{this.state.oldValue}</Text>
          </View>
          {this.renderSwitch()}
        </View>
      </NavBarView>
    );
  }
});
let styles = StyleSheet.create({
  view: {
    marginTop: 10,
    marginHorizontal: 20
  },
  text: {
    fontSize: 20,
    height: 40,
    color: '#ffffff',
    paddingBottom: 10
  }
});
module.exports = TextEdit;
