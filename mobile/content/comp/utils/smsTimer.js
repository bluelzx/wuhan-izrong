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
let LoginAction = require("../../framework/action/loginAction");
//let BillAction = require('../../framework/action/billAction');
let TimerMixin = require('react-timer-mixin');

let SMSTimer = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function () {
    return {
      verify: '',
      time: "点击获取",
      active: '',
      click: false
    };
  },
  getDefaultProps(){
    return {
      isNeed: false
    }
  },
  changeVerify: function () {
    if (this.state.time == "重新获取" || this.props.isNeed) {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        tim: this.setInterval(this.updateText, 1000)
      })
    } else if (this.state.time == "点击获取") {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        tim: this.setInterval(this.updateText, 1000)
      })
    }

  },

  sendSmsCodeToRegisterMobile: function () {
    dismissKeyboard();
    this.props.exec(() => {
      return LoginAction.sendSmsCodeToRegisterMobile({
        mobileNo: this.props.parameter
      }).then((response) => {
        console.log(response);
        this.changeVerify();
      }).catch((errorData) => {
        //Alert(msg.msgContent);
        throw errorData;
        this.changeVerify();
      })
    });
  },

  afterLoginChangeVerify: function () {
    if (this.state.time == "重新获取" || this.props.isNeed) {
      BillAction.sendSMSCodeForDiscount(
        {
          mobileNo: this.props.parameter
        },
        function () {
          this.setState({
            startTime: new Date().getTime(),
            deadline: 60,
            click: false,
            tim: this.setInterval(this.updateText, 1000)
          })
        }.bind(this)
      )
    } else if (this.state.time == "点击获取") {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        tim: this.setInterval(this.updateText, 1000)
      })
    }

  },


  selectVerifyFunction: function () {
    if (this.props.func === 'afterLoginSendSMSCodeToOldMobile') {
      this.afterLoginChangeVerify();
    } else if (this.props.func === 'sendSmsCodeToRegisterMobile') {
      this.sendSmsCodeToRegisterMobile();
    } else {
      this.changeVerify();
    }
  },

  updateText: function () {
    let nowTime = new Date().getTime();
    let timeGo = Math.floor((nowTime - this.state.startTime) / 1000);

    let t = --this.state.deadline;
    if (t + timeGo == 60) {

    } else if (t + timeGo > 60) {
      if (timeGo >= 60) {
        t = 0
      } else {
        t = 60 - timeGo;
      }
    }
    this.setState({
      deadline: t,
      time: t + "秒"
    });
    if (t == 0) {
      this.setState({
        time: "重新获取",
        click: true
      });
      this.clearInterval(this.state.tim);
    }
  },
  textOnchange: function (text, type) {
    this.setState({[type]: text});
    this.props.onChanged(type, this.state.verify);
  },
  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flexDirection: 'row',flex:1,marginTop:20}}>
        <View style={[styles.view,styles.radius]}>
          <Image source={require('../../image/utils/smsCode.png')}
                 style={{height:16,width:16,marginLeft:9}}/>
          <TextInput style={[styles.input,{width:width-170}]}
                     placeholder="短信验证码" onChangeText={(text) => this.textOnchange(text,"verify")}
                     autoCorrect={false} maxLength={6} keyboardType="numeric" placeholderTextColor="#7f7f7f"
                     clearButtonMode="while-editing"/>
        </View>
        <View style={{width:75,marginLeft:12}}>
          <TouchableOpacity
            style={[{width:75,height:47},styles.radius, styles.button,this.state.click && styles.color]}
            onPress={this.selectVerifyFunction}>
            <Text style={[styles.fontColor]}>{this.state.time}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
});

let styles = StyleSheet.create({
  view: {
    height: 47, borderColor: '#0a1926', borderWidth: 0.5, backgroundColor: '#0a1926',
    flexDirection: 'row', alignItems: 'center', flex: 1
  },
  input: {
    fontSize: 18, color: '#7f7f7f', marginLeft: 9
  },
  radius: {
    borderRadius: 4
  },
  button: {
    backgroundColor: '#8bb0d9',
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
