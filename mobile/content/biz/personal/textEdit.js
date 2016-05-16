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
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');

let TextEdit = React.createClass({
  getInitialState: function () {
    let value = this.props.param.value;
    let type = this.props.param.type;
    return {
      oldPublicValue: this.props.param.publicValue,
      publicName: this.props.param.publicName,
      oldValue: (value === null || value == '' || value == '未填写') ? '' : this.props.param.value.toString(),
      newValue: this.props.param.value == '未填写' ? ''  :this.props.param.value,
      newPublicValue: this.props.param.publicValue,
      type: type,
      tele: this.props.param.name == 'phoneNumber' ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[0] ) : '',
      phone: this.props.param.name == 'phoneNumber' ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[1]) : '',

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

  textChange(text){
     if(text.length > 0) {
        this.setState({valueDisabled:true});
     }else {
         this.setState({valueDisabled:false});
     }
  },

  validate: function () {

    switch (this.props.param.name) {
      case 'realName':
        if(this.state.newValue.length == 0){
          Alert('姓名不能为空');
        }else if (this.state.newValue.length <= 20) {
          this.updateUserInfo();
        } else {
          Alert('请输入20个字符内的中文或英文');
        }
        break;
      case 'phoneNumber':
          if (this.state.tele == '' && this.state.phone == '') {
              this.setState({
                  newValue: ''
              });
          } else {
              this.setState({
                  newValue: this.state.tele + '-' + this.state.phone
              });
          }
          if (Validation.isTelephone(this.state.newValue) || (this.state.tele == '' && this.state.phone == '')) {
          this.updateUserInfo();
          } else if ((this.state.newValue == '未填写-undefined')) {
            const { navigator } = this.props;
            if (navigator) {
                navigator.pop();
            }
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
        if (Validation.isWechat(this.state.newValue)) {
          this.updateUserInfo();
        } else {
          Alert('请输入40个字符内的正确微信号');
        }
        break;

      case 'department':
          if(this.state.newValue.length > 20){
              Alert('请输入20个字符内的部门信息');
          }else {
              this.updateUserInfo();
          }
        break;
      case 'jobTitle':
          if(this.state.newValue.length > 20){
              Alert('请输入20个字符内的职位信息');
          }else {
              this.updateUserInfo();
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
    }else {
      const { navigator } = this.props;
      if (navigator) {
        navigator.pop();
      }
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
              navigator.pop();
          }
        }).catch((errorData) => {
          Alert(errorData.msgContent || errorData.message);
        });
    });
  },

  renderUpdate: function () {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={()=>this.validate()}>
        <Text style={{color: '#ffffff'}}>
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
        <View style={{backgroundColor:PlainStyle.colorSet.textEditBackground, height: 50}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: PlainStyle.colorSet.textEditTextColor, fontSize: 18, marginLeft: 20}}>公开此信息</Text>
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
        <NavBarView navigator={this.props.navigator}title={this.props.param.title} actionButton={this.renderUpdate}>
          <View
            style={[DictStyle.textEditItem,{marginTop: 20}]}
          >
            <View style={[styles.view, {flexDirection: 'row'}]}>
              <TextInput style={[styles.text, {width: 70}]} defaultValue={this.state.oldValue.split('-')[0]}
                         keyboardType='number-pad'
                         underlineColorAndroid="transparent"
                         maxLength={4}
                         onChangeText={(text) => {
                         this.setState({tele:text});
                         this.textChange(text);
                         }}
                         autoCapitalize="none"
                         autoCorrect={false}

              />
              <Text style={styles.text}>-</Text>
              <TextInput style={[styles.text, {flex: 1, marginLeft: 20}]}
                         underlineColorAndroid="transparent"
                         defaultValue={this.state.oldValue.split('-')[1]}
                         keyboardType='number-pad'
                         maxLength={8}
                         onChangeText={(text) => {
                         this.setState({phone:text});
                         this.textChange(text);
                         }}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    } else if (this.props.param.needPublic && this.props.param.needEdit) {
      return (
        <NavBarView navigator={this.props.navigator} title={this.props.param.title} actionButton={this.renderUpdate}>
          <View
            style={[DictStyle.textEditItem,{marginTop: 20}]}
          >
            <View style={styles.view}>
              <TextInput style={styles.text} defaultValue={this.state.oldValue}
                         keyboardType={this.props.param.type}
                         underlineColorAndroid="transparent"
                         maxLength={this.props.param.maxLength}
                         onChangeText={(text) => {
                         this.setState({newValue:text});
                         this.textChange(text);
                         }}
                         //autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    } else if (!this.props.param.needPublic && this.props.param.needEdit) {
      return (
        <NavBarView navigator={this.props.navigator} title={this.props.param.title} actionButton={this.renderUpdate}>
          <View
            style={[DictStyle.textEditItem,{marginTop: 20}]}
          >
            <View style={styles.view}>
              <TextInput style={styles.text} defaultValue={this.state.oldValue}
                         keyboardType={this.props.param.type}
                         underlineColorAndroid="transparent"
                         maxLength={this.props.param.maxLexngth}
                         onChangeText={(text) => {
                         this.setState({newValue:text});
                         this.textChange(text);
                         }}
                         //autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
          </View>
        </NavBarView>
      );
    } else if (this.props.param.needPublic && !this.props.param.needEdit) {
      return (
        <NavBarView navigator={this.props.navigator} title={this.props.param.title} actionButton={this.renderUpdate}>
          <View
            style={[DictStyle.textEditItem,{marginTop: 20}]}
          >
            <View style={styles.view}>
              <Text style={styles.text}>{this.state.oldValue}</Text>
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    }
  }
});

let styles = StyleSheet.create({
  view: {
    marginTop: 10,
    marginLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: PlainStyle.colorSet.textEditBorderColor
  },
  text: {
    fontSize: 18,
    height: 40,
    color: PlainStyle.colorSet.textEditTextColor,
    paddingBottom: 10
  }
});
module.exports = TextEdit;
