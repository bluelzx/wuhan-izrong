'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Dimensions,
  Image
} = React;
let dismissKeyboard = require('react-native-dismiss-keyboard');
let TimerMixin = require('react-timer-mixin');
let {Alert} = require('mx-artifacts');
let Validation = require('../../comp/utils/validation');
let PlainStyle = require('../../constants/dictStyle');

let SMSTimer = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function () {
    return {
      verify: '',
      time: '获取验证码',
      active: '',
      click: false,
      disabled: this.props.disabled,
      deepColor: false
    };
  },

  getDefaultProps(){
    return {
      isNeed: false,
      disabled: false
    };
  },

  componentWillReceiveProps:function(nextProps){
    this.setState({disabled: nextProps.disabled});
  },

  changeVerify: function () {
    if (this.state.time == '重新获取' || this.props.isNeed) {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        disabled: true,
        deepColor: true,
        tim: this.setInterval(this.updateText, 1000)
      });
    } else if (this.state.time == '获取验证码') {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        disabled: true,
        deepColor: true,
        tim: this.setInterval(this.updateText, 1000)
      });
    }
  },

  selectVerifyFunction: function () {
    if (!this.state.disabled) {
      if (!Validation.isMobile(this.props.parameter)) {
        Alert('请输入11位数字的手机号码');
      } else {
        dismissKeyboard();
        this.props.exec(() => {
          return this.props.func({
            mobileNo: this.props.parameter
          }).then((response) => {
            this.changeVerify();
          }).catch((errorData) => {
            throw errorData;
          });
        });
      }
    }
  },

  updateText: function () {
    let nowTime = new Date().getTime();
    let timeGo = Math.floor((nowTime - this.state.startTime) / 1000);
    let t = --this.state.deadline;
    if (t + timeGo > 60) {
      t = timeGo >= 60 ? 0 : 60 - timeGo;
    }
    this.setState({
      deadline: t,
      time: t + '秒',
      disabled: true,
      deepColor: true
    });
    if (t == 0) {
      this.setState({
        time: '重新获取',
        click: true,
        disabled: false,
        deepColor: false,
      });
      this.clearInterval(this.state.tim);
    }
  },

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
        <View style={[styles.view, styles.radius]}>
          <TextInput style={[styles.input, {width: width - 170}]} underlineColorAndroid="transparent"
                     placeholder="短信验证码" onChangeText={(text) => this.props.onChanged( 'verify',text)}
                     autoCorrect={false} maxLength={6} keyboardType="number-pad"  clearButtonMode="while-editing"
                     placeholderTextColor= {PlainStyle.colorSet.inputPlaceholderTextColor}
          />
        </View>
        <View style={{width: 75, marginLeft: 12}}>
          <TouchableOpacity
              style={[{width: 75, height: 47}, styles.radius, styles.button,
            {backgroundColor: this.state.deepColor ? '#b3c7f5' : '#4b76df'}]}
              onPress={this.selectVerifyFunction}
              activeOpacity={this.state.deepColor ? 1 : 0.5 }
          >
            <Text style={[styles.fontColor]}>{this.state.time}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  view: {
    height: 47,
    borderColor: PlainStyle.colorSet.inputBorderColor,
    borderWidth: 1,
    backgroundColor: PlainStyle.colorSet.inputBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center', flex: 1
  },
  input: {
    fontSize: 18,
    color: PlainStyle.colorSet.inputTextColor,
    marginLeft: 9
  },
  radius: {
    borderRadius: 6
  },
  button: {
    height: 47,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontColor: {
    color: 'white'
  },
  color: {
    backgroundColor: '#8bb0d9'
  }

});
module.exports = SMSTimer;
